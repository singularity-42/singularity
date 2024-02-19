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
  saveFile,
  deepSearchFiles,
  deepListAllFiles,
  deepListFiles,
  deleteFile,
  getChanges,
} from "./file";
import { checkMetadataKeyValue, editMetadataKeyValue, extractMetadataMarkdown, inexactMetadataMarkdown } from "./metadata";
import { Change, FileContent } from "@/types";
import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";

export const onCallbackQuery = async (bot: TelegramBot, callbackQuery: CallbackQuery, credentials: string[]) => {
  switch (callbackQuery.data) {
    case "confirm":
      await onConfirmed(bot, callbackQuery.message as Message, credentials);
      break;
    case "delete":
      await onDelete(bot, callbackQuery, credentials);
      break;
  }

  bot.answerCallbackQuery(callbackQuery.id);
};

export const onDelete = async (bot: TelegramBot, callbackQuery: CallbackQuery, credentials: string[]) => {
  if (!callbackQuery.message) return;
  if (!callbackQuery.message.text) return;
  if (!callbackQuery.message.chat) return;
  if (!callbackQuery.message.chat.id) return;

  const chatId = callbackQuery.message.chat.id;
  const fileName = callbackQuery.message.text.match(/\[([^)]+)\]/)![1].replace(/\[|\]/g, "");
  const file = loadFile(credentials, fileName);
  if (!file || file == null) return sendFileNotFoundError(bot, `${chatId}`, fileName);
  const hasConfirmed = checkMetadataKeyValue(file.metadata, "confirmed", `${chatId}`);
  if (!hasConfirmed) {
    sendFileNotFoundError(bot, `${chatId}`, fileName);
    return;
  }
  deleteFile(fileName);
  await onUpdate(bot, fileName, "deleted", credentials);
  sendDeleteConfirmation(bot, `${chatId}`, fileName);
};

export const onConfirm = async (bot: TelegramBot, msg: Message, credentials: string[]) => {
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

  const file = loadFile(credentials, fileName);
  if (!file) sendFileNotFoundError(bot, `${chatId}`, fileName);

  const hasConfirmed = checkMetadataKeyValue(file?.metadata || {}, "confirmed", `${telegramId}`);
  const countConfirmed = deepSearchFiles("confirmed", `${telegramId}`);
  const countConfirmedByMe = deepSearchFiles("confirmed", `${chatId}`);

  if (!hasConfirmed)
    if (countConfirmed >= countConfirmedByMe)
      return sendCantConfirmAMoreConfirmed(bot,  `${chatId}`, fileName, countConfirmed, countConfirmedByMe);

  let newFile = file || {} as FileContent;
  newFile.name = fileName;
  newFile.metadata = editMetadataKeyValue(newFile?.metadata || {}, "confirmed", `${telegramId}`);
  saveFile(newFile);
  let fileContentText = inexactMetadataMarkdown(newFile.metadata, newFile.markdown);
  await onUpdate(bot, fileName, fileContentText, credentials);
  const isConfirmed = checkMetadataKeyValue(newFile.metadata, "confirmed", `${telegramId}`);
  if (isConfirmed) sendIsConfirmed(bot,  `${chatId}`, telegramId, fileName);
  else sendIsUnconfirmed(bot,  `${chatId}`, telegramId, fileName);
};

export const onChange = async (bot: TelegramBot, msg: Message, credentials: string[]) => {
  const chatId = msg.chat.id;
  const fileName = (msg.text || "").split(" ").slice(1).join(" ");
  const file = loadFile(credentials, fileName);
  if (!file || file == null) {
    sendFileNotFoundError(bot,  `${chatId}`, fileName);
    return;
  }

  let fileContentText = inexactMetadataMarkdown(file.metadata, file.markdown);
  await bot.sendMessage( `${chatId}`, fileContentText);

  let hasConfirmed = checkMetadataKeyValue(file.metadata, "confirmed",  `${chatId}`);

  const minimumConfirmed = 3;
  const countConfirmed = deepSearchFiles("confirmed",  `${chatId}`);
  const hasMinimumConfirmed = countConfirmed >= minimumConfirmed;

  if (hasConfirmed || hasMinimumConfirmed) sendEditMenu(bot,  `${chatId}`, fileName);
  else sendConfirmedError(bot,  `${chatId}`, fileName);
};

export const onMessage = async (bot: TelegramBot, msg: Message, credentials: string[]) => {
  if (msg.reply_to_message) {
    if (!isEditMenu(msg.reply_to_message.text || "")) return;

    const chatId = msg.chat.id;
    const fileName = (msg.reply_to_message.text || "").match(/\[([^)]+)\]/)![1].replace(/\[|\]/g, "");

    const value = msg.text || "";
    let netFile = extractMetadataMarkdown(value);
    if (!netFile || netFile == null) sendFileNotFoundError(bot,  `${chatId}`, fileName);

    const file = loadFile(credentials, fileName);
    if (!file) return sendFileNotFoundError(bot,  `${chatId}`, fileName);
    let hasConfirmed = checkMetadataKeyValue(file?.metadata || {}, "confirmed",  `${chatId}`);

    if (!hasConfirmed) {
      sendConfirmedError(bot,  `${chatId}`, fileName);
      return;
    }

    let newFileContent: FileContent = {
      // ...file,
      name: fileName,
      metadata: netFile.metadata,
      markdown: netFile.markdown,
      category: file?.category || null,
      path: file?.path || null,
      date: file?.date || null,
    };

    let changes: Change[] = getChanges(file, newFileContent);

    await sendChangeInformation(bot,  `${chatId}`, changes);

    if (!file || file == null) return sendFileNotFoundError(bot,  `${chatId}`, fileName);

    sendConfirmedQuestion(bot,  `${chatId}`, fileName, netFile.content);
  }
};

export const onConfirmed = async (bot: TelegramBot, msg: Message, credentials: string[]) => {
  const chatId = msg.chat.id;
  const fileName = (msg.text || "")
    .split("\n")[0]
    .match(/\[([^)]+)\]/)![1]
    .replace(/\[|\]/g, "");
  const newContext = (msg.text || "").split("\n").slice(1).join("\n");
  const file = loadFile(credentials, fileName);
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
  file.name = fileName;
  saveFile(file);
  await onUpdate(bot, fileName, inexactMetadataMarkdown(file.metadata, file.markdown), credentials);
  sendEditMenu(bot,  `${chatId}`, fileName);
};

export const onCreate = async (bot: TelegramBot, msg: Message, credentials: string[]) => {
  const chatId = msg.chat.id;
  let _fileName = (msg.text || "").split(" ").slice(2).join(" ");
  const fileDate = (msg.text || "").split(" ").slice(-1)[0];
  const fileName = _fileName.replace(fileDate, "").trim();

  const minimumConfirmed = 1;
  const countConfirmed = deepSearchFiles("confirmed", `${msg.from?.id}`);
  if (countConfirmed < minimumConfirmed) return sendYouNeedAtLeast(bot,  `${chatId}`, minimumConfirmed);

  const file = loadFile(credentials, fileName);
  if (file) return sendFileAlreadyExists(bot,  `${chatId}`, fileName);

  let metadata = {
    mail: "",
    connections:  "",
    tags: [],
    connections: [],
    // confirmed: [msg.from.id],
    confirmed: [(msg.from?.id || "") as string] as string[],
  };

  let markdown = "\n42";
  let content = inexactMetadataMarkdown(metadata, markdown);
  let name = fileName;

  let fileContent: FileContent = {
    category: null,
    path: null,
    date: null,
    markdown,
    metadata,
    name
  };

  saveFile(fileContent); // Replace 'category' with the actual type
  await onUpdate(bot, fileName, content, credentials);
  sendFileCreated(bot,  `${chatId}`, fileName);
  await bot.sendMessage( `${chatId}`, content);
  sendEditMenu(bot,  `${chatId}`, fileName);
};

export const onCheck = async (bot: TelegramBot, msg: Message) => {
  const chatId = msg.chat.id;
  if (msg.from?.id == undefined) return;
  await sendTelegramId(bot,  `${chatId}`, `${msg.from.id}`);
  let confirmed = deepListAllFiles("confirmed", `${msg.from.id}`);
  await sendConfirmedFiles(bot,  `${chatId}`, confirmed);
};

// send all confirmed from "Singularity" a message of a new saved file
export const onUpdate = async (bot: TelegramBot, name: string, content: string, credentials: string[]) => {
  let rootFile = loadFile(credentials, "Singularity");
  let file = loadFile(credentials, name);

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
