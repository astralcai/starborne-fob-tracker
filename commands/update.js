require('dotenv').config();
const fs = require('fs');
const find = require('./find.js');
const load = require('./utils/load.js');


function update(message, args) {

  // check for validity of the inputs
  if (!args || args.length !== 3) {
    throw "Incorrect command format";
  } else if (isNaN(args[1]) || isNaN(args[2])) {
    throw "Invalid coordinates";
  }

  // parse message content
  const name = args[0].toUpperCase();
  const coordinates = [parseInt(args[1]), parseInt(args[2])];
  const now = new Date();

  // read database from file
  const databaseFull = load(message.channel.id);
  const database = databaseFull[message.channel.id];

  // update or create new record
  database[name] = {
    name: name,
    coordinates: coordinates,
    jumpTarget: [],
    jumpETA: "",
    updateTime: now.toJSON(),
  };

  // save new record to database
  fs.writeFileSync(process.env.DATABASE_FILENAME, JSON.stringify(databaseFull));

  // display updated record
  find.execute(message, [name]);

}

module.exports = {
  name: 'update',
  description: 'Update enemy FOB location',
  execute(message, args) {
    try {
      update(message, args)
    } catch (err) {
      message.channel.send(err);
    }
  },
};
