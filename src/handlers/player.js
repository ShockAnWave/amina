const { EMBED_COLORS, MUSIC } = require('@src/config')
const { EmbedBuilder } = require('discord.js')

export default {
  autoplayFunction: async (client, track, player) => {
    if (player.queue.tracks.length > 0) return
    if (!track) return

    const channel = client.guilds.cache
      .get(player.guildId)
      ?.channels.cache.get(player.textChannelId)

    let url, source

    switch (track.info.sourceName) {
      case 'spotify':
        url = `seed_tracks=${track.info.identifier ?? '11xbo8bGa5XTrXrGP77zwc'}&limit=20&min_popularity=30`
        source = 'sprec'
        break

      case 'youtube':
        url = `https://youtube.com/watch?v=${track.info.identifier ?? 'lpeuIu-ZYJY'}&list=RD${track.info.identifier ?? 'lpeuIu-ZYJY'}`
        source = 'ytsearch'
        break

      case 'jiosaavn':
        url = `${track.info.identifier ?? 'Hvma-gqd'}`
        source = 'jsrec'
        break

      default:
        url = track.info.author
        source = MUSIC.DEFAULT_SOURCE
        break
    }

    const res = await player.search(
      { query: url, source: source },
      track.requester
    )

    if (!res || res.tracks.length === 0) {
      await channel.safeSend(
        {
          embeds: [
            new EmbedBuilder()
              .setColor(EMBED_COLORS.WARNING)
              .setDescription('> Autoplay, No results found'),
          ],
        },
        10
      )
      return player.destroy()
    }

    for (let songs = 0; songs < 3; ) {
      const chosen = res.tracks[Math.floor(Math.random() * res.tracks.length)]

      if (
        !player.queue.previous?.some(
          o => o.info.identifier === chosen.info.identifier
        ) &&
        !player.queue.tracks.some(
          o => o.info.identifier === chosen.info.identifier
        )
      ) {
        await player.queue.add(chosen)
        songs++
      }
    }

    if (player.queue.tracks.length === 0) {
      await channel?.safeSend(
        {
          embeds: [
            new EmbedBuilder()
              .setColor(EMBED_COLORS.WARNING)
              .setDescription('> Autoplay, No unique track found'),
          ],
        },
        10
      )
      return player.destroy()
    }
  },
}
