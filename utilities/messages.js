const { serialize } = require("./metadata");

const sendYouNeedAtLeast = async (bot, chatId, minimumConfirmed) => {
    await bot.sendMessage(chatId, `${i18n.de.youNeedAtLeast}${minimumConfirmed}${i18n.de.confirmedToConfirm}`);
}

const sendCantConfirmYourself = async (bot, chatId) => {
    await bot.sendMessage(chatId, `${i18n.de.cantConfirmYourself}`);
}

const sendFileNotFoundError = async (bot, chatId, entityName) => {
    await bot.sendMessage(chatId, `${i18n.de.errorFileNotFound}${entityName}`);
}

const sendConfirmedError = async (bot, chatId, entityName) => {
    await bot.sendMessage(chatId, `${i18n.de.errorConfirmed}${entityName}`);
}

const sendEditMenu = async (bot, chatId, entityName) => {
    const deleteButtonOptions = {
        reply_markup: JSON.stringify(
            {
                inline_keyboard: [
                    [
                        {
                            text: i18n.de.delete,
                            callback_data: 'delete'
                        }
                    ]
                ]
            }
        )
    };

    await bot.sendMessage(chatId, `${i18n.de.editMenu} [${entityName}]\n${i18n.de.editMenuOptions}`, deleteButtonOptions);
}

const isEditMenu = (text) => {
    return text.includes(i18n.de.editMenu);
}

const sendMetadata = async (bot, chatId, metadata) => {
    await bot.sendMessage(chatId, `${i18n.de.displayMetadata} ${serialize(metadata)}`, { parse_mode: 'Markdown' });
}

const sendChange = async (bot, chatId, key) => {
    await bot.sendMessage(chatId, `${i18n.de.changeQuestion} [${key}]`);
}

const sendChangeInformation = async (bot, chatId, changes) => {
    if (changes.length == 0) {
        await bot.sendMessage(chatId, i18n.de.noChanges);
        return;
    }
    for (let change of changes) {
        await bot.sendMessage(chatId, `${i18n.de.changes}: ${change.type} ${change.key} ${change.value}`);
    }
}

const sendConfirmedQuestion = async (bot, chatId, entityName, newContext) => {
    const options = {
        reply_markup: JSON.stringify(
            {
                inline_keyboard: [
                    [
                        {
                            text: i18n.de.confirm,
                            callback_data: 'confirm'
                        }
                    ]
                ]
            }
        )
    };

    await bot.sendMessage(chatId, `${i18n.de.sureWantToEdit}[${entityName}]?\n\n${newContext}`, options);
}

const sendCreateMenu = async (bot, chatId, entityName) => {
    const options = {
        reply_markup: JSON.stringify(
            {
                inline_keyboard: [
                    [
                        {
                            text: 'Creative',
                            callback_data: 'create creative'
                        },
                        {
                            text: 'Concept',
                            callback_data: 'create concept'
                        },
                        {
                            text: 'Collective',
                            callback_data: 'create collective'
                        },
                        {
                            text: 'Collaboration',
                            callback_data: 'create collaboration'
                        }
                    ]
                ]
            }
        )
    };

    await bot.sendMessage(chatId, `${i18n.de.whatTypeOfEntity}[${entityName}]?`, options);
}

const sendIsConfirmed = async (bot, chatId, count, element) => {
    await bot.sendMessage(chatId, `${count} ${i18n.de.hasBeenConfirmed}${element}`);
}

const sendIsUnconfirmed = async (bot, chatId, count, element) => {
    await bot.sendMessage(chatId, `${count} ${i18n.de.hasBeenUnconfirmed}${element}`);
}

const sendTelegramId = async (bot, chatId, telegramId) => {
    await bot.sendMessage(chatId, `${i18n.de.yourId}${telegramId}`);
}

const sendFileAlreadyExists = async (bot, chatId, entityName) => {
    await bot.sendMessage(chatId, `${i18n.de.fileAlreadyExists}${entityName}`);
}

const sendFileCreated = async (bot, chatId, entityName) => {
    await bot.sendMessage(chatId, `${i18n.de.fileCreated}${entityName}`);
}

const sendCantConfirmAMoreConfirmed = async (bot, chatId, entityName, moreConfirmed, ownConfirmed) => {
    await bot.sendMessage(chatId, `${i18n.de.cantConfirmAMoreConfirmed}${entityName} ${moreConfirmed} >= ${ownConfirmed}`);
}

const sendHelp = async (bot, chatId) => {
/*
    Community Communication Bot

    Decentralized Network of Creative Entities. 

    /create [entity] [name] (date) - create an entity, either "creative", "concept", "collective" or "collaboration"  (date is only for collaborations)
    /confirm [telegramId] [name] - confirm a user to edit an entity
    /change [name] - edit an entity
    /check - check your confirmed entities and gets your telegram id
*/
    await bot.sendMessage(chatId, i18n.de.help);
}

const sendConfirmedFiles = async (bot, chatId, files) => {
    let string = i18n.de.confirmedFiles;
    for (let file of files) {
        string += `${file}\n`
    }
    if (files.length == 0) {
        string += i18n.de.noFiles;
    }
    await bot.sendMessage(chatId, string);
}

const sendDeleteConfirmation = async (bot, chatId, entityName) => {
    await bot.sendMessage(chatId, `${entityName}${i18n.de.hasBeenDeleted}`);
}


const i18n = {
    en: {
        hasBeenDeleted: ' has been deleted',
        delete: 'Delete',
        help: 'Singularity Bot\nhttps://singularity.2n40.eu/\n\n/create [entity] [name] (date) - create an entity, either "creative", "concept", "collective" or "collaboration"  (date is only for collaborations)\n/confirm [telegramId] [name] - confirm a user to edit an entity\n/change [name] - edit an entity\n/check - check your confirmed entities and gets your telegram id',
        whatTypeOfEntity: 'What type of entity is ',
        changes: 'Changes:',
        noChanges: 'No changes',
        noFiles: 'No files',
        sureWantToEdit: 'Are you sure you want to edit ',
        cantConfirmAMoreConfirmed: 'You can\'t confirm ',
        confirmedFiles: 'Confirmed files:\n',
        displayMetadata: 'Metadata\n____________________\n',

        editMenu: 'Copy the Markdown content (above) of ',
        editMenuOptions: 'and reply to this message with the new content.',

        editName: 'Edit Name',
        editContent: 'Edit Content',
        editImage: 'Edit Image',

        errorFileNotFound: 'File not found: ',
        errorConfirmed: 'You are not confirmed to edit ',

        changeQuestion: 'Reply to change',

        confirm: 'Confirm',
        cantConfirmYourself: 'You can\'t confirm yourself',

        youNeedAtLeast: 'You need at least ',
        confirmedToConfirm: ' confirmed to confirm a user.',
        hasBeenConfirmed: ' has been confirmed for ',
        hasBeenUnconfirmed: ' has been unconfirmed for ',
        yourId: 'Your Telegram ID is ',
        fileAlreadyExists: 'File already exists: ',
        fileCreated: 'File has been created: ',
    },
    de: {
        hasBeenDeleted: ' wurde gelöscht',
        delete: 'Löschen',
        help: 'Singularity Bot\nhttps://singularity.2n40.eu/\n\n/create [entity] [name] (date) - erstelle eine Entität, entweder "creative", "concept", "collective" oder "collaboration"  (date ist nur für collaborations)\n/confirm [telegramId] [name] - bestätige einen Benutzer, um eine Entität zu bearbeiten\n/change [name] - bearbeite eine Entität\n/check - überprüfe deine bestätigten Entitäten und erhalte deine Telegramm-ID',
        whatTypeOfEntity: 'Was für eine Art von Entität ist ',
        changes: 'Änderungen:',
        noChanges: 'Keine Änderungen',
        noFiles: 'Keine Dateien',
        sureWantToEdit: 'Bist du sicher, dass du ',
        cantConfirmAMoreConfirmed: 'Du kannst nicht bestätigen ',
        confirmedFiles: 'Bestätigte Dateien:\n',
        displayMetadata: 'Metadaten\n____________________\n',

        editMenu: 'Kopiere den Markdown-Inhalt (oben) von ',
        editMenuOptions: 'und antworte auf diese Nachricht mit dem neuen Inhalt.',

        editName: 'Name bearbeiten',
        editContent: 'Inhalt bearbeiten',
        editImage: 'Bild bearbeiten',

        errorFileNotFound: 'Datei nicht gefunden: ',
        errorConfirmed: 'Du bist nicht bestätigt, um zu bearbeiten ',

        changeQuestion: 'Antworte auf Änderung',

        confirm: 'Bestätigen',
        cantConfirmYourself: 'Du kannst dich nicht selbst bestätigen',

        youNeedAtLeast: 'Du brauchst mindestens ',
        confirmedToConfirm: ' bestätigt, um einen Benutzer zu bestätigen.',
        hasBeenConfirmed: ' wurde bestätigt für ',
        hasBeenUnconfirmed: ' wurde unbestätigt für ',
        yourId: 'Deine Telegramm-ID ist ',
        fileAlreadyExists: 'Datei existiert bereits: ',
        fileCreated: 'Datei wurde erstellt: ',
    }
}

module.exports = {
    sendCantConfirmAMoreConfirmed,
    sendHelp,
    sendConfirmedFiles,
    sendDeleteConfirmation,
    sendCreateMenu,
    sendFileNotFoundError,
    sendConfirmedError,
    sendCantConfirmYourself,
    sendConfirmedQuestion,
    sendEditMenu,
    sendMetadata,
    sendChange,
    sendChangeInformation,
    isEditMenu,
    sendYouNeedAtLeast,
    sendTelegramId,
    sendIsConfirmed,
    sendIsUnconfirmed,
    sendFileAlreadyExists,
    sendFileCreated
}
