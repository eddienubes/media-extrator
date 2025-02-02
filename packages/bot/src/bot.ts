import { Bot, Context } from 'grammy'
import { TmdbService } from '@carny/core'
import { EmojiFlavor, emojiParser } from '@grammyjs/emoji'
import { searchHears } from './hears/searchHears.js'
import { startCommand } from './commands/startCommand.js'
import { hydrateReply, ParseModeFlavor } from '@grammyjs/parse-mode'
import {
  DependenciesContext,
  injectionMiddleware,
} from './middlewares/injectionMiddleware.js'
import { mainInlineQuery } from './inline/mainInlineQuery.js'

export type MyContext = DependenciesContext<ParseModeFlavor<EmojiFlavor>>

const bot = new Bot<MyContext>(process.env.BOT_TOKEN as string)

bot.use(emojiParser())
bot.use(hydrateReply)
bot.use(injectionMiddleware)

const main = async () => {
  bot.hears(searchHears.on, searchHears.handler)

  bot.command(startCommand.on, startCommand.handler)

  bot.inlineQuery(mainInlineQuery.on, mainInlineQuery.handler)

  await bot.start()
}

main()
