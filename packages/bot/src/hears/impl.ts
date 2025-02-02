import { HearsMiddleware } from 'grammy'
import { MyContext } from '../bot.js'

export interface BotHears {
  on: string
  handler: HearsMiddleware<MyContext>
}

export const createHears = (config: BotHears): BotHears => {
  return config
}
