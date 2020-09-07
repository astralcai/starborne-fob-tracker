require('dotenv').config();
const fs = require('fs');

function updateChannelID(database, oldID, newID) {

  for (const key of Object.keys(database)) {
    if (key === oldID) {
      // update channel ID for the existing record
      database[newID] = database[key];
      delete database[key];
      return true;
    }
  }
  return false;
}

module.exports = {
  name: 'init',
  description: 'Initialize tracking in this channel',
  execute(message, args) {

    // read database from file
    let database = {}
    if (fs.existsSync(process.env.DATABASE_FILENAME)) {
      const jsonString = fs.readFileSync(process.env.DATABASE_FILENAME);
      database = JSON.parse(jsonString.toString());
    }

    // parse command arguments
    if (args && args.length === 1) {
      // register current channel to existing record
      const res = updateChannelID(database, args[0], message.channel.id);
      if (!res) message.channel.send("Record not found for this old channel ID!");
      else message.channel.send("Channel ID updated!");
    } else if (!args || args.length === 0) {
      // create new record for this channel
      database[message.channel.id] = {}
      message.channel.send("FOB Tracker Initialized!")
    } else {
      message.channel.send("Incorrect command format!");
    }

    // save new record to database
    fs.writeFileSync(process.env.DATABASE_FILENAME, JSON.stringify(database));

  }
}
