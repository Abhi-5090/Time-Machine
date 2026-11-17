/**
 * Canon for the 2050 timeline.
 *
 * Everything here is deliberately speculative fiction. The vocabulary is chosen
 * to read as a plausible, optimistic-but-grounded 2050 rather than as prophecy:
 * no claims are made about any real person's actual future.
 */

export const FUTURE_ARCHETYPES = [
  {
    id: 'architect',
    displayName: 'The Systems Architect',
    shortDescription: 'Designs the invisible scaffolding that keeps a hundred million lives in motion.',
    signalThemes: ['Structure', 'Foresight', 'Resilience', 'Scale'],
    roles: [
      'Principal Architect, Continental Grid Mesh',
      'Lead Designer of Autonomous Transit Lattices',
      'Chief Systems Steward, Arcology Nine',
      'Director of Planetary Load Balancing',
    ],
    environments: [
      'A glass operations deck suspended above a self-healing transit lattice',
      'A quiet control atrium where city telemetry falls like gentle rain',
      'A modular design studio that reconfigures itself around the day’s problem',
    ],
    visualMotifs: [
      'A matte charcoal technical jacket with luminous seam-piping along the shoulders',
      'Translucent schematic panels folding midair around the forearms',
      'A slim neural band at the temple pulsing with slow cyan telemetry',
    ],
    technologies: ['Self-healing infrastructure', 'Predictive load meshes', 'Digital twin cities'],
    narrativeGuidance:
      'Centres on quiet mastery of complexity — the calm of someone who can hold an entire city in their head and still remember to water the plants.',
  },
  {
    id: 'biosmith',
    displayName: 'The Bio-Smith',
    shortDescription: 'Grows what used to be manufactured, and heals what used to be discarded.',
    signalThemes: ['Regeneration', 'Patience', 'Care', 'Abundance'],
    roles: [
      'Lead Cultivator, Vertical Reef Farms',
      'Regenerative Materials Scientist',
      'Chief Steward of the Coastal Rewilding Corridor',
      'Director of Living Architecture',
    ],
    environments: [
      'A thirty-storey growing tower where sunlight is routed like water',
      'A tidal laboratory where new coral is printed and then taught to live',
      'A greenhouse spine running the full length of a reclaimed motorway',
    ],
    visualMotifs: [
      'A soft sage work-shell with living fibre panels that breathe with the wearer',
      'Gloves threaded with micro-sensors reading the health of a leaf by touch',
      'Soil-flecked sleeves rolled above forearms lit by grow-spectrum amber',
    ],
    technologies: ['Programmable biomaterials', 'Atmospheric water harvesting', 'Closed-loop agriculture'],
    narrativeGuidance:
      'Centres on slow, tactile work — the dignity of making living things thrive in a century that nearly forgot how.',
  },
  {
    id: 'navigator',
    displayName: 'The Orbital Navigator',
    shortDescription: 'Keeps the thin silver road between Earth and everywhere else open and safe.',
    signalThemes: ['Courage', 'Precision', 'Distance', 'Wonder'],
    roles: [
      'Flight Director, Lagrange Transfer Authority',
      'Senior Navigator, Lunar Supply Corridor',
      'Debris Mitigation Commander, Low Orbit',
      'Captain of the Cislunar Research Vessel *Meridian*',
    ],
    environments: [
      'A rotating habitat ring where Earth rises through the window every ninety minutes',
      'A launch control gallery lit only by trajectory plots',
      'The quiet observation blister of a long-haul transfer vessel',
    ],
    visualMotifs: [
      'A pressure-rated flight shell in bone-white with burnt-orange mission flashes',
      'A collar ring of status lights reading green in the dark',
      'A visor retracted to reveal eyes adjusted to permanent night',
    ],
    technologies: ['Continuous-thrust transfer craft', 'Autonomous docking swarms', 'Orbital debris sweepers'],
    narrativeGuidance:
      'Centres on solitude at great distance, and the discipline that makes other people’s journeys survivable.',
  },
  {
    id: 'empath',
    displayName: 'The Synthetic Empath',
    shortDescription: 'Teaches machines how to be gentle with people, and people how to trust them.',
    signalThemes: ['Attunement', 'Ethics', 'Translation', 'Trust'],
    roles: [
      'Head of Machine Conscience, Public Systems',
      'Lead Alignment Counsellor, Civic Intelligence Board',
      'Director of Human-Agent Relations',
      'Principal Researcher in Affective Interfaces',
    ],
    environments: [
      'A deliberately low-tech consultation room with one listening machine in the corner',
      'An ethics chamber where every decision is spoken aloud before it is made',
      'A quiet lab where new agents learn to recognise grief',
    ],
    visualMotifs: [
      'An unlined linen overlayer in warm grey — chosen to look unmistakably human',
      'A single understated earpiece, deliberately visible, never hidden',
      'Hands marked with ink notes, a stubborn analogue habit',
    ],
    technologies: ['Alignment auditing', 'Affective interfaces', 'Consent-first personal agents'],
    narrativeGuidance:
      'Centres on the moral weight of standing between people and the systems built to serve them.',
  },
  {
    id: 'cartographer',
    displayName: 'The Data Cartographer',
    shortDescription: 'Maps the shape of everything the world knows, and finds the roads nobody noticed.',
    signalThemes: ['Pattern', 'Curiosity', 'Clarity', 'Discovery'],
    roles: [
      'Chief Cartographer, Open Knowledge Commons',
      'Lead Analyst, Climate Signal Observatory',
      'Director of the Global Provenance Archive',
      'Principal Investigator, Emergent Pattern Lab',
    ],
    environments: [
      'A dark hall where a living map of the planet turns slowly overhead',
      'A reading room walled in archival light, every surface annotated',
      'A field station tracing one river’s data from source to delta',
    ],
    visualMotifs: [
      'A deep indigo field coat printed with faint contour lines',
      'A projection lens worn like a monocle, throwing maps across any wall',
      'A worn leather case of physical notebooks, carried everywhere',
    ],
    technologies: ['Planetary sensing meshes', 'Provenance-verified archives', 'Causal inference engines'],
    narrativeGuidance:
      'Centres on the thrill of seeing a pattern first, and the responsibility that follows.',
  },
  {
    id: 'luminary',
    displayName: 'The Luminary',
    shortDescription: 'Makes the art that a century of machines could not have imagined alone.',
    signalThemes: ['Expression', 'Risk', 'Beauty', 'Voice'],
    roles: [
      'Resident Composer, Volumetric Concert Hall',
      'Director of the Harbour Light Opera',
      'Lead Experience Designer, Immersive Arts Collective',
      'Principal Artist, Atmospheric Installations',
    ],
    environments: [
      'A volumetric stage where the audience stands inside the music',
      'A harbour at midnight being painted with half a million drones',
      'A studio where sound is sculpted as a physical object',
    ],
    visualMotifs: [
      'A liquid-black performance coat that catches colour from whatever it faces',
      'Fingertips ringed with faint conductive light from hours of shaping air',
      'An asymmetric collar cut sharp enough to read from the back row',
    ],
    technologies: ['Volumetric performance', 'Generative co-composition', 'Atmospheric projection'],
    narrativeGuidance:
      'Centres on authorship in an age of infinite generation — insisting that a human chose this, on purpose.',
  },
  {
    id: 'mediator',
    displayName: 'The Mediator',
    shortDescription: 'Negotiates between nations, networks, and the non-human systems that now hold a seat.',
    signalThemes: ['Diplomacy', 'Balance', 'Patience', 'Consensus'],
    roles: [
      'Envoy to the Atmospheric Commons Assembly',
      'Chief Negotiator, Shared Water Accords',
      'Director of Transnational Compute Treaties',
      'Special Representative for Autonomous Systems Law',
    ],
    environments: [
      'A round chamber with no head of the table, by design',
      'A neutral floating platform anchored in international water',
      'A late-night back room where the real agreement gets written',
    ],
    visualMotifs: [
      'A structured slate overcoat with a single accord-pin at the lapel',
      'A translation collar that renders forty languages without ever being seen',
      'Deliberately plain hands — no implants, a negotiating choice',
    ],
    technologies: ['Verifiable treaty ledgers', 'Real-time multilateral translation', 'Simulation-backed negotiation'],
    narrativeGuidance:
      'Centres on the unglamorous patience of getting people who distrust each other to sign the same page.',
  },
  {
    id: 'guardian_future',
    displayName: 'The Civic Guardian',
    shortDescription: 'Holds the line for the people the new century would otherwise leave behind.',
    signalThemes: ['Duty', 'Protection', 'Justice', 'Service'],
    roles: [
      'Commissioner of Climate Resilience Response',
      'Chief of the Coastal Evacuation Service',
      'Director of Universal Access Infrastructure',
      'Head of the Digital Rights Defence Bureau',
    ],
    environments: [
      'A storm-season command centre where the maps never stop moving',
      'A relocated neighbourhood built in nine weeks and built to last ninety years',
      'A public hearing room where the testimony is finally being recorded properly',
    ],
    visualMotifs: [
      'A high-visibility response shell in weathered amber, patched and re-patched',
      'A shoulder beacon dimmed to standby, never switched off',
      'A duty band at the wrist displaying the number of people currently sheltered',
    ],
    technologies: ['Rapid-deploy housing', 'Predictive evacuation routing', 'Public interest auditing'],
    narrativeGuidance:
      'Centres on service under pressure — competence as a form of love.',
  },
  {
    id: 'voyager',
    displayName: 'The Voyager',
    shortDescription: 'Refuses a fixed address, and carries the far edges of the world back to its centre.',
    signalThemes: ['Freedom', 'Adaptability', 'Witness', 'Horizon'],
    roles: [
      'Field Correspondent, Southern Ice Margins',
      'Independent Surveyor of Unmapped Corridors',
      'Expedition Lead, Deep Ocean Thermal Vents',
      'Roving Envoy of the Open Research Fleet',
    ],
    environments: [
      'A solar-skinned expedition vehicle crossing a continent at walking pace',
      'A research raft moored above a vent field four kilometres down',
      'A borrowed room in a city whose name changes every few months',
    ],
    visualMotifs: [
      'A weatherworn expedition shell, repaired in four climates and proud of it',
      'A pack of field instruments that have each saved a life at least once',
      'Sun-lined eyes and a permanent tan line from a survey visor',
    ],
    technologies: ['Autonomous expedition craft', 'Portable sequencing labs', 'Mesh-relay field comms'],
    narrativeGuidance:
      'Centres on the restlessness of someone who only feels still when they are moving.',
  },
];

/**
 * 2050 habitats. Each is fictional but evocative of a real region, so a reader
 * recognises the geography without us claiming anything about a real place.
 */
export const FUTURE_HABITATS = [
  {
    id: 'vertical_metropolis',
    label: 'The Vertical Metropolis',
    tagline: 'A city that grew upward when it ran out of ground.',
    description:
      'Stacked districts threaded by cable transit, each tier with its own weather, its own market, and its own stubborn local identity.',
    palette: 'Rain-slick glass, warm window-light, signage in a dozen scripts',
  },
  {
    id: 'solar_coast',
    label: 'The Solar Coast',
    tagline: 'A shoreline that finally learned to work with the sea.',
    description:
      'Tidal barriers doubling as public parks, desalination cathedrals humming at the waterline, and housing built to float when it must.',
    palette: 'Bleached concrete, turquoise water, photovoltaic bloom',
  },
  {
    id: 'orbital_ring',
    label: 'The Orbital Ring',
    tagline: 'Four hundred kilometres up, and permanently inhabited.',
    description:
      'A rotating habitat where gravity is a design decision, the horizon curves the wrong way, and everyone has seen a sunrise sixteen times today.',
    palette: 'Bone white, deep vacuum black, instrument amber',
  },
  {
    id: 'reclaimed_interior',
    label: 'The Reclaimed Interior',
    tagline: 'The emptied heartland, rewilded and reinhabited.',
    description:
      'Small dense towns surrounded by restored prairie and forest, connected by high-speed rail and very little else, on purpose.',
    palette: 'Tall grass gold, cedar, long clean light',
  },
  {
    id: 'polar_commons',
    label: 'The Polar Commons',
    tagline: 'Held in trust by everyone, owned by no one.',
    description:
      'Research settlements under treaty protection where ice cores are read like scripture and the nearest argument is four thousand kilometres away.',
    palette: 'White on white, cobalt shadow, sodium-lit interiors',
  },
  {
    id: 'equatorial_exchange',
    label: 'The Equatorial Exchange',
    tagline: 'Where the world’s launch windows and trade routes meet.',
    description:
      'A hot, loud, extraordinarily rich corridor of spaceports, fabrication yards and night markets that never fully close.',
    palette: 'Dust and chrome, neon over humidity, exhaust-plume orange',
  },
];

export const FUTURE_SECTORS = [
  { id: 'system_select', label: 'Let the signal decide' },
  { id: 'climate', label: 'Climate & Regeneration' },
  { id: 'space', label: 'Space & Orbital Industry' },
  { id: 'intelligence', label: 'Machine Intelligence & Ethics' },
  { id: 'health', label: 'Longevity & Human Health' },
  { id: 'culture', label: 'Culture, Art & Experience' },
  { id: 'governance', label: 'Governance & Civic Systems' },
  { id: 'infrastructure', label: 'Cities & Infrastructure' },
  { id: 'frontier', label: 'Exploration & Frontier Science' },
];

export const FUTURE_OUTLOOKS = [
  { id: 'luminous', label: 'Luminous', note: 'A 2050 that mostly went right.' },
  { id: 'tempered', label: 'Tempered', note: 'Hard-won progress, honestly costed.' },
  { id: 'audacious', label: 'Audacious', note: 'Big swings, bigger consequences.' },
  { id: 'intimate', label: 'Intimate', note: 'One life, closely observed.' },
];

export const FUTURE_AESTHETICS = [
  { id: 'holographic_realism', label: 'Holographic Realism (Default)' },
  { id: 'clean_solarpunk', label: 'Clean Solarpunk' },
  { id: 'high_contrast_neon', label: 'High-Contrast Neon' },
  { id: 'archival_documentary', label: 'Archival Documentary' },
];

/** Maps a zodiac element to the future archetypes that resonate with it. */
export const ELEMENT_TO_FUTURE_ARCHETYPES = {
  Fire: ['navigator', 'voyager', 'luminary', 'guardian_future'],
  Earth: ['biosmith', 'architect', 'guardian_future', 'cartographer'],
  Air: ['cartographer', 'mediator', 'empath', 'architect'],
  Water: ['empath', 'luminary', 'biosmith', 'mediator'],
};

/** Sector preference → the archetypes that plausibly staff it. */
export const SECTOR_TO_FUTURE_ARCHETYPES = {
  climate: ['biosmith', 'guardian_future', 'cartographer'],
  space: ['navigator', 'voyager', 'architect'],
  intelligence: ['empath', 'cartographer', 'mediator'],
  health: ['biosmith', 'empath', 'guardian_future'],
  culture: ['luminary', 'empath', 'voyager'],
  governance: ['mediator', 'guardian_future', 'empath'],
  infrastructure: ['architect', 'guardian_future', 'biosmith'],
  frontier: ['voyager', 'navigator', 'cartographer'],
};

export const VALID_FUTURE_ARCHETYPE_IDS = FUTURE_ARCHETYPES.map((a) => a.id);
export const VALID_FUTURE_HABITAT_IDS = FUTURE_HABITATS.map((h) => h.id);
export const VALID_FUTURE_SECTOR_IDS = FUTURE_SECTORS.map((s) => s.id);
export const VALID_FUTURE_OUTLOOK_IDS = FUTURE_OUTLOOKS.map((o) => o.id);
export const VALID_FUTURE_AESTHETIC_IDS = FUTURE_AESTHETICS.map((a) => a.id);

export function getFutureArchetypeById(id) {
  if (!id) return null;
  return FUTURE_ARCHETYPES.find((a) => a.id.toLowerCase() === String(id).trim().toLowerCase()) || null;
}

export function getFutureHabitatById(id) {
  if (!id) return null;
  return FUTURE_HABITATS.find((h) => h.id.toLowerCase() === String(id).trim().toLowerCase()) || null;
}

/** Call-signs used when the reader does not supply a name. */
export const FUTURE_CALLSIGNS = {
  architect: ['Vale Orenthe', 'Kess Amodei-Ruiz', 'Juno Ferraz', 'Idris Calloway', 'Noor Vantari'],
  biosmith: ['Wren Adeyemi', 'Sol Maren', 'Thea Okonkwo', 'Cassian Ivaldi', 'Pilar Nakagawa'],
  navigator: ['Ori Lindqvist', 'Captain Reva Soren', 'Matteo Ngata', 'Yuki Barros', 'Dax Oyelaran'],
  empath: ['Elian Mercado', 'Saoirse Han', 'Dr. Amara Vey', 'Tobias Renn', 'Linnea Osei'],
  cartographer: ['Ines Raval', 'Oskar Belhaj', 'Mira Tanaka-Hall', 'Devan Achterberg', 'Zaya Morrow'],
  luminary: ['Sora Kestrel', 'Arlo Visser', 'Nadia Lune', 'Emeka Ashworth', 'Ruia Marchetti'],
  mediator: ['Ambassador Yara Sinclair', 'Hendrik Osei-Vale', 'Camille Dorn', 'Rafiq Almeida', 'Signe Harrow'],
  guardian_future: ['Commissioner Dara Voss', 'Kofi Lindgren', 'Mireya Santos', 'Aleks Thorne', 'Nia Castellanos'],
  voyager: ['Bram Ikeda', 'Talia Oduya', 'Ronan Vasquez', 'Kiva Lindholm', 'Idalia Brecht'],
};

/**
 * Signal metrics rendered as the HUD read-out on the 2050 report.
 * Values are derived deterministically per reading — they are flavour, not forecasts.
 */
export const SIGNAL_DEFINITIONS = [
  { key: 'momentum', label: 'Momentum Index', unit: '', note: 'How fast this path compounds.' },
  { key: 'reach', label: 'Sphere of Reach', unit: 'M', note: 'Lives touched by the work, in millions.' },
  { key: 'novelty', label: 'Novelty Quotient', unit: '%', note: 'How far outside the known map this sits.' },
  { key: 'stability', label: 'Stability Margin', unit: '%', note: 'Resilience of the life built around it.' },
];
