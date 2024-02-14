// telegramBot.js
const TelegramBot = require("node-telegram-bot-api");
const {
  onChange,
  onCallbackQuery,
  onMessage,
  onConfirm,
  onCreate,
  onCheck,
  onUpdate,
} = require("./utilities/commands.compressed");
const { sendHelp } = require("./utilities/messages.compressed");

const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (!botToken) {
  console.error(
    "Bot token not provided. Make sure to set the TELEGRAM_BOT_TOKEN in the environment."
  );
  process.exit(1);
}

const bot = new TelegramBot(botToken, { polling: true });

let credentials = [];

bot.onText(
  /^\/create\s+(creative|collection|concept|collaboration)\s+(.+)$/,
  async (msg, match) => onCreate(bot, msg, credentials)
);
bot.onText(/^\/create\s+(collaboration)\s+(.+)\s+(.+)$/, async (msg, match) =>
  onCreate(bot, msg, credentials)
);
bot.onText(/^\/confirm\s+(\d+)\s+(.+)$/, async (msg, match) =>
  onConfirm(bot, msg, credentials)
);

bot.onText(/^\/contact (.+)/, async (msg, match) =>
  onUpdate(bot, "Singularity", msg.text || "", credentials)
);
bot.onText(/^\/change\s+(.+)$/, async (msg, match) =>
  onChange(bot, msg, credentials)
);
bot.onText(/^\/check/, async (msg, match) => onCheck(bot, msg));

bot.onText(/^\/start/, async (msg, match) => sendHelp(bot, msg));
bot.onText(/^\/help/, async (msg, match) => sendHelp(bot, msg));

bot.on("callback_query", async (callbackQuery) =>
  onCallbackQuery(bot, callbackQuery, credentials)
);
bot.on("message", async (msg) => onMessage(bot, msg, credentials));
