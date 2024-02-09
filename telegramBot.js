// telegramBot.js

const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');

const { onChange, onCallbackQuery, onMessage, onConfirm, onCreate, onCheck, onUpdate } = require('./utilities/commands');
const { sendHelp } = require('./utilities/messages');

dotenv.config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(botToken, { polling: true });

console.log('Bot is running...');
bot.onText(/^\/create\s+(creative|collection|concept|collaboration)\s+(.+)$/, async (msg, match) => onCreate(bot, msg, match));
bot.onText(/^\/create\s+(collaboration)\s+(.+)\s+(.+)$/, async (msg, match) => onCreate(bot, msg, match));
bot.onText(/^\/confirm\s+(\d+)\s+(.+)$/, async (msg, match) => onConfirm(bot, msg, match));

bot.onText(/^\/contact (.+)/, async (msg, match) => onUpdate(bot, "Singularity", msg.text));
bot.onText(/^\/change\s+(.+)$/, async (msg, match) => onChange(bot, msg, match));
bot.onText(/^\/check/, async (msg, match) => onCheck(bot, msg, match));

bot.onText(/^\/start/, async (msg, match) => sendHelp(bot, msg.chat.id));
bot.onText(/^\/help/, async (msg, match) => sendHelp(bot, msg.chat.id));
bot.on('callback_query', async (callbackQuery) => onCallbackQuery(bot, callbackQuery));
bot.on('message', async (msg) => onMessage(bot, msg));