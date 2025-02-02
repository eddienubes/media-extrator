import { CommandMiddleware } from 'grammy'
import { MyContext } from '../bot.js'

export interface BotCommand {
  on: string
  handler: CommandMiddleware<MyContext>
}

export const createCommand = (config: BotCommand) => {
  return config
}
