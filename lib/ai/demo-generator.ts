import { Quest, QuestPreferences } from '@/types/quest';

interface DemoQuestTemplate {
  title: string;
  premise: string;
  task: string;
  hint: string;
  completionCriteria: string;
  reflectionQuestion: string;
  style: 'nature' | 'architecture' | 'observation' | 'surprise';
  environments: ('campus' | 'neighbourhood' | 'park' | 'anywhere')[];
  difficulty: 'easy' | 'adventurous';
}

export const DEMO_QUEST_CATALOG: DemoQuestTemplate[] = [
  // NATURE - EASY
  {
    title: 'The Urban Botany Detective',
    premise: 'Pavement cracks and curb edges harbour resilient micro-ecosystems that thrive in plain sight.',
    task: 'Find three distinctly shaped leaves or plant species growing purely through brickwork, gravel, or sidewalk cracks without picking anything.',
    hint: 'Look closely at shaded corners near stone steps or drainage edges.',
    completionCriteria: 'Located and observed 3 distinct plant varieties emerging from urban infrastructure.',
    reflectionQuestion: 'What does the resilience of these plants reveal about how nature reclaims man-made spaces?',
    style: 'nature',
    environments: ['campus', 'neighbourhood', 'park', 'anywhere'],
    difficulty: 'easy',
  },
  {
    title: 'The Tree Bark Cartography',
    premise: 'No two tree barks carry the same tactile texture or lichen constellations.',
    task: 'Locate two mature trees of different species. Closely compare the bark fissures, colors, and any lichen colonies from 10 inches away.',
    hint: 'Feel the difference between deep furrowed ridges and papery peeling layers.',
    completionCriteria: 'Identified 2 contrasting tree bark textures and observed their microscopic surfaces.',
    reflectionQuestion: 'How does pausing to inspect natural textures alter your sensory relationship with your street?',
    style: 'nature',
    environments: ['campus', 'neighbourhood', 'park', 'anywhere'],
    difficulty: 'easy',
  },
  // NATURE - ADVENTUROUS
  {
    title: 'The Avian Flight Path Survey',
    premise: 'City birds use building rooftops and utility wires as thermal highways and observation perches.',
    task: 'Walk quietly until you spot an urban bird. Track its movements and perching spots for 5 minutes without disturbing it.',
    hint: 'Listen for distinct territorial calls high up on chimneys, lampposts, or telephone lines.',
    completionCriteria: 'Observed a bird navigating at least three urban waypoints.',
    reflectionQuestion: 'What altitude in the city does wildlife dominate while humans walk underneath?',
    style: 'nature',
    environments: ['campus', 'neighbourhood', 'park', 'anywhere'],
    difficulty: 'adventurous',
  },
  {
    title: 'Micro-Canopy Explorer',
    premise: 'Looking straight up through trees against building skylines creates striking geometric silhouettes.',
    task: 'Find a spot where a tree canopy intersects directly with a building roofline. Step under it and look straight upward.',
    hint: 'Observe the negative space between green leaves and concrete angles.',
    completionCriteria: 'Found and stood at an intersection of organic branches and built geometry.',
    reflectionQuestion: 'Where did the tree line end and the architecture begin in your field of vision?',
    style: 'nature',
    environments: ['campus', 'neighbourhood', 'park', 'anywhere'],
    difficulty: 'adventurous',
  },

  // ARCHITECTURE - EASY
  {
    title: 'Geometry in the Wild',
    premise: 'Urban facades are rhythmic compositions of repeating masonry and geometric symmetry.',
    task: 'Locate a building or structure with a repeating structural motif (arches, brick patterns, windows, or balustrades) you have never consciously studied.',
    hint: 'Tilt your gaze 45 degrees upward above commercial shop signs.',
    completionCriteria: 'Documented a repeating architectural sequence of at least 4 repetitions.',
    reflectionQuestion: 'What emotion or sense of rhythm does this repetition give the streetscape?',
    style: 'architecture',
    environments: ['campus', 'neighbourhood', 'park', 'anywhere'],
    difficulty: 'easy',
  },
  {
    title: 'The Threshold Chronicler',
    premise: 'Doorways and entrances are historical portals expressing the era and craft of their creators.',
    task: 'Inspect three consecutive doorways or building thresholds. Observe door hardware, lintel materials, and signs of patina.',
    hint: 'Notice brass door handles worn smooth by thousands of human hands.',
    completionCriteria: 'Inspected 3 distinct entrances and noted their historical or material details.',
    reflectionQuestion: 'Which threshold looked like it had welcomed the most footsteps over decades?',
    style: 'architecture',
    environments: ['campus', 'neighbourhood', 'park', 'anywhere'],
    difficulty: 'easy',
  },
  // ARCHITECTURE - ADVENTUROUS
  {
    title: 'Ghost Signs & Hidden Chronologies',
    premise: 'Older walls retain faded lettering, decommissioned fixtures, and architectural scars of forgotten eras.',
    task: 'Find one subtle relic of past utility: a decommissioned hitching ring, antique wall anchor, faded painted sign, or vintage boot scraper.',
    hint: 'Check exterior brick party-walls and the bases of pre-1950 stone buildings.',
    completionCriteria: 'Discovered one architectural vestige from a bygone historical decade.',
    reflectionQuestion: 'What story does this forgotten detail whisper about what the street used to be?',
    style: 'architecture',
    environments: ['campus', 'neighbourhood', 'park', 'anywhere'],
    difficulty: 'adventurous',
  },

  // OBSERVATION - EASY
  {
    title: 'The Palette of Everyday Objects',
    premise: 'Our brains tune out recurring colors in familiar streets, turning vibrant environments into a dull grey haze.',
    task: 'Pick one specific color (like vibrant ochre, teal, or burnt sienna) before taking another step. Find four objects bearing that exact hue.',
    hint: 'Don’t just look at cars; check drainpipes, tiles, painted bolts, and flyers.',
    completionCriteria: 'Spotted 4 distinct objects sharing your chosen pigment.',
    reflectionQuestion: 'Once you looked for this color, did it suddenly seem intentionally placed across your route?',
    style: 'observation',
    environments: ['campus', 'neighbourhood', 'park', 'anywhere'],
    difficulty: 'easy',
  },
  {
    title: 'The Soundscape Audit',
    premise: 'We usually wear headphones or rush with internal monologues, filtering out the ambient symphony of our habitat.',
    task: 'Stop on a bench or safe walkway for 3 uninterrupted minutes with eyes half-closed. Distinguish at least five distinct layers of sound.',
    hint: 'Separate near sounds (footsteps, leaves rustling) from distant rumbles and ambient air currents.',
    completionCriteria: 'Recorded 5 discrete sonic layers in your mental acoustic log.',
    reflectionQuestion: 'Which sound surprised you most by being present right next to you unnoticed?',
    style: 'observation',
    environments: ['campus', 'neighbourhood', 'park', 'anywhere'],
    difficulty: 'easy',
  },
  // OBSERVATION - ADVENTUROUS
  {
    title: 'The Desire Path Investigator',
    premise: 'Desire paths are informal trails created by human footsteps rejecting formal asphalt planning.',
    task: 'Seek out an unpaved shortcut, smoothed dirt trail, or natural walkway cut across grass or gravel by collective human habit.',
    hint: 'Check corners of lawns where diagonal travel saves 10 paces.',
    completionCriteria: 'Located and walked along an organic pedestrian desire path.',
    reflectionQuestion: 'What does this informal path say about human nature versus institutional design?',
    style: 'observation',
    environments: ['campus', 'neighbourhood', 'park', 'anywhere'],
    difficulty: 'adventurous',
  },

  // SURPRISE - EASY
  {
    title: 'The Serendipitous Shadow Play',
    premise: 'Sunlight transforms mundane street furniture into fleeting sculptural shadow drawings.',
    task: 'Find a dramatic or curious shadow cast by a fence, bicycle rack, fire escape, or foliage onto a flat surface.',
    hint: 'Low afternoon or morning light produces the most exaggerated silhouettes.',
    completionCriteria: 'Observed a captivating geometric or organic shadow composition.',
    reflectionQuestion: 'How does the movement of light turn static metal into dynamic temporal art?',
    style: 'surprise',
    environments: ['campus', 'neighbourhood', 'park', 'anywhere'],
    difficulty: 'easy',
  },
  // SURPRISE - ADVENTUROUS
  {
    title: 'The Left-Turn Derivé',
    premise: 'Guy Debord’s psychogeography encourages unplanned drift (dérive) through urban landscapes to break mental habit loops.',
    task: 'Walk forward and take the first three left turns at safe public intersections, pausing at the end to study your new unfamiliar vantage.',
    hint: 'Keep to pedestrian walkways and avoid private alleys or restricted zones.',
    completionCriteria: 'Completed three intentional left turns and anchored at an unexpected public vantage.',
    reflectionQuestion: 'Did breaking your standard walking pattern change how you felt about your immediate surroundings?',
    style: 'surprise',
    environments: ['campus', 'neighbourhood', 'park', 'anywhere'],
    difficulty: 'adventurous',
  },
  {
    title: 'The Texture Spectrum Challenge',
    premise: 'The city is a physical collage of coarse concrete, polished granite, weathered wood, and rusted iron.',
    task: 'Touch or inspect from close up: one ultra-smooth surface, one deeply rough surface, and one cold metallic surface.',
    hint: 'Ensure surfaces are safe, clean, and in public walkways.',
    completionCriteria: 'Identified three contrasting tactile surfaces along your route.',
    reflectionQuestion: 'Which material felt oldest and which felt most synthetic in your exploration?',
    style: 'surprise',
    environments: ['campus', 'neighbourhood', 'park', 'anywhere'],
    difficulty: 'adventurous',
  },
];

export function generateDemoQuests(prefs: QuestPreferences): Quest[] {
  // Filter by matching style if possible, or fallback to all
  let candidates = DEMO_QUEST_CATALOG.filter(
    (q) => prefs.style === 'surprise' || q.style === prefs.style
  );

  if (candidates.length < 3) {
    candidates = [...DEMO_QUEST_CATALOG];
  }

  // Prefer difficulty match where available
  const difficultyMatched = candidates.filter((q) => q.difficulty === prefs.difficulty);
  const pool = difficultyMatched.length >= 3 ? difficultyMatched : candidates;

  // Shuffle deterministically based on date / random offset
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);

  return selected.map((template, idx) => ({
    id: `demo-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
    title: template.title,
    premise: template.premise,
    task: template.task,
    duration: prefs.duration,
    difficulty: prefs.difficulty,
    hint: template.hint,
    completionCriteria: template.completionCriteria,
    reflectionQuestion: template.reflectionQuestion,
    isDemo: true,
    environment: prefs.environment,
    style: prefs.style,
    createdAt: Date.now(),
  }));
}
