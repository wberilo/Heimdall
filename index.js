const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();
const prefix = '&';
const fetch = require('node-fetch');
const fs = require('fs');

function addNewCharacter(message,character) {
  fs.readFile('./user-submitted/characters.json', function (err, data) {
    if (err) throw err;
    var json = JSON.parse(data);
    json.push(character);

    fs.writeFile('./user-submitted/characters.json', JSON.stringify(json,null,2),(err) => {
      if (err) throw err;
      message.reply('Character written to file.')
    })
  });
}
//addNewCharacter();
function rollDice(numberOf = 1, diceSize, min = 0, plus = 0) {
  let total = 0;
  let arrayDice = [];
  for (let index = 0; index < numberOf; index++) {
    let die = Math.floor(Math.random() * diceSize) + 1;
    total += die;
    die = die + 1 > min ? die : `~~${die}~~ ` + min;
    arrayDice.push(die);
  }
  return `\`${numberOf}d${diceSize}r${min}+${plus}\` = ${arrayDice.join(
    ' + '
  )} ${plus > 0 ? `+ ${plus}` : ``} = ***${total + parseInt(plus)}***`;
}

function parseNumbers(str) {
  var numbers = str.match(/\d+/g);
  return numbers;
}

async function grabAndSend(message) {
  setTimeout(() => {
    message.reply('AWAIT RESPONSE');
  }, 3000);
}

async function grabItems() {
  const res = await fetch('https://api.open5e.com/weapons/');
  const data = await res.json();
  console.log(data.results);
  return data.results;
}

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

  // &dice1d6 &diced6 &dice2d5r4 &dice8d10r6+5
  else if (command === 'dice') {
    const filtered = args.filter((arg) => /\d/.test(arg));
    if (args[0].charAt(0) === 'd') {
      const numbsFromArg = parseNumbers(filtered[0]);
      message.reply(rollDice(1, numbsFromArg[0]));
    } else if (filtered.length === [] || filtered[0] === undefined) {
      message.reply(`Incorrect parameters
input should look like: \`5d6\` or \`5d6r2+4\` 
where: \`<DICE NUMBER>\`**D**\`<DICE SIZE>\`**R**\`<MINIMUM NUMBER>\`**+**\`<ADDED>\` 
valid imputs: \`5d6\` \`5d6r2+4\` \`5d6r0+4\` \`5d6r4\` \`d6\`
invalid imputs: \`5d\` \`5d6+4\``);
    } else {
      const numbsFromArg = parseNumbers(filtered[0]);
      const [diceNumber, diceSize, min, plus] = numbsFromArg;
      message.reply(rollDice(diceNumber, diceSize, min, plus));
    }
  } else if (command === 'await') {
    message.reply('AWAIT PART 1');
    //grabItems();
    addNewCharacter(message);
  } else if (command === 'whoami') {
    console.log(message);
  } else if (command === 'writedown') {
    addToFile(message)
    //console.log(message.content.substr(message.content.indexOf(" ")+1));
    console.log(message.author.id)
  }
});

function addToFile(message){
  const whattoWrite = message.content.substr(message.content.indexOf(" ")+1)
  const author = message.author.id;

  fs.readFile('./user-submitted/userMessages.json', function (err, data) {
    if (err) throw err;
    let json = JSON.parse(data);
    if(json[author]!==undefined){
      console.log(json[author].messages)
      json = {[author]:{messages:json[author].messages.concat(whattoWrite)}};
    }
    else{
      console.log(json.author)
      json = {[author]:{messages:[whattoWrite]}}
    }
    fs.writeFile('./user-submitted/userMessages.json', JSON.stringify(json,null,2),(err) => {
      if (err) throw err;
      message.reply('Character written to file.')
    })
  });
}



client.login(config.BOT_TOKEN);
