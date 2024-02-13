// telegramBot.ts
// import * as TelegramBot from 'node-telegram-bot-api';
import TelegramBot from 'node-telegram-bot-api';	

import { onChange, onCallbackQuery, onMessage, onConfirm, onCreate, onCheck, onUpdate } from './utilities/commands';
import { sendHelp } from './utilities/messages';

const botToken: string | undefined = process.env.TELEGRAM_BOT_TOKEN;
if (!botToken) {
  console.error('Bot token not provided. Make sure to set the TELEGRAM_BOT_TOKEN in the environment.');
  process.exit(1);
}

const bot = new TelegramBot(botToken, { polling: true });

bot.onText(/^\/create\s+(creative|collection|concept|collaboration)\s+(.+)$/, async (msg, match) => onCreate(bot, msg));
bot.onText(/^\/create\s+(collaboration)\s+(.+)\s+(.+)$/, async (msg, match) => onCreate(bot, msg));
bot.onText(/^\/confirm\s+(\d+)\s+(.+)$/, async (msg, match) => onConfirm(bot, msg));

bot.onText(/^\/contact (.+)/, async (msg, match) => onUpdate(bot, "Singularity", msg.text as string || ''));
bot.onText(/^\/change\s+(.+)$/, async (msg, match) => onChange(bot, msg));
bot.onText(/^\/check/, async (msg, match) => onCheck(bot, msg));

bot.onText(/^\/start/, async (msg, match) => sendHelp(bot, msg));
bot.onText(/^\/help/, async (msg, match) => sendHelp(bot, msg));

bot.on('callback_query', async (callbackQuery) => onCallbackQuery(bot, callbackQuery));
bot.on('message', async (msg) => onMessage(bot, msg));
