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
} from "./file";
import { checkMetadataKeyValue, editMetadataKeyValue, inexactMetadataMarkdown } from "./metadata";
import { Change } from "@/types";
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
  const entityName = callbackQuery.message.text.match(/\[([^)]+)\]/)![1].replace(/\[|\]/g, "");
  const file = loadFile(entityName);
  if (!file || file == null) return sendFileNotFoundError(bot, `${chatId}`, entityName);
  const hasConfirmed = checkMetadataKeyValue(file.metadata, "confirmed", `${chatId}`);
  if (!hasConfirmed) {
    sendFileNotFoundError(bot, `${chatId}`, entityName);
    return;
  }
  deleteFile(entityName);
  await onUpdate(bot, entityName, "deleted");
  sendDeleteConfirmation(bot, `${chatId}`, entityName);
};

const onConfirm = async (bot: TelegramBot, msg: Message) => {
  if (!msg.text) return;
  if (!msg.chat) return;
  if (!msg.chat.id) return;
  if (!msg.from) return;
  if (!msg.from.id) return;

  const chatId = msg.chat.id;
  const entityName = msg.text.split(" ").slice(2).join(" ");

  const telegramId = msg.from.id;

  if (chatId == telegramId) {
    sendCantConfirmYourself(bot, `${chatId}`);
    return;
  }

  const file = loadFile(entityName);
  if (!file) sendFileNotFoundError(bot, `${chatId}`, entityName);

  const hasConfirmed = checkMetadataKeyValue(file.metadata, "confirmed", `${telegramId}`);
  const countConfirmed = deepSearchFiles("confirmed", `${telegramId}`).count;
  const countConfirmedByMe = deepSearchFiles("confirmed", `${chatId}`).count;

  if (!hasConfirmed)
    if (countConfirmed >= countConfirmedByMe)
      return sendCantConfirmAMoreConfirmed(bot,  `${chatId}`, entityName, countConfirmed, countConfirmedByMe);

  let newFile = { ...file };
  newFile.metadata = editMetadataKeyValue(newFile.metadata, "confirmed", `${telegramId}`);
  saveFile(entityName, newFile);
  await onUpdate(bot, entityName, newFile.content);
  const isConfirmed = checkMetadataKeyValue(newFile.metadata, "confirmed", `${telegramId}`);
  if (isConfirmed) sendIsConfirmed(bot,  `${chatId}`, telegramId, entityName);
  else sendIsUnconfirmed(bot,  `${chatId}`, telegramId, entityName);
};

const onChange = async (bot: TelegramBot, msg: Message) => {
  const chatId = msg.chat.id;
  const entityName = (msg.text || "").split(" ").slice(1).join(" ");
  const file = loadFile(entityName);
  if (!file || file == null) {
    sendFileNotFoundError(bot,  `${chatId}`, entityName);
    return;
  }
  await bot.sendMessage( `${chatId}`, file.content);

  let hasConfirmed = checkMetadataKeyValue(file.metadata, "confirmed",  `${chatId}`);

  const minimumConfirmed = 3;
  const countConfirmed = deepSearchFiles("confirmed",  `${chatId}`).count;
  const hasMinimumConfirmed = countConfirmed >= minimumConfirmed;

  if (hasConfirmed || hasMinimumConfirmed) sendEditMenu(bot,  `${chatId}`, entityName);
  else sendConfirmedError(bot,  `${chatId}`, entityName);
};

const onMessage = async (bot: TelegramBot, msg: Message) => {
  if (msg.reply_to_message) {
    if (!isEditMenu(msg.reply_to_message.text || "")) return;

    const chatId = msg.chat.id;
    const entityName = (msg.reply_to_message.text || "").match(/\[([^)]+)\]/)![1].replace(/\[|\]/g, "");

    const value = msg.text || "";
    let netFile = extractMetadataMarkdown(value);
    if (!netFile || netFile == null) sendFileNotFoundError(bot,  `${chatId}`, entityName);

    const file = loadFile(entityName);
    let hasConfirmed = checkMetadataKeyValue(file.metadata, "confirmed",  `${chatId}`);

    if (!hasConfirmed) {
      sendConfirmedError(bot,  `${chatId}`, entityName);
      return;
    }

    let hasNewFileMoreLines = netFile.markdown.split("\n").length > file.markdown.split("\n").length;
    let hasNewFileMoreMetadata = Object.keys(netFile.metadata).length > Object.keys(file.metadata).length;

    let changes: Change[] = [];

    (hasNewFileMoreMetadata ? Object.keys(netFile.metadata) : Object.keys(file.metadata)).forEach((key) => {
      if (netFile.metadata[key].toString() != file.metadata[key].toString()) {
        if (netFile.metadata[key] != undefined)
          changes.push({
            type: "metadata",
            key: key,
            value: netFile.metadata[key].toString(),
          } as Change);
      }
    });

    (hasNewFileMoreLines ? netFile.markdown.split("\n") : file.markdown.split("\n")).forEach((line, index) => {
      if (netFile.markdown.split("\n").includes(line) || file.markdown.split("\n").includes(line)) {
        if (netFile.markdown.split("\n")[index] != file.markdown.split("\n")[index]) {
          if (netFile.markdown.split("\n")[index] != undefined)
            changes.push({
              type: "metadata",
              key: index.toString(),
              value: netFile.markdown.split("\n")[index],
            } as Change);
        }
      }
    });

    await sendChangeInformation(bot,  `${chatId}`, changes);

    if (!file || file == null) return sendFileNotFoundError(bot,  `${chatId}`, entityName);

    sendConfirmedQuestion(bot,  `${chatId}`, entityName, netFile.content);
  }
};

const onConfirmed = async (bot: TelegramBot, msg: Message) => {
  const chatId = msg.chat.id;
  const entityName = (msg.text || "")
    .split("\n")[0]
    .match(/\[([^)]+)\]/)![1]
    .replace(/\[|\]/g, "");
  const newContext = (msg.text || "").split("\n").slice(1).join("\n");
  const file = loadFile(entityName);
  if (!file || file == null) return sendFileNotFoundError(bot,  `${chatId}`, entityName);

  let hasConfirmed = checkMetadataKeyValue(file.metadata, "confirmed",  `${chatId}`);
  if (!hasConfirmed) {
    sendConfirmedError(bot,  `${chatId}`, entityName);
    return;
  }

  let netFile = extractMetadataMarkdown(newContext);
  if (!netFile) sendFileNotFoundError(bot,  `${chatId}`, entityName);

  file.metadata = netFile.metadata;
  file.markdown = netFile.markdown;
  file.content = netFile.content;

  saveFile(entityName, file);
  await onUpdate(bot, entityName, file.content);
  sendEditMenu(bot,  `${chatId}`, entityName);
};

const onCreate = async (bot: TelegramBot, msg: Message) => {
  const chatId = msg.chat.id;
  let _entityName = (msg.text || "").split(" ").slice(2).join(" ");
  const entityDate = (msg.text || "").split(" ").slice(-1)[0];
  const entityName = _entityName.replace(entityDate, "").trim();

  const minimumConfirmed = 1;
  const countConfirmed = deepSearchFiles("confirmed", `${msg.from?.id}`).count;
  if (countConfirmed < minimumConfirmed) return sendYouNeedAtLeast(bot,  `${chatId}`, minimumConfirmed);

  const file = loadFile(entityName);
  if (file) return sendFileAlreadyExists(bot,  `${chatId}`, entityName);

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
  saveFile(entityName, { metadata, markdown, content }, entityDate, "entityType"); // Replace 'entityType' with the actual type
  await onUpdate(bot, entityName, content);
  sendFileCreated(bot,  `${chatId}`, entityName);
  await bot.sendMessage( `${chatId}`, content);
  sendEditMenu(bot,  `${chatId}`, entityName);
};

const onCheck = async (bot: TelegramBot, msg: Message) => {
  const chatId = msg.chat.id;
  if (msg.from?.id == undefined) return;
  await sendTelegramId(bot,  `${chatId}`, `${msg.from.id}`);
  let confirmed = deepListAllFiles("confirmed", `${msg.from.id}`).result;
  await sendConfirmedFiles(bot,  `${chatId}`, confirmed);
};

// send all confirmed from "Singularity" a message of a new saved file
const onUpdate = async (bot: TelegramBot, name: string, content: string) => {
  let rootEntity = "Singularity";
  let rootFile = loadFile(rootEntity);
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
