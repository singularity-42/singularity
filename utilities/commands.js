const { load, extract, save, deepSearch, deepList, intract, deepListFiles } = require("./file");
const { check, edit } = require("./metadata");
const { sendFileNotFoundError, sendEditMenu, sendConfirmedError, sendChangeInformation, sendConfirmedQuestion, isEditMenu, sendCreateMenu, sendCantConfirmYourself, sendIsConfirmed, sendIsUnconfirmed, sendTelegramId, sendFileAlreadyExists, sendYouNeedAtLeast, sendFileCreated, sendConfirmedFiles, sendCantConfirmAMoreConfirmed, sendDeleteConfirmation, sendUpdate } = require("./messages");

const onCallbackQuery = async (bot, callbackQuery) => {
    switch (callbackQuery.data) {
        case 'confirm':
            await onConfirmed(bot, callbackQuery.message);
            break;
        case 'delete':
            await onDelete(bot, callbackQuery);
            break;
    }

    bot.answerCallbackQuery(callbackQuery.id);
}

const onDelete = async (bot, callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const entityName = callbackQuery.message.text.match(/\[([^)]+)\]/)[1].replace(/\[|\]/g, '');
    const file = load(entityName);
    if (!file || file == null) return sendFileNotFoundError(bot, chatId, entityName);
    let hasConfirmed = check(file.metadata, 'confirmed', chatId);
    if (!hasConfirmed) {
        sendConfirmedError(bot, chatId, entityName);
        return;
    }
    save(entityName, null);
    await onUpdate(bot, entityName, 'deleted');
    sendDeleteConfirmation(bot, chatId, entityName);
}


const onConfirm = async (bot, msg, match) => {
    const chatId = msg.chat.id;
    // const entityName = match[2]; // /confirm 0 Etwas im AJZ
    // entityName is rest of the message
    const entityName = msg.text.split(' ').slice(2).join(' ');

    const telegramId = match[1];

    if (entityName == telegramId) {
        await bot.sendMessage(chatId, sendCantConfirmYourself(bot, chatId));
        return;
    }

    const file = load(entityName);
    if (!file) sendFileNotFoundError(bot, chatId, entityName);
    
    const hasConfirmed = check(file.metadata, 'confirmed', telegramId);
    const countConfirmed = deepSearch('confirmed', telegramId);
    const countConfirmedByMe = deepSearch('confirmed', chatId);
    // todo: calculate... relation depth for confirmations can be max of 3

    // its not possible to confirm someone who has more confirmations than you
    if (!hasConfirmed)
        if (countConfirmed >= countConfirmedByMe) return sendCantConfirmAMoreConfirmed(bot, chatId, entityName, countConfirmed, countConfirmedByMe);
    
    let newFile = { ...file };
    newFile.metadata = edit(file.metadata, 'confirmed', telegramId);
    save(entityName, newFile);
    await onUpdate(bot, entityName, newFile.content);
    const isConfirmed = check(newFile.metadata, 'confirmed', telegramId);
    if (isConfirmed) sendIsConfirmed(bot, chatId, telegramId, entityName);
    else sendIsUnconfirmed(bot, chatId, telegramId, entityName);
}

const onChange = async (bot, msg, match) => {
    const chatId = msg.chat.id;
    const entityName = match[1];
    const file = load(entityName);
    if (!file || file == null) {
        sendFileNotFoundError(bot, chatId, entityName);
        return;
    }
    await bot.sendMessage(chatId, file.content);

    let hasConfirmed = check(file.metadata, 'confirmed', chatId);

    // todo chan change related to confirmations

    //while look if user has 3 confirmations
    const minimumConfirmed = 3;
    const countConfirmed = deepSearch('confirmed', chatId);
    const hasMinimumConfirmed = countConfirmed >= minimumConfirmed;

    if (hasConfirmed || hasMinimumConfirmed) sendEditMenu(bot, chatId, entityName);
    else sendConfirmedError(bot, chatId, entityName);
}

const onMessage = async (bot, msg) => {
    if (msg.reply_to_message) {
        if (!isEditMenu(msg.reply_to_message.text)) return;

        const chatId = msg.chat.id;
        const entityName = msg.reply_to_message.text.match(/\[([^)]+)\]/)[1].replace(/\[|\]/g, '');
        
        const value = msg.text;
        const file = load(entityName);
        if (!file || file == null) sendFileNotFoundError(bot, chatId, entityName);

        let netFile = extract(value);
        if (!netFile || netFile == null) sendFileNotFoundError(bot, chatId, entityName);

        let hasConfirmed = check(file.metadata, 'confirmed', chatId);
        
        if(!hasConfirmed) {
            sendConfirmedError(bot, chatId, entityName);
            return;
        }

        let hasNewFileMoreLines = netFile.markdown.split('\n').length > file.markdown.split('\n').length;
        let hasNewFileMoreMetadata = Object.keys(netFile.metadata).length > Object.keys(file.metadata).length;

        class Change {
            constructor(type, key, value) {
                this.type = type;
                this.key = key;
                this.value = value;
            }
        }

        let changes = [];

        (hasNewFileMoreMetadata ? Object.keys(netFile.metadata) : Object.keys(file.metadata)).forEach(key => {
            if (netFile.metadata[key].toString() != file.metadata[key].toString()) {
                if (netFile.metadata[key] != undefined) changes.push(new Change('metadata', key, netFile.metadata[key]));
            }
        });

        (hasNewFileMoreLines ? netFile.markdown.split('\n') : file.markdown.split('\n')).forEach((line, index) => {
            if (netFile.markdown.split('\n').includes(line) || file.markdown.split('\n').includes(line)) {
                if (netFile.markdown.split('\n')[index] != file.markdown.split('\n')[index]) {
                    if (netFile.markdown.split('\n')[index] != undefined) changes.push(new Change('line', index, netFile.markdown.split('\n')[index]));
                }
            }
        });

        await sendChangeInformation(bot, chatId, changes);

        if (!file || file == null)  return sendFileNotFoundError(bot, chatId, entityName);

        sendConfirmedQuestion(bot, chatId, entityName, netFile.content);
    }
}

const onConfirmed = async (bot, msg) => {
    const chatId = msg.chat.id;
    const entityName = msg.text.split('\n')[0].match(/\[([^)]+)\]/)[1].replace(/\[|\]/g, '');
    const newContext = msg.text.split('\n').slice(1).join('\n');
    const file = load(entityName);
    if (!file || file == null)  return sendFileNotFoundError(bot, chatId, entityName);

    let hasConfirmed = check(file.metadata, 'confirmed', chatId);
    if (!hasConfirmed) {
        sendConfirmedError(bot, chatId, entityName);
        return;
    }

    let netFile = extract(newContext);
    if (!netFile) sendFileNotFoundError(bot, chatId, entityName);

    file.metadata = netFile.metadata;
    file.markdown = netFile.markdown;
    file.content = netFile.content;

    save(entityName, file);
    await onUpdate(bot, entityName, file.content);
    sendEditMenu(bot, chatId, entityName);
}

const onCreate = async (bot, msg, match) => {
    const chatId = msg.chat.id;
    let _entityName = msg.text.split(' ').slice(2).join(' ');
    const entityDate = msg.text.split(' ').slice(-1)[0];
    const entityName = _entityName.replace(entityDate, '').trim();

    const entityType = match[1];
    const telegramId = msg.from.id;

    const minimumConfirmed = 1;
    const countConfirmed = deepSearch('confirmed', telegramId);
    if (countConfirmed < minimumConfirmed) return sendYouNeedAtLeast(bot, chatId, minimumConfirmed);
    // todo: need select relation 3 depth away

    const file = load(entityName);
    if (file) return sendFileAlreadyExists(bot, chatId, entityName);

    let metadata = {
        mail: '',
        location: '',
        tags: [],
        connections: [],
        confirmed: [telegramId]
    };

    let markdown = '\n42';
    let content = intract(metadata, markdown);
    save(entityName, { metadata, markdown, content }, entityDate, entityType);
    await onUpdate(bot, entityName, content);
    sendFileCreated(bot, chatId, entityName);
    await bot.sendMessage(chatId, content);
    sendEditMenu(bot, chatId, entityName);
}

const onCheck = async (bot, msg, match) => {
    const chatId = msg.chat.id;
    await sendTelegramId(bot, chatId, msg.from.id);
    let confirmed = deepListFiles('confirmed', msg.from.id);
    await sendConfirmedFiles(bot, chatId, confirmed);
}


// send all confirmed form "Singularity" a message of new saved file
const onUpdate = async (bot, name, content) => {
    let rootEntity = "Singularity";
    let rootFile = load(rootEntity);
    if (!rootFile) return;

    // get all confirmed from rootEntity
    let rootConfirmed = rootFile.metadata.confirmed;
    if (!rootConfirmed) return;
    rootConfirmed.forEach(telegramId => {
        sendUpdate(bot, telegramId, name, content);
    });

    // and now load all confirmed from name and send them a message
    let file = load(name);
    if (!file) return;
    let confirmed = file.metadata.confirmed;
    if (!confirmed) return;
    confirmed.forEach(telegramId => {
        if (!rootConfirmed.includes(telegramId))
            sendUpdate(bot, telegramId, name, content);
    });
}

module.exports = { onUpdate, onCheck, onCreate, onConfirm, onChange, onCallbackQuery, onMessage};
