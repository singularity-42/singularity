// import { serializeMetadata as e } from "./metadata.compressed"; 
const { serializeMetadata: e } = require('./metadata.compressed');
const sendYouNeedAtLeast = async (e, n, t) => { await e.sendMessage(n, `${i18n.de.youNeedAtLeast}${t}${i18n.de.confirmedToConfirm}`) };
const sendCantConfirmYourself = async (e, n) => { await e.sendMessage(n, `${i18n.de.cantConfirmYourself}`) };
const sendFileNotFoundError = async (e, n, t) => { await e.sendMessage(n, `${i18n.de.errorFileNotFound}${t}`) };
const sendConfirmedError = async (e, n, t) => { await e.sendMessage(n, `${i18n.de.errorConfirmed}${t}`) };
const sendEditMenu = async (e, n, t) => {
    let a = { reply_markup: JSON.stringify({ inline_keyboard: [[{ text: i18n.de.delete, callback_data: "delete" }]] }) }; await e.sendMessage(n, `${i18n.de.editMenu} [${t}]
${i18n.de.editMenuOptions}`, a)
};
const isEditMenu = e => e.includes(i18n.de.editMenu);
const sendMetadata = async (n, t, a) => { await n.sendMessage(t, `${i18n.de.displayMetadata} ${e(a)}`, { parse_mode: "Markdown" }) };
const sendChange = async (e, n, t) => { await e.sendMessage(n, `${i18n.de.changeQuestion} [${t}]`) };
const sendChangeInformation = async (e, n, t) => { if (0 == t.length) { await e.sendMessage(n, i18n.de.noChanges); return } for (let a of t) await e.sendMessage(n, `${i18n.de.changes}: ${a.type} ${a.key} ${a.post}`) };
const sendConfirmedQuestion = async (e, n, t, a) => {
    let i = { reply_markup: JSON.stringify({ inline_keyboard: [[{ text: i18n.de.confirm, callback_data: "confirm" }]] }) }; await e.sendMessage(n, `${i18n.de.sureWantToEdit}[${t}]?

${a}`, i)
};
const sendCreateMenu = async (e, n, t) => { let a = { reply_markup: JSON.stringify({ inline_keyboard: [[{ text: "Creative", callback_data: "create creative" }, { text: "Concept", callback_data: "create concept" }, { text: "Collective", callback_data: "create collective" }, { text: "Collaboration", callback_data: "create collaboration" }]] }) }; await e.sendMessage(n, `${i18n.de.whatTypeOfEntity}[${t}]?`, a) };
const sendIsConfirmed = async (e, n, t, a) => { await e.sendMessage(n, `${t} ${i18n.de.hasBeenConfirmed}${a}`) };
const sendIsUnconfirmed = async (e, n, t, a) => { await e.sendMessage(n, `${t} ${i18n.de.hasBeenUnconfirmed}${a}`) };
const sendTelegramId = async (e, n, t) => { await e.sendMessage(n, `${i18n.de.yourId}${t}`) };
const sendFileAlreadyExists = async (e, n, t) => { await e.sendMessage(n, `${i18n.de.fileAlreadyExists}${t}`) };
const sendFileCreated = async (e, n, t) => { await e.sendMessage(n, `${i18n.de.fileCreated}${t}`) };
const sendCantConfirmAMoreConfirmed = async (e, n, t, a, i) => { await e.sendMessage(n, `${i18n.de.cantConfirmAMoreConfirmed}${t} ${a} >= ${i}`) };
const sendHelp = async (e, n) => { let t = n.chat.id; await e.sendMessage(t, ` ${i18n.de.help}`) };
const sendConfirmedFiles = async (e, n, t) => {
    let a = i18n.de.confirmedFiles; for (let i of t) a += `${i}`;
    0 == t.length && (a += i18n.de.noFiles), await e.sendMessage(n, a)
};

const sendDeleteConfirmation = async (e, n, t) => { await e.sendMessage(n, `${t}${i18n.de.hasBeenDeleted}`) };

const sendUpdate = async (e, n, t, a) => { await e.sendMessage(n, `${t}${i18n.de.hasBeenUpdated}${a}`) };

module.exports = {
    sendYouNeedAtLeast,
    sendCantConfirmAMoreConfirmed,
    sendCantConfirmYourself,
    sendChange,
    sendUpdate,
    sendDeleteConfirmation,
    sendFileNotFoundError,
    sendConfirmedError,
    sendEditMenu,
    isEditMenu,
    sendMetadata,
    sendChangeInformation,
    sendConfirmedQuestion,
    sendCreateMenu,
    sendIsConfirmed,
    sendIsUnconfirmed,
    sendTelegramId,
    sendFileAlreadyExists,
    sendFileCreated,
    sendCantConfirmAMoreConfirmed,
    sendHelp,
    sendConfirmedFiles
}

const i18n = {
    en: {
        hasBeenUpdated: ' has been updated!',
        hasBeenDeleted: ' has been deleted.',
        delete: 'Delete',
        help: 'Welcome to Singularity Bot! 😎\n\n/create [file] [name] (date) - Create an file like "creative," "concept," "collective," or "collaboration" (date only for collaborations).\n/confirm [telegramId] [name] - Confirm a user to edit an file.\n/change [name] - Edit an file.\n/check - Check your confirmed files and get your Telegram ID.\n/contact [message] - Send a message to the Singularity group.',
        whatTypeOfEntity: 'What type of file is ',
        changes: 'Changes:',
        noChanges: 'No changes made!',
        noFiles: 'No files found.',
        sureWantToEdit: 'Are you sure you want to edit ',
        cantConfirmAMoreConfirmed: "Oops! You can't confirm ",
        confirmedFiles: 'Confirmed Files:\n',
        displayMetadata: 'Metadata\n____________________\n',

        editMenu: 'Copy the Markdown content (above) of ',
        editMenuOptions: 'and reply to this message with the new content.',

        editName: 'Edit Name',
        editContent: 'Edit Content',
        editImage: 'Edit Image',

        errorFileNotFound: 'Uh-oh! File not found: ',
        errorConfirmed: 'You are not confirmed to edit ',

        changeQuestion: 'Reply to make changes',

        confirm: 'Confirm',
        cantConfirmYourself: "Sorry, you can't confirm yourself.",

        youNeedAtLeast: 'You need at least ',
        confirmedToConfirm: ' confirmed files to confirm another user.',
        hasBeenConfirmed: ' has been confirmed for ',
        hasBeenUnconfirmed: ' has been unconfirmed for ',
        yourId: 'Your Telegram ID is ',
        fileAlreadyExists: 'Oops! File already exists: ',
        fileCreated: 'Yay! File has been created: ',
    },
    de: {
        hasBeenUpdated: ' wurde aktualisiert!',
        hasBeenDeleted: ' wurde gelöscht.',
        delete: 'Löschen',
        help: 'Willkommen beim Singularity Bot! 😎\n\n/create [file] [name] (date) - Erstelle eine Entität wie "creative," "concept," "collective," oder "collaboration" (date nur für collaborations).\n/confirm [telegramId] [name] - Bestätige einen Benutzer, um eine Entität zu bearbeiten.\n/change [name] - Bearbeite eine Entität.\n/check - Überprüfe deine bestätigten Entitäten und erhalte deine Telegramm-ID.\n/contact [message] - Sende eine Nachricht an die Singularity-Gruppe.',
        alias: '\nAlias: \n /create creative = /crea \n /create concept = /con \n /create collective = /cole \n /create collaboration = /cola',
        whatTypeOfEntity: 'Was für eine Art von Entität ist ',
        changes: 'Änderungen:',
        noChanges: 'Keine Änderungen vorgenommen!',
        noFiles: 'Keine Dateien gefunden.',
        sureWantToEdit: 'Bist du sicher, dass du ',
        cantConfirmAMoreConfirmed: 'Oops! Du kannst ',
        confirmedFiles: 'Bestätigte Dateien:\n',
        displayMetadata: 'Metadaten\n____________________\n',

        editMenu: 'Kopiere den Markdown-Inhalt (oben) von ',
        editMenuOptions: 'und antworte auf diese Nachricht mit dem neuen Inhalt.',

        editName: 'Name bearbeiten',
        editContent: 'Inhalt bearbeiten',
        editImage: 'Bild bearbeiten',

        errorFileNotFound: 'Uh-oh! Datei nicht gefunden: ',
        errorConfirmed: 'Du bist nicht bestätigt, um zu bearbeiten ',

        changeQuestion: 'Antworte, um Änderungen vorzunehmen',

        confirm: 'Bestätigen',
        cantConfirmYourself: 'Entschuldigung, du kannst dich nicht selbst bestätigen.',

        youNeedAtLeast: 'Du brauchst mindestens ',
        confirmedToConfirm: ' bestätigte Entitäten, um einen anderen Benutzer zu bestätigen.',
        hasBeenConfirmed: ' wurde bestätigt für ',
        hasBeenUnconfirmed: ' wurde unbestätigt für ',
        yourId: 'Deine Telegramm-ID ist ',
        fileAlreadyExists: 'Oops! Datei existiert bereits: ',
        fileCreated: 'Juhu! Datei wurde erstellt: ',
    }
}
