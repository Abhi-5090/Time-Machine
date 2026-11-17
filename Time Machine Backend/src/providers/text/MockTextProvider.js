import { TextProvider } from './TextProvider.js';
import { PromptService } from '../../services/prompt.service.js';

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
      summary:
        `In your past life you were ${name}, a ${occupation.toLowerCase()}. ` +
        `You lived in the ${era.toLowerCase()}, in ${setting.charAt(0).toLowerCase()}${setting.slice(1)}. ` +
        'Your days were spent keeping records, helping travellers, and watching the sky. ' +
        'The moment that mattered most was when you stood up to the local rulers and stopped a fight ' +
        'over food and water. People remembered you as someone who stayed calm when it was hard to.',
      storySections: {
        origins: `In the ${era}, beneath a sky painted with untamed constellations, the story of ${name} began. Born into a lineage that honored the rhythm of the tides and the whispering winds of ${sign}, they were drawn early to the quiet thresholds where mortals sought meaning. Elders spoke of their attentive gaze—a quiet presence that noticed the subtle geometry of leaves, the turning of seasons, and the unspoken grief of passing travelers.

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
      disclaimer: PromptService.PAST_DISCLAIMER
    };
  }

  async generateFuture(futureProfile, celestialSignature, preferences) {
    const name = futureProfile.personaName;
    const role = futureProfile.roleTitle;
    const habitat = futureProfile.habitatName;
    const environment = futureProfile.environment;
    const tech = futureProfile.technologies.join(', ');
    const [firstTech] = futureProfile.technologies;

    return {
      title: `${name} — ${role}`,
      summary:
        `In 2050 you are ${futureProfile.projectedAge ? futureProfile.projectedAge + ' years old and ' : ''}working as ${role.toLowerCase()}. ` +
        `You live in ${habitat.toLowerCase()}, and most days you spend at ${environment.charAt(0).toLowerCase()}${environment.slice(1)}. ` +
        'Your job is mostly making the hard calls a machine should not make on its own. ' +
        'The work you are known for took four years and cost you more than you expected. ' +
        'You are still at it, teaching the people who will do it better than you.',
      futureSections: {
        arrival: `The alarm in 2050 is not a sound. It is a slow warming of the wall beside the bed, the colour of a sunrise that ${habitat} will not actually produce for another forty minutes. ${name} is awake before it finishes. That has not changed in twenty-five years.

The apartment reads the morning and adjusts: water at the temperature it learned, the window fogging to cut the glare off the service towers, a quiet list of the eleven things that happened overnight and the two that actually matter. ${name} ignores ten of them and reads the two twice.

Outside, ${habitat.toLowerCase()} is already fully awake. From here it still looks impossible — the density of it, the sheer number of decisions holding it together every second. ${name} has spent a career inside those decisions and still finds the view slightly absurd.`,

        dailyLife: `By the middle of the morning ${name} is at ${environment.toLowerCase()}, where most of the job turns out to be arbitration. ${firstTech || 'The core system'} has done the easy ninety-five percent overnight. The remaining five percent are the questions no model should be allowed to answer alone, and they are waiting, politely, in a queue.

The tools are extraordinary and routinely disappointing. ${tech} all work exactly as specified and none of them know what a neighbourhood feels like at three in the morning when the power is out. That gap is the entire profession. ${name} spends the day in it, arguing with two colleagues who are usually right and one who is right in a way that takes a week to become obvious.

Lunch is eaten standing up, which 2050 has not managed to fix.`,

        breakthrough: `The work ${name} is actually known for happened in the early forties, and it did not look like a breakthrough at the time. It looked like volunteering for a problem that had already consumed two other careers.

It took four years. It cost a relationship, most of a savings account, and a friendship that never quite recovered from being told the truth in a meeting. What it bought was a method that now runs quietly underneath ${habitat.toLowerCase()} and several places like it, and which almost nobody can name the author of. ${name} has made a kind of peace with that. Most days.

The part worth keeping is smaller than the part that gets cited: a single decision, made alone, late, to publish the failure case instead of burying it.`,

        connections: `There is a mentor, now very old, who still sends ${name} corrections. There are four people whose careers ${name} is directly responsible for, two of whom have already done better work, which is the point. There is someone at home who has no professional interest in any of this and is therefore the only reliable source of perspective in the building.

And there is the standing Thursday argument with a colleague three time zones away, conducted for eleven years, which both of them would describe as the most productive thing in their week.`,

        horizon: `The unfinished part is the part ${name} thinks about on the way home. ${habitat} works. It works for most people. The gap between "most" and "all" is where the next twenty years go, and it is slower, less visible, and far less rewarded than anything on the record so far.

${name} intends to spend those decades on it anyway, mostly in rooms where nobody is watching, teaching the method to people who will make it better. It is not a dramatic ending. It is the one that holds.`,
      },
      futureSignalsNarrative: [
        {
          theme: futureProfile.signalThemes[0] || 'Systems Thinking',
          interpretation: `In 2050 this shows up as the ability to hold a whole interdependent system in mind without flinching. Today it shows up every time you choose to understand the thing properly instead of routing around it.`,
        },
        {
          theme: futureProfile.signalThemes[1] || 'Nerve',
          interpretation: `The 2050 version is signing your name to a decision that nobody else wanted. The present-day version is smaller and more frequent: saying the uncomfortable accurate thing in the room where it is still cheap to say.`,
        },
        {
          theme: futureProfile.signalThemes[2] || 'Endurance',
          interpretation: `The career above is built almost entirely out of staying with hard problems past the point where they stop being interesting. That habit is learnable, and it is learnable now.`,
        },
      ],
      presentDayDirective: `Pick the problem in your field that everyone agrees is important and nobody wants to own, and spend four hours this month finding out why.`,
      disclaimer: PromptService.FUTURE_DISCLAIMER,
    };
  }
}
