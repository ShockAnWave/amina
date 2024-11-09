import {
  ApplicationCommandOptionData,
  ChatInputCommandInteraction,
  PermissionResolvable,
} from 'discord.js'

export interface Validation {
  callback: () => boolean | Promise<boolean>
  message: string
}

export interface SubCommand {
  trigger: string
  description: string
}

export const CommandCategories = {
  ADMIN: 'ADMIN',
  ANIME: 'ANIME',
  AUTOMOD: 'AUTOMOD',
  ECONOMY: 'ECONOMY',
  FUN: 'FUN',
  IMAGE: 'IMAGE',
  INFORMATION: 'INFORMATION',
  INVITE: 'INVITE',
  MODERATION: 'MODERATION',
  ERELA_JS: 'ERELA_JS',
  NONE: 'NONE',
  DEV: 'DEV',
  SOCIAL: 'SOCIAL',
  SUGGESTION: 'SUGGESTION',
  TICKET: 'TICKET',
  UTILITY: 'UTILITY',
} as const

export type CommandCategory = keyof typeof CommandCategories

export interface InteractionInfo {
  enabled: boolean
  ephemeral: boolean
  options: ApplicationCommandOptionData[]
}

export interface CommandInfo {
  enabled: boolean
  aliases?: string[]
  usage?: string
  minArgsCount?: number
  subcommands?: SubCommand[]
}

// You might want to define this interface based on what data you're passing
export interface CommandData {
  // Add your data structure here
  [key: string]: unknown
}

export interface Command {
  testGuildOnly: any
  devOnly: any
  name: string
  description: string
  cooldown: number
  isPremium?: boolean
  category: CommandCategory
  botPermissions?: PermissionResolvable[]
  userPermissions?: PermissionResolvable[]
  validations?: Validation[]
  command: CommandInfo
  slashCommand: InteractionInfo
  interactionRun: (
    interaction: ChatInputCommandInteraction,
    data: CommandData
  ) => Promise<void> | void
}

export const DefaultCommand: Command = {
  name: '',
  description: '',
  cooldown: 0,
  isPremium: false,
  category: 'NONE',
  botPermissions: [],
  userPermissions: [],
  validations: [],
  command: {
    enabled: true,
  },
  slashCommand: {
    enabled: true,
    ephemeral: false,
    options: [],
  },
  interactionRun: async (
    _interaction: ChatInputCommandInteraction,
    _data: CommandData
  ) => {},
  testGuildOnly: undefined,
  devOnly: undefined,
}
