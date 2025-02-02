import { createHears } from './impl.js'
import { emoji } from '@grammyjs/emoji'
import { bold, fmt } from '@grammyjs/parse-mode'
import { InlineKeyboard } from 'grammy'

export const searchHears = createHears({
  on: `Search ${emoji('magnifying_glass_tilted_left')}`,
  handler: async (ctx) => {
    await ctx.replyFmt(fmt`${bold(`Let's search!`)}`, {
      reply_markup: new InlineKeyboard().switchInlineCurrent(searchHears.on),
    })
  },
})
