const fs = require("fs");

module.exports = function (channelID) {

  let databaseFull = {}
  if (fs.existsSync(process.env.DATABASE_FILENAME)) {
    const jsonString = fs.readFileSync(process.env.DATABASE_FILENAME);
    databaseFull = JSON.parse(jsonString.toString());
  }

  // check if the current channel is registered
  if (!(channelID in databaseFull)) {
    throw "This channel is not yet registered with the database! Run `.init` to start tracking FOBs in this channel.";
  }

  // retrieve records
  return databaseFull;

}
