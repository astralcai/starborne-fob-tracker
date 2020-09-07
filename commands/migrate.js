module.exports = {
  name: 'migrate',
  description: 'Migrate records associated with this channel to a different channel',
  execute(message, args) {
    message.channel.send("Run `.init " + message.channel.id + "` in the target channel");
  }
}
