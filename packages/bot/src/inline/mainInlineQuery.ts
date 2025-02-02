import { createInlineQuery } from './impl.js'
import { InlineKeyboard, InlineQueryResultBuilder } from 'grammy'
import { emoji } from '@grammyjs/emoji'

export const mainInlineQuery = createInlineQuery({
  on: /.+/,
  handler: async (ctx) => {
    if (!ctx.inlineQuery.query) {
      return
    }

    const entries = await ctx.injected.tmdbService.searchTvShowsAndMovies(
      ctx.inlineQuery.query,
    )

    const answers = entries.map((e) => {
      return InlineQueryResultBuilder.article(e.id.toString(), e.title, {
        reply_markup: new InlineKeyboard().switchInlineCurrent(
          `Search ${emoji('magnifying_glass_tilted_left')}`,
          'https://google.com',
        ),
        thumbnail_url: e.posterUrl,
        description: e.overview,
      }).text(e.overview)
    })

    await ctx.answerInlineQuery(answers, {
      cache_time: 10,
    })
  },
})
