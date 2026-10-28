import { TextProvider } from './TextProvider.js';

export class MockTextProvider extends TextProvider {
  async generateStory(characterProfile, celestialSignature, preferences) {
    const name = characterProfile.characterName || 'The Celestial Traveler';
    const archetype = characterProfile.archetypeName || 'The Sage';
    const sign = celestialSignature.selectedSign || 'Scorpio';
    const era = characterProfile.eraName || 'Ancient Era';
    const occupation = characterProfile.occupation || 'Keeper of the Starlight Sanctuaries';
    const setting = characterProfile.setting || 'a tranquil coastal sanctuary carved into sandstone';

    return {
      title: `${name} — ${occupation}`,
      storySections: {
        origins: `In the heart of an ${era}, beneath a sky painted with untamed constellations, the story of ${name} began. Born into a lineage that honored the rhythm of the tides and the whispering winds of ${sign}, they were drawn early to the quiet thresholds where mortals sought meaning. Elders spoke of their attentive gaze—a quiet presence that noticed the subtle geometry of leaves, the turning of seasons, and the unspoken grief of passing travelers.

As youth blossomed into purpose, they did not seek martial conquest or empty courtly applause. Instead, guided by the ${sign} virtues of ${celestialSignature.symbolicThemes?.join(' and ') || 'depth and insight'}, they were apprenticed to the sanctuary at ${setting}. Here, amid the fragrant smoke of dried cedar and the steady drip of clepsydra water-clocks, they discovered their sacred calling as a ${occupation}.`,

        dailyLife: `Daybreak in the sanctuary was greeted not with fanfare, but with the ceremonial striking of a singing bronze bell. In the quiet morning hours, ${name} would tend to the celestial instruments—polishing the brass reticles of astrolabes and replenishing the cold spring water used in night-sky scrying basins. They greeted pilgrims arriving from distant mountain passes, offering neither easy prophecy nor hollow judgment, but a listening ear and herbal tea brewed from wild mountain thyme.

Their afternoons were dedicated to safeguarding knowledge. With a steady hand, they transcribed star-routes and agricultural almanacs onto vellum parchment, ensuring that future generations would know when to sow barley and when to take shelter from the winter tempests. Those who walked beside them remembered their gentle humor and the unassuming dignity with which they carried both heavy ledgers and weary hearts.`,

        turningPoint: `The defining moment arrived during the Great Conjunction of the Twin Comets—a year marked by prolonged drought and rising apprehension among neighboring provinces. When local rulers demanded that the sanctuary's hidden granaries and water cisterns be seized for wartime stockpiling, ${name} stepped forward to bar the carved gates, armed not with steel, but with ancient treaties and unyielding moral clarity.

Standing beneath an eclipsed moon before assembled legions, they demonstrated how the celestial alignment foretold an imminent change in wind and rain within three dawns. They persuaded the regional governors to share reserves collaboratively rather than resort to siege. When the promised torrential rains broke the drought exactly on the third twilight, bloodshed was averted, and the authority of wisdom was consecrated above brute force.`,

        relationships: `Throughout their journey, ${name} was anchored by enduring fellowships. Foremost was Master Elian, an elder navigator whose patient guidance had taught them that the fiercest storm eventually yields to calm seas. In later years, they took under their wing young apprentices—eager souls who saw in ${name} a sanctuary of steadiness in a turbulent world.

Letters preserved in amber wax spoke of a quiet, lifelong correspondence with a diplomat across the Great Divide. Though hundreds of leagues separated their homes, their letters shared reflections on astronomy, garden craft, and the enduring beauty of human resilience, proving that true kindred spirits remain bound across any expanse.`,

        conclusion: `In the golden twilight of their years, ${name} stepped back from public governance, taking residence in a quiet cottage overlooking the azure cove. Even in seclusion, travelers would seek the winding terrace path, drawn by the gentle glow of their hearth fire and the certainty of receiving peaceful counsel.

When their final earthly season arrived, it is said that the night sky burned with an unusually brilliant meteor shower, as if the heavens themselves were greeting a familiar friend. They left behind no monuments of stone or decrees of conquest, but an enduring legacy of kindness, celestial insight, and communities taught to look upward with hope.`
      },
      symbolicKarmicThemes: [
        {
          theme: 'Stewardship of Truth',
          interpretation: 'Like the fictional guardian in this narrative, you are invited to stand steady in your convictions while extending compassion to those seeking direction.'
        },
        {
          theme: 'Harmonizing Strength with Serenity',
          interpretation: 'The story reflects how gentle presence often accomplishes what force cannot. In your present life, honor the quiet power of listening.'
        }
      ],
      presentDayReflection: `Where in your life today might a peaceful, patient response open a doorway that forceful action has closed?`,
      disclaimer: 'This is an imaginative, astrology-inspired entertainment reading. It does not claim to prove reincarnation, diagnose personal conditions, or provide verified historical facts.'
    };
  }
}
