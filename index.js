require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');

const PREFIX = ".";

const client = new Discord.Client();

// load all commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once("ready", () => console.log("FOB Tracker Online"));

client.on("message", message => {

  // check for message prefix
  if (!message.content.startsWith(`${PREFIX}`) || message.author.bot) return;

  // parse command and arguments
  let args = message.content.trim().split(/ +/);
  let command = args.shift().substr(1);

  // run command
  client.commands.get(command).execute(message, args)

})

client.login(process.env.BOT_TOKEN);  //BOT_TOKEN is the Client Secret
