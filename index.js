const Discord = require('discord.js');
//const config = require('./config.json');
const client = new Discord.Client();
const prefix = '&';
const lib = require('./functions')

client.on('message', function (message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  }

  else if (command === 'dice') {
    const filtered = args.filter((arg) => /\d/.test(arg));
    if (args[0].charAt(0) === 'd') {
      const numbsFromArg = lib.parseNumbers(filtered[0]);
      message.reply(rollDice(1, numbsFromArg[0]));
    } else if (filtered.length === [] || filtered[0] === undefined) {
      message.reply(`Incorrect parameters
input should look like: \`5d6\` or \`5d6r2+4\` 
where: \`<DICE NUMBER>\`**D**\`<DICE SIZE>\`**R**\`<MINIMUM NUMBER>\`**+**\`<ADDED>\` 
valid imputs: \`5d6\` \`5d6r2+4\` \`5d6r0+4\` \`5d6r4\` \`d6\`
invalid imputs: \`5d\` \`5d6+4\``);
    } else {
      const numbsFromArg = lib.parseNumbers(filtered[0]);
      const [diceNumber, diceSize, min, plus] = numbsFromArg;
      message.reply(lib.rollDice(diceNumber, diceSize, min, plus));
    }
  } 
  
  else if (command === 'meme') {
    lib.grabMeem(message);
  } 

  else if (command === 'writedown') {
    lib.addToFile(message);
    console.log(message.author.id);
  }

  else if (command === 'spells'){

  }

  else if (command === 'feats'){

  }
  
  else if (command === 'class'){

  }

  else if (command === 'help'){
    message.channel.send(``)
  }

  else if (command === 'yeet'){

  }
  
  else if (command === 'eat'){

  }

  else if (command === 'markov'){

  }
  
  else if (command === 'conditions'){

  }
});

//client.login(process.env.TOKEN);
client.login(config.BOT_TOKEN);
