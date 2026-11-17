/**
 * What each image model can actually do.
 *
 * OpenAI's image lineup moves, and the differences between generations are not
 * cosmetic: a model that does not exist on an account is a 400, a size the
 * model does not accept is a 400, and a parameter it does not implement is a
 * 400. Hardcoding one model name is what breaks a deployment months later when
 * that name is retired.
 *
 * So the model is resolved against what the account can actually see, and every
 * request is built from the capabilities below rather than from assumptions.
 */

/**
 * Best first. Unversioned ids are preferred over dated or codenamed snapshots,
 * which tend to be previews that come and go.
 */
export const IMAGE_MODEL_PREFERENCE = [
  'gpt-image-2',
  'gpt-image-2.6-sunburst',
  'gpt-image-2.6-flare',
  'gpt-image-2.5-sunburst',
  'gpt-image-2.5-flare',
  'gpt-image-1.5',
  'gpt-image-1',
  'chatgpt-image-latest',
  'gpt-image-1-mini',
  'dall-e-3',
  'dall-e-2',
];

/** Sizes each family accepts. Anything else is rejected outright. */
const SIZES = {
  gptImage: ['1024x1024', '1024x1536', '1536x1024', 'auto'],
  dalle3: ['1024x1024', '1024x1792', '1792x1024'],
  dalle2: ['256x256', '512x512', '1024x1024'],
};

/** The closest portrait shape each family can produce. */
const PORTRAIT = {
  gptImage: '1024x1536',
  dalle3: '1024x1792',
  dalle2: '1024x1024',
};

function family(model) {
  if (model === 'dall-e-3') return 'dalle3';
  if (model === 'dall-e-2') return 'dalle2';
  return 'gptImage';
}

export function capabilities(model) {
  const group = family(model);
  return {
    family: group,
    // dall-e-3 is generation-only; everything else can restage a supplied photo.
    supportsEdit: model !== 'dall-e-3',
    // `input_fidelity` only ever shipped on gpt-image-1. Every other model —
    // including the newer gpt-image-2.x line — rejects it with a 400.
    supportsInputFidelity: model === 'gpt-image-1',
    // The gpt-image family always answers in base64 and refuses response_format.
    returnsBase64: group === 'gptImage',
    sizes: SIZES[group],
    portraitSize: PORTRAIT[group],
  };
}

/** Clamps a requested size to something the model will accept. */
export function resolveSize(model, requested) {
  const { sizes, portraitSize } = capabilities(model);
  if (sizes.includes(requested)) return requested;
  return portraitSize;
}

/**
 * Picks the image model to use.
 *
 * A model named in configuration wins when the account can see it. Otherwise
 * the best available one is chosen, so an account on a newer or older lineup
 * still produces images instead of failing.
 */
export function resolveImageModel({ configured, available }) {
  const list = available instanceof Set ? available : new Set(available || []);

  if (configured && list.has(configured)) {
    return { model: configured, reason: 'configured', substituted: false };
  }

  const best = IMAGE_MODEL_PREFERENCE.find((model) => list.has(model));
  if (best) {
    return {
      model: best,
      reason: configured
        ? `"${configured}" is not available to this account; using "${best}" instead`
        : `using "${best}"`,
      substituted: Boolean(configured),
    };
  }

  // Nothing recognised — keep the configured name so the error names it.
  return {
    model: configured || IMAGE_MODEL_PREFERENCE[0],
    reason: 'no known image model is available to this account',
    substituted: false,
    unavailable: true,
  };
}

/** True when an error means "this model is not available", not "retry". */
export function isModelUnavailable(error) {
  const code = error?.code || error?.error?.code;
  const message = String(error?.message || '');

  if (['model_not_found', 'invalid_model', 'unsupported_model'].includes(code)) return true;
  // The retired-model case: 400 invalid_value, "The model '…' does not exist."
  if (/does not exist|is not available|no access to model/i.test(message)) return true;
  // An unverified organisation gets a 403 naming the model.
  return error?.status === 403 && /image/i.test(message);
}

/** True when an error means a parameter is not supported by this model. */
export function isUnsupportedParameter(error) {
  const code = error?.code || error?.error?.code;
  return (
    code === 'invalid_input_fidelity_model' ||
    /does not support the '[^']+' parameter/i.test(String(error?.message || ''))
  );
}

export function isAuthFailure(error) {
  const code = error?.code || error?.error?.code;
  return error?.status === 401 || code === 'expired_secret_key' || code === 'invalid_api_key';
}
