// Export command
module.exports = {
  name: 'addlevels',
  description: 'Add levels to a user',
  permissions: ['ADMINISTRATOR'],
  execute: async (message, args) => {
    if (!message.content.startsWith(prefix + 'addlevels')) return;

    if (args.length !== 2) {
      await message.reply('Please provide a user mention and a number of levels.');
      return;
    }

    const userId = args[0].replace(/[<@!>]/g, '');

    const levels = parseInt(args[1]);

    if (isNaN(levels) || levels < 1) {
      await message.reply('Please provide a valid number of levels.');
      return;
    }

    const guildId = message.guild.id;

    const key = `${guildId}-${userId}`;
    const user = await db.get(key) || { score: 0, level: 0 };

    const score = user.score;
    const level = user.level;

    const newScore = score + (levels * 100);

    const newLevel = getLevel(newScore);

    user.score = newScore;
    user.level = newLevel;

    await db.set(key, user);

    await message.channel.send(`Successfully added ${levels} levels to <@${userId}>.`);
  },
};
