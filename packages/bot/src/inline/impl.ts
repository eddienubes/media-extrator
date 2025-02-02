import { InlineQueryMiddleware } from 'grammy'
import { MyContext } from '../bot.js'

export interface BotInlineQuery {
  on: string | RegExp
  handler: InlineQueryMiddleware<MyContext>
}

export const createInlineQuery = (config: BotInlineQuery): BotInlineQuery => {
  return config
}
