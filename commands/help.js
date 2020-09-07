const Discord = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Display help message.',
  execute(message, args) {
    if (args && args.length) {
      // TODO: add command specific help if needed.
      message.channel.send("Not Supported");
    } else {
      const helpMsg = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Fob Tracker Help')
        .addFields(
          {
            name: "Initialize the tracker for this channel",
            value: "Run `.init` before you start tracking FOBs with this bot. This will register this channel " +
              "as an account in our backend."
          }, {
            name: "Display help message",
            value: "`.help` to see a list of commands or `.help [command]` " +
              "to see detailed instructions on how to use each command."
          }, {
            name: "Check enemy FOB location and status",
            value: "`.find XXX`, where \'XXX\' is the name of the alliance."
          }, {
            name: "Update enemy FOB location",
            value: "`.update XXX 123 456`, where \'XXX\' is the name of the alliance, followed by its coordinates"
          }, {
            name: "Log location and ETA of an enemy FOB jump",
            value: "`.jump XXX 123 456 ETA 00:00:00`, where \`XXX\` is the name of the alliance, followed by " +
              "the coordinates of the jump target. The ETA should be in server time"
          }, {
            name: "Find out which alliance's FOB is jumping to a given location",
            value: "`.who 123 456`, where 123 456 is the coordinates for the hex with the black swirling animation."
          }, {
            name: "Start tracking the same FOBs in a different discord channel",
            value: "`.migrate` to see instructions on how to migrate FOB tracking to a different channel"
          })
      message.channel.send(helpMsg);
    }
  },
};
