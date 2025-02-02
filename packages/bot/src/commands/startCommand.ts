import { createCommand } from './impl.js'
import { Keyboard } from 'grammy'
import { searchHears } from '../hears/searchHears.js'
import { emoji } from "@grammyjs/emoji";

export const startCommand = createCommand({
  on: 'start',
  handler: async (ctx) => {
    await ctx.reply(`Hi! ${emoji('waving_hand')}`, {
      reply_markup: new Keyboard().text(searchHears.on).resized(),
    })
  },
})
