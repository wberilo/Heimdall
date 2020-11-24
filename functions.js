const fetch = require('node-fetch');
const fs = require('fs');
const Discord = require('discord.js');

function addNewCharacter(message, character) {
  fs.readFile('./user-submitted/characters.json', function (err, data) {
    if (err) throw err;
    var json = JSON.parse(data);
    json.push(character);

    fs.writeFile(
      './user-submitted/characters.json',
      JSON.stringify(json, null, 2),
      (err) => {
        if (err) throw err;
        message.reply('Character written to file.');
      }
    );
  });
}

function rollDice(numberOf = 1, diceSize = 6, min = 0, plus = 0) {
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
  let numberOf = str.match(/[0-9]+d/)
  if(numberOf!==null){
    numberOf = parseInt(numberOf[0])
  }
  else{
    numberOf = 1
  }
  let diceSize = str.match(/d[0-9]+/)
  if(diceSize!==null){
    diceSize = parseInt(diceSize[0].substr(1))
  }
  else{
    diceSize = 6
  }
  let min = str.match(/r[0-9]+/)
  if(min!==null){
    min = parseInt(min[0].substr(1))
  }
  else{
    min = 0
  }
  let plus = str.match(/\+[0-9]+/)
  if(plus!==null){
    plus = parseInt(plus[0].substr(1))
  }
  else{
    plus = 0;
  }
  return rollDice(numberOf,diceSize,min,plus)
}

console.log(parseNumbers('5d6r5+2'))
console.log(parseNumbers('10d6+2'))
console.log(parseNumbers('5d1+2'))
console.log(parseNumbers('5d1r3'))
console.log(parseNumbers('r3+2'))

async function grabMeem(message) {
  try {
    const response = await fetch(
      'https://www.reddit.com/r/dndmemes/.json?limit=20'
    );
    const data = await response.json();
    const posts = data.data.children.filter(
      (child) => child.data.is_reddit_media_domain
    );
    const post = posts[Math.floor(Math.random() * posts.length)];
    const attachment = new Discord.MessageAttachment(
      post.data.url_overridden_by_dest
    );
    message.channel.send(attachment);
  } catch (error) {
    console.log(error);
  }
}

async function grabItems() {
  const res = await fetch('https://api.open5e.com/weapons/');
  const data = await res.json();
  console.log(data.results);
  return data.results;
}

function addToFile(message) {
  const whattoWrite = message.content.substr(message.content.indexOf(' ') + 1);
  const author = message.author.id;

  fs.readFile('./user-submitted/userMessages.json', function (err, data) {
    if (err) throw err;
    let json = JSON.parse(data);
    if (json[author] !== undefined) {
      console.log(json[author].messages);
      json = {
        [author]: { messages: json[author].messages.concat(whattoWrite) },
      };
    } else {
      console.log(json.author);
      json = { [author]: { messages: [whattoWrite] } };
    }
    fs.writeFile(
      './user-submitted/userMessages.json',
      JSON.stringify(json, null, 2),
      (err) => {
        if (err) throw err;
        message.reply('Character written to file.');
      }
    );
  });
}

module.exports = {
  addNewCharacter,
  rollDice,
  parseNumbers,
  grabMeem,
  grabItems,
  addToFile,
};
