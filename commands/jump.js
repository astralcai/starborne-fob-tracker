require('dotenv').config();
const fs = require('fs');
const find = require('./find.js');
const load = require('./utils/load.js');

function processETAStr(timeStr) {

  let hour, minute, second;
  [hour, minute, second] = timeStr.trim().split(":");

  let time = new Date();
  if (hour < time.getUTCHours()) {
    // if the jump ETA is before the current time, it is in the next day
    time.setUTCDate(time.getUTCDate() + 1)
  }

  // set the ETA according to input, assume same day
  time.setUTCHours(hour);
  time.setUTCMinutes(minute);
  time.setUTCSeconds(second);
  time.setUTCMilliseconds(0);

  // return the time object
  return time;

}

function jump(message, args) {

  // check for validity of the inputs
  if (!args || args.length !== 5) {
    throw "Incorrect command format";
  } else if (isNaN(args[1]) || isNaN(args[2])) {
    throw "Invalid coordinates";
  } else if (args[3] !== "ETA") {
    throw "Incorrect command format";
  } else if (!args[4].match(/^\d\d:\d\d:\d\d$/)) {
    throw "Invalid ETA format";
  }

  // parse message content
  const name = args[0].toUpperCase();
  const jumpTarget = [parseInt(args[1]), parseInt(args[2])];
  const jumpETAStr = args[4];

  // process jump ETA
  const jumpETA = processETAStr(jumpETAStr);

  // read database from file
  const databaseFull = load(message.channel.id);
  const database = databaseFull[message.channel.id];

  // retrieve record for FOB
  if (name in database) {

    const record = database[name];

    // check if jump is completed and update accordingly
    if (new Date() > new Date(record.jumpETA)) {
      record.coordinates = record.jumpTarget;
    }

    record.jumpTarget = jumpTarget;
    record.jumpETA = jumpETA.toJSON();
    record.updateTime = (new Date()).toJSON();

    // save new record to database
    fs.writeFileSync(process.env.DATABASE_FILENAME, JSON.stringify(databaseFull));

    // display updated record
    find.execute(message, [name]);

  } else {
    message.channel.send("Record not found!");
  }

}

module.exports = {
  name: 'jump',
  description: 'Log the jump target and ETA of an enemy FOB',
  execute(message, args) {
    try {
      jump(message, args)
    } catch (err) {
      message.channel.send(err);
    }
  },
};
