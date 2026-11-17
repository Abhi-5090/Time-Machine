import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

import {
  faArrowRight,
  faArrowLeft,
  faArrowUpRightFromSquare,
  faBars,
  faXmark,
  faCheck,
  faCircleCheck,
  faCircleInfo,
  faCircleExclamation,
  faTriangleExclamation,
  faShareNodes,
  faDownload,
  faFilePdf,
  faFileImage,
  faImagePortrait,
  faTrashCan,
  faRotateRight,
  faCloudArrowUp,
  faHourglassHalf,
  faFeatherPointed,
  faBoxArchive,
  faCircleQuestion,
  faSatelliteDish,
  faTowerBroadcast,
  faInfinity,
  faScroll,
  faCompass,
  faPalette,
  faShieldHalved,
  faWandMagicSparkles,
  faUserAstronaut,
  faCity,
  faSeedling,
  faRocket,
  faBrain,
  faHeartPulse,
  faMasksTheater,
  faScaleBalanced,
  faBuildingColumns,
  faEarthAmericas,
  faClockRotateLeft,
  faChartLine,
  faLightbulb,
  faQuoteLeft,
  faStar,
  faCalendarDays,
  faLocationDot,
  faBookOpen,
  faTerminal,
  faMicrochip,
  faFingerprint,
  faLayerGroup,
  faEye,
  faPenNib,
  faGaugeHigh,
  faCrosshairs,
  faSignature,
  faCameraRetro,
  faRoute,
  faFlaskVial,
  faLandmark,
} from '@fortawesome/free-solid-svg-icons';

// Font Awesome injects its own <style> tag by default, which races the app's
// stylesheet and causes a flash of oversized icons. The stylesheet is imported
// above instead, so the automatic injection is turned off.
config.autoAddCss = false;

/**
 * The icon vocabulary.
 *
 * Every icon in the product is named here, so a call site asks for a concept
 * ("chronicle", "projection") rather than reaching into the Font Awesome
 * namespace. That keeps icon choices consistent across the two timelines and
 * means a change of icon happens in exactly one place.
 */
const ICONS = {
  // Navigation & structure
  back: faArrowLeft,
  forward: faArrowRight,
  external: faArrowUpRightFromSquare,
  menu: faBars,
  close: faXmark,
  chamber: faHourglassHalf,
  terminal: faSatelliteDish,
  begin: faFeatherPointed,
  project: faTowerBroadcast,
  archive: faBoxArchive,
  help: faCircleQuestion,
  continuum: faInfinity,
  doors: faLayerGroup,

  // State & feedback
  check: faCheck,
  success: faCircleCheck,
  info: faCircleInfo,
  warning: faCircleExclamation,
  error: faTriangleExclamation,

  // Actions
  share: faShareNodes,
  download: faDownload,
  pdf: faFilePdf,
  png: faFileImage,
  portrait: faImagePortrait,
  delete: faTrashCan,
  retry: faRotateRight,
  upload: faCloudArrowUp,

  // Past vocabulary
  chronicle: faScroll,
  compass: faCompass,
  palette: faPalette,
  shield: faShieldHalved,
  magic: faWandMagicSparkles,
  quote: faQuoteLeft,
  star: faStar,
  calendar: faCalendarDays,
  place: faLocationDot,
  book: faBookOpen,
  penNib: faPenNib,
  signature: faSignature,
  landmark: faLandmark,
  columns: faBuildingColumns,
  theater: faMasksTheater,

  // 2050 vocabulary
  persona: faUserAstronaut,
  city: faCity,
  seedling: faSeedling,
  rocket: faRocket,
  brain: faBrain,
  health: faHeartPulse,
  governance: faScaleBalanced,
  world: faEarthAmericas,
  trajectory: faClockRotateLeft,
  signal: faChartLine,
  directive: faLightbulb,
  console: faTerminal,
  chip: faMicrochip,
  identity: faFingerprint,
  scan: faEye,
  gauge: faGaugeHigh,
  target: faCrosshairs,
  capture: faCameraRetro,
  route: faRoute,
  lab: faFlaskVial,
};

export const ICON_NAMES = Object.keys(ICONS);

/**
 * A themed icon.
 *
 * `size` is a pixel value applied as font size, which is how Font Awesome's SVG
 * renderer scales — it keeps the glyph optically aligned with adjacent text
 * rather than needing its own vertical nudge at every call site.
 */
export function Icon({ name, size = 16, className, style, spin = false, title, ...rest }) {
  const definition = ICONS[name];

  if (!definition) {
    if (import.meta.env?.DEV) {
      console.warn(`[Icon] Unknown icon "${name}". Add it to the registry in Icon.jsx.`);
    }
    return null;
  }

  return (
    <FontAwesomeIcon
      icon={definition}
      spin={spin}
      className={className}
      title={title}
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      style={{ fontSize: size, width: '1em', height: '1em', flex: 'none', ...style }}
      {...rest}
    />
  );
}
