const Discord = require('discord.js');
//const config = require('./config.json');
const rpgDiceRoller = require('rpg-dice-roller');
const client = new Discord.Client();
const prefix = '&';
const lib = require('./functions')
let bullyCharacters = []

client.on('message', function (message) {
  if (message.author.bot) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  if (message.content.toLowerCase().includes('unless..') || message.content.toLowerCase().includes('unless?')) {
    message.react('😳')
  }
  if (message.content.toLowerCase().includes('bot sucks')) {
    message.reply('no u')
  }

  if (!message.content.startsWith(prefix)) return;

  if (command === 'ping') {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  }

  else if (command === 'dice' || command === 'd') {
    try {
      const rollCommand = message.content.substring(message.content.indexOf(" ") + 1)
      if (rollCommand.includes('r') && !rollCommand.includes('r<') && !rollCommand.includes('r<')) {
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

  else if (command === 'spells') {

  }

  else if (command === 'items') {
    lib.fetchItemsFromJson(message)
  }

  else if (command === 'rollcharacter') {
    message.reply('\n' + lib.generateCharacter())
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
