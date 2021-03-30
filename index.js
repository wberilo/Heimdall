const Discord = require('discord.js');
//const config = require('./config.json');
const rpgDiceRoller = require('rpg-dice-roller');
const client = new Discord.Client();
const prefix = '&';
const lib = require('./functions')
const txtgen = require('txtgen');
const fantasyGen = require('fantasy-content-generator')
let bullyCharacters = []

client.on('message', function (message) {
  if (message.author.bot) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  if (message.content.toLowerCase().includes('bot sucks')) {
    const attachment = new Discord.MessageAttachment('https://emoji.gg/assets/emoji/7689_unoreversecard.png');
    message.channel.send(attachment);
  }

  if (!message.content.startsWith(prefix)) return;

  if (command === 'ping') {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  }

  else if (command === 'dice' || command === 'd' || command === 'roll') {
    if(message.content.includes('t')){
      let amount = message.content.match(/[0-9]+t+/)[0];
      console.log(message.content.match(/[0-9]+t+/)[0])
      const runmsg = message.content.replace(/[0-9]+t+/,'')
      amount = amount.slice(0, -1);
      console.log(amount)
      if(amount>99){
        amount = 99
        message.reply(`limiting roll amount \`t\` to 99...(this is gonna be a while, you're in for a bad time`)
      }
      for(let i = 0; i < amount; i++){
        console.log('forloop')
        try {
          const rollCommand = runmsg.substring(runmsg.indexOf(" ") + 1)
          if (rollCommand.includes('r') && !rollCommand.includes('r<') && !rollCommand.includes('r<') && !rollCommand.includes('r=') && !rollCommand.includes('ro')) {
            const fixed = replaceAll(rollCommand, 'r', 'r<')
            const fixedRoll = new rpgDiceRoller.DiceRoll(fixed)
            message.reply(i+1+' '+fixedRoll.output)
          }
          else {
            const roll = new rpgDiceRoller.DiceRoll(rollCommand)
            message.reply(i+1+' '+roll.output);
          }
    
        } catch (error) {
          console.log(error)
          message.reply("Error:", error.message)
          break;
        }
      }
    }
    else{
      try {
        const rollCommand = message.content.substring(message.content.indexOf(" ") + 1)
        if (rollCommand.includes('r') && !rollCommand.includes('r<') && !rollCommand.includes('r<') && !rollCommand.includes('r=') && !rollCommand.includes('ro')) {
          const fixed = replaceAll(rollCommand, 'r', 'r<')
          const fixedRoll = new rpgDiceRoller.DiceRoll(fixed)
          message.reply(fixedRoll.output)
        }
        else {
          const roll = new rpgDiceRoller.DiceRoll(rollCommand)
          message.reply(roll.output);
        }
  
      } catch (error) {
        console.log(error)
        message.reply("Error:", error.message)
      }
    }
    
  }

  else if (command === 'olddice' || command === 'od') {
    const filtered = args.filter((arg) => /\d/.test(arg));
    if (filtered === [] || filtered[0] === undefined) {
      message.reply(`Incorrect parameters
input should look like: \`5d6\` or \`5d6r2+4\` 
where: \`<DICE NUMBER>\`**D**\`<DICE SIZE>\`**R**\`<MINIMUM NUMBER>\`**+**\`<ADDED>\` 
valid imputs: \`5d6\` \`5d6r2+4\` \`5d6r0+4\` \`5d6r4\` \`d6\`
`);
    }
    else {
      message.reply(lib.parseNumbers(filtered[0]).string)
    }
  }

  else if (command === 'meme') {
    lib.grabMeem(message);
  }

  else if (command === 'writedown') {
    lib.addToFile(message);
    console.log(message.author.id);
  }

  else if (command === 'fools') {
    console.log(txtgen.setNouns(["Shaggy","Flower","Eye","Wind","Game","Dungeon master","Mind","Kitty","Ring","Time","Fish","Bird","Wolf","Shak","King Riki","Tori","Jaab","Unlucky","Rukie","Corrupt","Ginger","Monkey","Kelga","Rardann","Three Riddle","Mby123","Brock"]))
    message.channel.send(txtgen.sentence());
  }

  else if (command === 'items') {
    lib.fetchItemsFromJson(message)
  }

  else if (command === 'rollcharacter') {
    message.reply('\n' + lib.generateCharacter())
  }

  else if (command === 'rndnpc' || command === 'rnd') {
    const gen = fantasyGen.NPCs.generate();
    console.log(gen);
    message.channel.send(`name: ${gen.formattedData.name} \nrace: ${gen.race}\ngender: ${gen.gender}\ntraits: ${gen.traits[0]}\ndesires: ${gen.desires[0]}`)
  }
  else if (command === 'rndstory') {
    const gen = fantasyGen.Storyhooks.npcActs();
    console.log(gen);
    message.channel.send(`${gen.storyhook}`)
  }
  else if (command === 'rndmagicitem') {
    const gen = fantasyGen.MagicItems.generate();
    let outmessage = `**${gen.formattedData.title}**\n${gen.type} : ${gen.subtype} \n${gen.powerlevel} ${gen.schoolOfMagic} item\n`
    for(i = 0; i < gen.effects.length; i++){
      outmessage = outmessage + effects[i] + '\n';
    }
    message.channel.send(outmessage)
  }

});

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

var alternateCase = function (s) {
  var chars = s.toLowerCase().split("");
  for (var i = 0; i < chars.length; i += 2) {
    chars[i] = chars[i].toUpperCase();
  }
  return chars.join("");
};

client.login(process.env.TOKEN);
//client.login(config.BOT_TOKEN);
