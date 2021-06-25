const itemGen = require('./itemgen.json')

const roll = () => Math.random()*100

function rollItem(){
  let type = 'common'
  console.log('Common.')
  if(roll() < itemGen.uncommon.chance){
    type = 'uncommon'
    console.log('Uncommon...')
  }
  if(roll() < itemGen.rare.chance && type === 'uncommon'){
    type = 'rare'
    console.log('Rare! 👀')
  }
  if(roll() < itemGen.epic.chance && type === 'rare'){
    type = 'epic'
    console.log('Epic 😎')
  }

  const armorweapon = Math.random() * 2 > 1 ? 'armor' : 'weapons'

  const arrayOfEffects = itemGen[type].magical[armorweapon];
  const magicalChance = itemGen[type].magical_chance;

  const name = arrayOfEffects[Math.floor(Math.random() * arrayOfEffects.length)]
  let magicalEffects = 0;
  for (let i = 0; i < magicalChance.length; i++) {
    if(roll() < magicalChance[i]){
      magicalEffects += 1
    }
    else{
      break;
    }
  }

  console.log(name)

}
rollItem();