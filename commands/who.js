require('dotenv').config();
const fs = require('fs');
const find = require('./find.js')
const load = require('./utils/load.js');

function who(message, args) {

  // check for validity of the inputs
  if (!args || args.length !== 2) {
    throw "Incorrect command format";
  } else if (isNaN(args[0]) || isNaN(args[1])) {
    throw "Invalid coordinates";
  }

  // parse command
  const coordinates = [parseInt(args[0]), parseInt(args[1])];

  // read database from file
  const database = load(message.channel.id)[message.channel.id];

  // find name of FOB
  for (let [name, entry] of Object.entries(database)) {
    if (entry.jumpTarget[0] === coordinates[0] && entry.jumpTarget[1] === coordinates[1]) {
      find.execute(message, [name])
      return;
    }
  }

  message.channel.send("No record found!");

}

module.exports = {
  name: 'who',
  description: 'Find out which alliance is jumping to a given location',
  execute(message, args) {
    try {
      who(message, args)
    } catch (err) {
      message.channel.send("Error: " + err);
    }
  },
};
