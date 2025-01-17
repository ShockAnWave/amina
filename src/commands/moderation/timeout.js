const { timeoutTarget } = require('@helpers/ModUtils')
import { MODERATION } from '@src/config'
const { ApplicationCommandOptionType } = require('discord.js')
const ems = require('enhanced-ms')

/**
 * @type {import("@structures/Command")}
 */
export default {
  name: 'timeout',
  description: 'timeouts the specified member',
  category: 'MODERATION',
  botPermissions: ['ModerateMembers'],
  userPermissions: ['ModerateMembers'],

  slashCommand: {
    enabled: MODERATION.ENABLED,
    options: [
      {
        name: 'user',
        description: 'the target member',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: 'duration',
        description: 'the time to timeout the member for',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'reason',
        description: 'reason for timeout',
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },

  async interactionRun(interaction) {
    const user = interaction.options.getUser('user')

    // parse time
    const duration = interaction.options.getString('duration')
    const ms = ems(duration)
    if (!ms)
      return interaction.followUp(
        'Please provide a valid duration. Example: 1d/1h/1m/1s'
      )

    const reason = interaction.options.getString('reason')
    const target = await interaction.guild.members.fetch(user.id)

    const response = await timeout(interaction.member, target, ms, reason)
    await interaction.followUp(response)
  },
}

async function timeout(issuer, target, ms, reason) {
  if (isNaN(ms)) return 'Please provide a valid duration. Example: 1d/1h/1m/1s'
  const response = await timeoutTarget(issuer, target, ms, reason)
  if (typeof response === 'boolean')
    return `${target.user.username} is timed out!`
  if (response === 'BOT_PERM')
    return `I do not have permission to timeout ${target.user.username}`
  else if (response === 'MEMBER_PERM')
    return `You do not have permission to timeout ${target.user.username}`
  else if (response === 'ALREADY_TIMEOUT')
    return `${target.user.username} is already timed out!`
  else return `Failed to timeout ${target.user.username}`
}
