const Discord = require('discord.js');
//const config = require('./config.json');
const client = new Discord.Client();
const prefix = '&';
const lib = require('./functions')
const bullyCharacters = []

client.on('message', function (message) {
  if (message.author.bot) return;
  
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  if(message.content.toLowerCase().includes('what') && message.content.includes('how')){
    message.react('❓')
    message.react('❔')
  }
  if(message.content.toLowerCase().includes('unless..') || message.content.toLowerCase().includes('unless?')){
    message.react('😳')
  }
  if(message.content.toLowerCase().includes('pog')){
    message.react('😲')
  }

  if (!message.content.startsWith(prefix)) return;

  if (command === 'ping') {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  }

  else if (command === 'dice' || command === 'd') {
    const filtered = args.filter((arg) => /\d/.test(arg));
    if (filtered === [] || filtered[0] === undefined) {
      message.reply(`Incorrect parameters
input should look like: \`5d6\` or \`5d6r2+4\` 
where: \`<DICE NUMBER>\`**D**\`<DICE SIZE>\`**R**\`<MINIMUM NUMBER>\`**+**\`<ADDED>\` 
valid imputs: \`5d6\` \`5d6r2+4\` \`5d6r0+4\` \`5d6r4\` \`d6\`
`);
    } 
    else{
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

  else if (command === 'spells'){

  }

  else if (command === 'items'){
    lib.fetchItemsFromJson(message)
  }

  else if (command === 'feats'){

  }
  
  else if (command === 'readlogs'){
    console.log(message.content.match(/\d+/)[0])

    console.log(message.author)
  }

  else if (command === 'booli') {
    bullyCharacters.push(message.content.match(/\d+/)[0])
    console.log(bullyCharacters);
  }

  else if (command === 'help'){
    message.channel.send(``)
  }

  else if (command === 'rollcharacter'){
    message.reply('\n'+lib.generateCharacter())
  }

  else if (command === 'steal'){
    message.channel.send(':rage: Steal '+args[0]+`'s stuff :rage:`)
  }
  else if (command === 'writecharacter'){
  }
  else if (command === 'readcharacter'){
  }

  else if (command === 'yeet'){

  }
  
  else if (command === 'feedm'){
    message.channel.send(':rage: Feed the DM :rage:')
  }

  else if (command === 'markov'){

  }
  
  else if (command === 'conditions'){

  }
});

client.login(process.env.TOKEN);
//client.login(config.BOT_TOKEN);
