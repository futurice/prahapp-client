import { findIndex, filter, get, parseInt, random } from 'lodash';

const DEFAULT_DESCRIPTION = 'It starts to feel like an actual Whappu!';
const VIBE_DESCRIPTIONS = [
  { percentage: 0, description: 'KELA cut my opintotuki and my SO left me' },
  { percentage: 2, description: 'Just got beaten by my granny in Counter-Strike' },
  { percentage: 4, description: 'This Whappu I plan to chill with my best friend, the refrigerator light' },
  { percentage: 5, description: 'I am just sitting in the corner and saving money' },
  { percentage: 6, description: 'Still playing Christmas carols' },
  { percentage: 9, description: 'I wish I could remember the taste of ice-cream' },
  { percentage: 10, description: 'Lectures, assignments.. Ain\'t nobody got time for Whappu' },
  { percentage: 12, description: 'Got my exam results back and they all failed' },
  { percentage: 16, description: 'Wish there would be some Sima & Sunshine...' },
  { percentage: 20, description: 'Is that snow outside?' },
  { percentage: 22, description: 'Maybe Whappu will come again?' },
  { percentage: 24, description: 'Time to make some Sima...?' },
  { percentage: 30, description: 'Quite OK... my Sima is too warm' },
  { percentage: 32, description: 'What is this tingling sensation? Whappu?' },
  { percentage: 34, description: 'My Sima is still not ready :|' },
  { percentage: 36, description: 'Should I do some Sima...?' },
  { percentage: 40, description: 'To Whappu or not to Whappu? That is the question.' },
  { percentage: 42, description: 'I wonder where I left my Wappu calendar?' },
  { percentage: 44, description: 'I\'m feeling a bit wappuish.' },
  { percentage: 46, description: 'Whoa just had the season\'s first Sima!' },
  { percentage: 50, description: 'It starts to feel like an actual Whappu!' },
  { percentage: 52, description: 'TREVOR POUR ME SOME SIMA' },
  { percentage: 54, description: 'First warm day for this spring!' },
  { percentage: 56, description: 'Time to make some Sima & prepare for Whappu!' },
  { percentage: 60, description: 'Whappu and Chill... Summer is coming!!' },
  { percentage: 62, description: 'Whappu has landed!' },
  { percentage: 66, description: 'I think I saw the original Whappu-Helli?!' },
  { percentage: 70, description: 'Got my KELA benefit, today we roll!' },
  { percentage: 72, description: 'Tonight... we dine in OTANIEMI!' },
  { percentage: 74, description: 'Tonight... we dine in HERVANTA!' },
  { percentage: 76, description: 'This is how Whappu-Jari must feel like!' },
  { percentage: 78, description: 'MATTO MATTO MATTO MATTO' },
  { percentage: 80, description: 'Look at me, I\'m a horsey! Hirrnnh!' },
  { percentage: 82, description: 'Sex \'n Sima \'n punk\'n\'roll!' },
  { percentage: 84, description: 'I already lost my Teekkarilakki!' },
  { percentage: 86, description: '🎶🎶If it\'s Whappu and you feel it, say hurray!🎶🎶' },
  { percentage: 88, description: 'Can you feel the spring also?' },
  { percentage: 90, description: '720° quad-backflip? Hold my Sima!' },
  { percentage: 92, description: 'Party or party not, there is no try!' },
  { percentage: 94, description: 'Life is beautiful! Whappu hard!' },
  { percentage: 96, description: 'I won in the lottery & sun is shining!' },
  { percentage: 100, description: 'Just heard Turku has been cancelled!' },
  { percentage: 100, description: 'About to know what "simaöverit" means' },
  { percentage: 100, description: 'Always go full Whappu!' },
  { percentage: 100, description: 'Hell yeah, it\'s wappu now!' },
  { percentage: 100, description: 'It\'s over 9000!!!!' }
].reverse();

const getVibeDescription = (percentageValue = 50) => {
  const percentageKey = parseInt(percentageValue, 10);
  let descriptionIndex = 0;

  if (percentageKey === 100) {
    const perfectScores = filter(VIBE_DESCRIPTIONS, (d) => d.percentage === 100);
    descriptionIndex = random(0, perfectScores.length - 1);
    return get(perfectScores[descriptionIndex], 'description', DEFAULT_DESCRIPTION)
  }


  descriptionIndex = findIndex(VIBE_DESCRIPTIONS, p => p.percentage <= percentageKey);
  return get(VIBE_DESCRIPTIONS[descriptionIndex], 'description', DEFAULT_DESCRIPTION);
}



export default getVibeDescription;
