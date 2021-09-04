const { Command } = require("@src/structures");
const { MessageEmbed, Message } = require("discord.js");
const { getUser, depositCoins } = require("@schemas/user-schema");
const { EMBED_COLORS, EMOJIS } = require("@root/config.js");

module.exports = class Balance extends Command {
  constructor(client) {
    super(client, {
      name: "withdraw",
      description: "withdraw your coins from the bank",
      cooldown: 5,
      command: {
        enabled: true,
        usage: "<coins>",
        category: "ECONOMY",
        botPermissions: ["EMBED_LINKS"],
      },
      slashCommand: {
        enabled: false,
      },
    });
  }

  /**
   * @param {Message} message
   * @param {string[]} args
   */
  async messageRun(message, args) {
    const toWithdraw = args[0];

    if (isNaN(toWithdraw) || toWithdraw <= 0) return message.reply("Please enter a valid amount of coins to deposit");
    const economy = await getUser(message.author.id);
    const available = economy?.bank || 0;

    if (toWithdraw > available) return message.reply(`You only have ${available}${EMOJIS.CURRENCY} coins in your bank`);

    const newBal = await depositCoins(message.author.id, -toWithdraw);

    const embed = new MessageEmbed()
      .setColor(EMBED_COLORS.BOT_EMBED)
      .setAuthor("New Balance")
      .setThumbnail(message.author.displayAvatarURL())
      .addField("Wallet", `${newBal?.coins || 0}${EMOJIS.CURRENCY}`, true)
      .addField("Bank", `${newBal?.bank || 0}${EMOJIS.CURRENCY}`, true)
      .addField("Net Worth", `${(newBal?.coins || 0) + (newBal?.bank || 0)}${EMOJIS.CURRENCY}`, true);

    message.channel.send({ embeds: [embed] });
  }
};