import {
  sendFileNotFoundError,
  sendEditMenu,
  sendConfirmedError,
  sendChangeInformation,
  sendConfirmedQuestion,
  isEditMenu,
  sendCreateMenu,
  sendCantConfirmYourself,
  sendIsConfirmed,
  sendIsUnconfirmed,
  sendTelegramId,
  sendFileAlreadyExists,
  sendYouNeedAtLeast,
  sendFileCreated,
  sendConfirmedFiles,
  sendCantConfirmAMoreConfirmed,
  sendDeleteConfirmation,
  sendUpdate,
} from "./messages";
import {
  loadFile,
  extractMetadataMarkdown,
  saveFile,
  deepSearchFiles,
  deepListAllFiles,
  deepListFiles,
  deleteFile,
  getChanges,
} from "./file";
import { checkMetadataKeyValue, editMetadataKeyValue, inexactMetadataMarkdown } from "./metadata";
import { Change, FileContent } from "@/types";
import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";

const onCallbackQuery = async (bot: TelegramBot, callbackQuery: CallbackQuery) => {
  switch (callbackQuery.data) {
    case "confirm":
      await onConfirmed(bot, callbackQuery.message as Message);
      break;
    case "delete":
      await onDelete(bot, callbackQuery);
      break;
  }

  bot.answerCallbackQuery(callbackQuery.id);
};

const onDelete = async (bot: TelegramBot, callbackQuery: CallbackQuery) => {
  if (!callbackQuery.message) return;
  if (!callbackQuery.message.text) return;
  if (!callbackQuery.message.chat) return;
  if (!callbackQuery.message.chat.id) return;

  const chatId = callbackQuery.message.chat.id;
  const fileName = callbackQuery.message.text.match(/\[([^)]+)\]/)![1].replace(/\[|\]/g, "");
  const file = loadFile(fileName);
  if (!file || file == null) return sendFileNotFoundError(bot, `${chatId}`, fileName);
  const hasConfirmed = checkMetadataKeyValue(file.metadata, "confirmed", `${chatId}`);
  if (!hasConfirmed) {
    sendFileNotFoundError(bot, `${chatId}`, fileName);
    return;
  }
  deleteFile(fileName);
  await onUpdate(bot, fileName, "deleted");
  sendDeleteConfirmation(bot, `${chatId}`, fileName);
};

const onConfirm = async (bot: TelegramBot, msg: Message) => {
  if (!msg.text) return;
  if (!msg.chat) return;
  if (!msg.chat.id) return;
  if (!msg.from) return;
  if (!msg.from.id) return;

  const chatId = msg.chat.id;
  const fileName = msg.text.split(" ").slice(2).join(" ");

  const telegramId = msg.from.id;

  if (chatId == telegramId) {
    sendCantConfirmYourself(bot, `${chatId}`);
    return;
  }

  const file = loadFile(fileName);
  if (!file) sendFileNotFoundError(bot, `${chatId}`, fileName);

  const hasConfirmed = checkMetadataKeyValue(file.metadata, "confirmed", `${telegramId}`);
  const countConfirmed = deepSearchFiles("confirmed", `${telegramId}`);
  const countConfirmedByMe = deepSearchFiles("confirmed", `${chatId}`);

  if (!hasConfirmed)
    if (countConfirmed >= countConfirmedByMe)
      return sendCantConfirmAMoreConfirmed(bot,  `${chatId}`, fileName, countConfirmed, countConfirmedByMe);

  let newFile = { ...file };
  newFile.metadata = editMetadataKeyValue(newFile.metadata, "confirmed", `${telegramId}`);
  saveFile(fileName, newFile);
  await onUpdate(bot, fileName, newFile.content);
  const isConfirmed = checkMetadataKeyValue(newFile.metadata, "confirmed", `${telegramId}`);
  if (isConfirmed) sendIsConfirmed(bot,  `${chatId}`, telegramId, fileName);
  else sendIsUnconfirmed(bot,  `${chatId}`, telegramId, fileName);
};

const onChange = async (bot: TelegramBot, msg: Message) => {
  const chatId = msg.chat.id;
  const fileName = (msg.text || "").split(" ").slice(1).join(" ");
  const file = loadFile(fileName);
  if (!file || file == null) {
    sendFileNotFoundError(bot,  `${chatId}`, fileName);
    return;
  }
  await bot.sendMessage( `${chatId}`, file.content);

  let hasConfirmed = checkMetadataKeyValue(file.metadata, "confirmed",  `${chatId}`);

  const minimumConfirmed = 3;
  const countConfirmed = deepSearchFiles("confirmed",  `${chatId}`);
  const hasMinimumConfirmed = countConfirmed >= minimumConfirmed;

  if (hasConfirmed || hasMinimumConfirmed) sendEditMenu(bot,  `${chatId}`, fileName);
  else sendConfirmedError(bot,  `${chatId}`, fileName);
};

const onMessage = async (bot: TelegramBot, msg: Message) => {
  if (msg.reply_to_message) {
    if (!isEditMenu(msg.reply_to_message.text || "")) return;

    const chatId = msg.chat.id;
    const fileName = (msg.reply_to_message.text || "").match(/\[([^)]+)\]/)![1].replace(/\[|\]/g, "");

    const value = msg.text || "";
    let netFile = extractMetadataMarkdown(value);
    if (!netFile || netFile == null) sendFileNotFoundError(bot,  `${chatId}`, fileName);

    const file = loadFile(fileName);
    let hasConfirmed = checkMetadataKeyValue(file.metadata, "confirmed",  `${chatId}`);

    if (!hasConfirmed) {
      sendConfirmedError(bot,  `${chatId}`, fileName);
      return;
    }

    let changes: Change[] = getChanges(file, netFile);

    await sendChangeInformation(bot,  `${chatId}`, changes);

    if (!file || file == null) return sendFileNotFoundError(bot,  `${chatId}`, fileName);

    sendConfirmedQuestion(bot,  `${chatId}`, fileName, netFile.content);
  }
};

const onConfirmed = async (bot: TelegramBot, msg: Message) => {
  const chatId = msg.chat.id;
  const fileName = (msg.text || "")
    .split("\n")[0]
    .match(/\[([^)]+)\]/)![1]
    .replace(/\[|\]/g, "");
  const newContext = (msg.text || "").split("\n").slice(1).join("\n");
  const file = loadFile(fileName);
  if (!file || file == null) return sendFileNotFoundError(bot,  `${chatId}`, fileName);

  let hasConfirmed = checkMetadataKeyValue(file.metadata, "confirmed",  `${chatId}`);
  if (!hasConfirmed) {
    sendConfirmedError(bot,  `${chatId}`, fileName);
    return;
  }

  let netFile = extractMetadataMarkdown(newContext);
  if (!netFile) sendFileNotFoundError(bot,  `${chatId}`, fileName);

  file.metadata = netFile.metadata;
  file.markdown = netFile.markdown;
  file.content = netFile.content;

  saveFile(fileName, file);
  await onUpdate(bot, fileName, file.content);
  sendEditMenu(bot,  `${chatId}`, fileName);
};

const onCreate = async (bot: TelegramBot, msg: Message) => {
  const chatId = msg.chat.id;
  let _fileName = (msg.text || "").split(" ").slice(2).join(" ");
  const fileDate = (msg.text || "").split(" ").slice(-1)[0];
  const fileName = _fileName.replace(fileDate, "").trim();

  const minimumConfirmed = 1;
  const countConfirmed = deepSearchFiles("confirmed", `${msg.from?.id}`);
  if (countConfirmed < minimumConfirmed) return sendYouNeedAtLeast(bot,  `${chatId}`, minimumConfirmed);

  const file = loadFile(fileName);
  if (file) return sendFileAlreadyExists(bot,  `${chatId}`, fileName);

  let metadata = {
    mail: "",
    location: "",
    tags: [],
    connections: [],
    // confirmed: [msg.from.id],
    confirmed: [(msg.from?.id || "") as string] as string[],
  };

  let markdown = "\n42";
  let content = inexactMetadataMarkdown(metadata, markdown).inexactContent;
  let name = fileName;

  let fileContent: FileContent = {
    category: null,
    path: null,
    markdown,
    metadata,
    name
  };

  saveFile(fileName, fileContent, fileDate, "category"); // Replace 'category' with the actual type
  await onUpdate(bot, fileName, content);
  sendFileCreated(bot,  `${chatId}`, fileName);
  await bot.sendMessage( `${chatId}`, content);
  sendEditMenu(bot,  `${chatId}`, fileName);
};

const onCheck = async (bot: TelegramBot, msg: Message) => {
  const chatId = msg.chat.id;
  if (msg.from?.id == undefined) return;
  await sendTelegramId(bot,  `${chatId}`, `${msg.from.id}`);
  let confirmed = deepListAllFiles("confirmed", `${msg.from.id}`);
  await sendConfirmedFiles(bot,  `${chatId}`, confirmed);
};

// send all confirmed from "Singularity" a message of a new saved file
const onUpdate = async (bot: TelegramBot, name: string, content: string) => {
  let rootFile = loadFile("Singularity");
  let file = loadFile(name);

  if (!file) return;
  if (!rootFile) return;

  let rootConfirmed = rootFile.metadata.confirmed;
  if (!rootConfirmed) return;
  (rootConfirmed as string[]).forEach((telegramId) => {
    sendUpdate(bot, telegramId, name, content);
  });

  let confirmed = file.metadata.confirmed;
  if (!confirmed) return;
  (confirmed as string[]).forEach((telegramId) => {
    if (!rootConfirmed.includes(telegramId)) sendUpdate(bot, telegramId, name, content);
  });
};

export { onUpdate, onCheck, onCreate, onConfirm, onChange, onCallbackQuery, onMessage };
