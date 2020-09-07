require('dotenv').config();
const fs = require('fs');
const load = require('./utils/load.js');

function sendRecord(channel, record) {

  let jumpTargetStr = "None";
  let jumpETAStr = "N/A";

  if (record.jumpTarget.length) {
    jumpTargetStr = "/goto " + record.jumpTarget[0] + " " + record.jumpTarget[1];
  }

  if (record.jumpETA) {
    jumpETAStr = (new Date(record.jumpETA)).toUTCString();
  }

  let recordAgeStr = Math.round((new Date() - new Date(record.updateTime)) / 36e5) + " Hours Ago";

  channel.send(record.name + "\n" +
    "Coordinates: /goto " + record.coordinates[0] + " " + record.coordinates[1] + "\n" +
    "Jump Target: " + jumpTargetStr + "\n" +
    "Jump ETA: " + jumpETAStr + "\n" +
    "Last Updated: " + recordAgeStr);
}

function find(message, args) {

  // check for validity of the inputs
  if (!args || args.length !== 1) {
    throw "Incorrect command format";
  }

  // retrieve info from arguments
  const name = args[0].toUpperCase();

  // read database from file
  const databaseFull = load(message.channel.id);
  const database = databaseFull[message.channel.id];

  // retrieve record for FOB
  if (name in database) {

    const record = database[name];

    // check if jump is completed and update accordingly
    if (new Date() > new Date(record.jumpETA)) {

      record.coordinates = record.jumpTarget;
      record.updateTime = record.jumpETA;
      record.jumpTarget = [];
      record.jumpETA = "";

      // save new record to database
      fs.writeFileSync(process.env.DATABASE_FILENAME, JSON.stringify(databaseFull));
    }

    sendRecord(message.channel, record);

  } else {
    message.channel.send("Record not found!");
  }

}

module.exports = {
  name: 'find',
  description: 'Display enemy FOB location and status',
  execute(message, args) {
    try {
      find(message, args)
    } catch (err) {
      message.channel.send(err);
    }
  },
};
