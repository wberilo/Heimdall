const { Client } = require('discord.js');
const tmi = require('tmi.js');
require('dotenv').config()

const rpgDiceRoller = require('rpg-dice-roller');

const discordClient = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });


const twitchClient = new tmi.Client({
	options: { debug: true },
	identity: {
		username: 'HeimdallDnD',
		password: process.env.TWITCH_PASSWORD
	},
	channels: [ 'illegalshak', 'MrChaggy' ]
});

twitchClient.connect()

const prefix = '&';
const lib = require('./functions')
const txtgen = require('txtgen');
const fantasyGen = require('fantasy-content-generator')
let bullyCharacters = []

twitchClient.on('chat', (channel, tags, message, self) => {
  console.log(message)
  if(self) return;

	if(message.toLowerCase().startsWith('&d')) {
		// "@alca, heya!"
    const rollCommand = message.substring(message.indexOf(" ") + 1)
    const roll = new rpgDiceRoller.DiceRoll(rollCommand)
		twitchClient.say(channel, roll.output);
	}
});

discordClient.on('messageReactionAdd', async (reaction, user) => {
	// When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

	// Now the message has been cached and is fully available
	console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction! from`);
  try {
    const a = await reaction.users.fetch()
    console.log(a);
    console.log(reaction);
    const role = await reaction.message.guild.roles.cache.find(role => role.name === "Adventurer")
    //console.log(role);

    a.forEach(user => reaction.message.guild.member(user.id).roles.add(role))
    //const role = reaction.message.author.guild.roles.cach
    //a.forEach(user => )
    
  } catch (error) {
    console.log(error);
  }
  //console.log(reaction.message.reactions);

	// The reaction is now also fully available and the properties will be reflected accurately:
	console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
});

discordClient.on('message', function (message) {
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
  if (command === 'clear') {
    const clear = async () => {
      try {
        let deleted;
        do {
          deleted = await message.channel.bulkDelete(100);
        } while (deleted.size != 0);
      } catch (error) {
        console.log(error);
      }
    }
    if(message.member.roles.cache.some(role => role.name === 'Botmaster')){
      clear();
    }
    else{
      message.reply(`no 🙂`);
    }
  }
  else if (command === 'dice' || command === 'd' || command === 'roll') {
    if (message.content.includes('t')) {
      let amount = message.content.match(/[0-9]+t+/)[0];
      console.log(message.content.match(/[0-9]+t+/)[0])
      const runmsg = message.content.replace(/[0-9]+t+/, '')
      amount = amount.slice(0, -1);
      console.log(amount)
      if (amount > 99) {
        amount = 99
        message.reply(`limiting roll amount \`t\` to 99...(this is gonna be a while, you're in for a bad time`)
      }
      for (let i = 0; i < amount; i++) {
        console.log('forloop')
        try {
          const rollCommand = runmsg.substring(runmsg.indexOf(" ") + 1)
          if (rollCommand.includes('r') && !rollCommand.includes('r<') && !rollCommand.includes('r<') && !rollCommand.includes('r=') && !rollCommand.includes('ro')) {
            const fixed = replaceAll(rollCommand, 'r', 'r<')
            const fixedRoll = new rpgDiceRoller.DiceRoll(fixed)
            message.reply(i + 1 + ' ' + fixedRoll.output)
          }
          else {
            const roll = new rpgDiceRoller.DiceRoll(rollCommand)
            message.reply(i + 1 + ' ' + roll.output);
          }

        } catch (error) {
          console.log(error)
          message.reply("Error:", error.message)
          break;
        }
      }
    }
    else {
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
  else if (command === 'items') {
    lib.fetchItemsFromJson(message)
  }
  else if (command === 'rollcharacter') {
    message.reply('\n' + lib.generateCharacter())
  }
  else if (command === 'rndnpc' || command === 'rnd') {
    const gen = fantasyGen.NPCs.generate();
    console.log(gen);
    let outmessage = `name: ${gen.formattedData.name} \nrace: ${gen.race}\ngender: ${gen.gender}\ntraits: `
    for (i = 0; i < gen.traits.length; i++) {
      outmessage = outmessage + gen.traits[i] + '\n';
    }
    outmessage = outmessage + 'desires: '
    for (i = 0; i < gen.desires.length; i++){
      outmessage = outmessage + gen.desires[i] + '\n'
    }
    message.channel.send(outmessage)
  }
  else if (command === 'rndstory') {
    const gen = fantasyGen.Storyhooks.npcActs();
    console.log(gen);
    message.channel.send(`${gen.storyhook}`)
  }
  else if (command === 'rndmagicitem') {
    const gen = fantasyGen.MagicItems.generate();
    console.log(gen)
    let outmessage = `**${gen.formattedData.title}**\n${gen.type} : ${gen.subtype} \n${gen.powerLevel} ${gen.schoolOfMagic} item\n`
    for (i = 0; i < gen.effects.length; i++) {
      console.log('once')
      outmessage = outmessage + gen.effects[i] + '\n';
    }
    message.channel.send(outmessage)
  }
  else if (command === 'rndloot') {
    const gen = fantasyGen.Loots.generate();
    console.log(gen)
    let outmessage = ''
    for (i = 0; i < gen.lootItems.length; i++) {
      console.log('once')
      outmessage = outmessage + gen.lootItems[i] + '\n';
    }
    message.channel.send(outmessage)

  }

});

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

discordClient.login(process.env.DISCORD_TOKEN);
//client.login(config.BOT_TOKEN);
