import { Change } from '@/app/types';
import { serializeMetadata } from './metadata';
import TelegramBot from "node-telegram-bot-api";

export const sendYouNeedAtLeast = async (bot: TelegramBot, chatId: string, minimumConfirmed: number): Promise<void> => {
    await bot.sendMessage(chatId, `${i18n.de.youNeedAtLeast}${minimumConfirmed}${i18n.de.confirmedToConfirm}`);
};

export const sendCantConfirmYourself = async (bot: TelegramBot, chatId: string): Promise<void> => {
    await bot.sendMessage(chatId, `${i18n.de.cantConfirmYourself}`);
};

export const sendFileNotFoundError = async (bot: TelegramBot, chatId: string, fileName: string): Promise<void> => {
    await bot.sendMessage(chatId, `${i18n.de.errorFileNotFound}${fileName}`);
};

export const sendConfirmedError = async (bot: TelegramBot, chatId: string, fileName: string): Promise<void> => {
    await bot.sendMessage(chatId, `${i18n.de.errorConfirmed}${fileName}`);
};

export const sendEditMenu = async (bot: TelegramBot, chatId: string, fileName: string): Promise<void> => {
    const deleteButtonOptions = {
        reply_markup: JSON.stringify(
            {
                inline_keyboard: [
                    [
                        {
                            text: i18n.de.delete,
                            callback_data: 'delete',
                        },
                    ],
                ],
            }
        ),
    } as any;

    await bot.sendMessage(chatId, `${i18n.de.editMenu} [${fileName}]\n${i18n.de.editMenuOptions}`, deleteButtonOptions);
};

export const isEditMenu = (text: string): boolean => {
    return text.includes(i18n.de.editMenu);
};

export const sendMetadata = async (bot: TelegramBot, chatId: string, metadata: any): Promise<void> => {
    await bot.sendMessage(chatId, `${i18n.de.displayMetadata} ${serializeMetadata(metadata)}`, { parse_mode: 'Markdown' });
};

export const sendChange = async (bot: TelegramBot, chatId: string, key: string): Promise<void> => {
    await bot.sendMessage(chatId, `${i18n.de.changeQuestion} [${key}]`);
};

export const sendChangeInformation = async (bot: TelegramBot, chatId: string, changes: Change[]): Promise<void> => {
    if (changes.length == 0) {
        await bot.sendMessage(chatId, i18n.de.noChanges);
        return;
    }
    for (let change of changes) {
        await bot.sendMessage(chatId, `${i18n.de.changes}: ${change.type} ${change.key} ${change.post}`);
    }
};

export const sendConfirmedQuestion = async (bot: TelegramBot, chatId: string, fileName: string, newContext: string): Promise<void> => {
    const options = {
        reply_markup: JSON.stringify(
            {
                inline_keyboard: [
                    [
                        {
                            text: i18n.de.confirm,
                            callback_data: 'confirm',
                        },
                    ],
                ],
            }
        ),
    } as any;

    await bot.sendMessage(chatId, `${i18n.de.sureWantToEdit}[${fileName}]?\n\n${newContext}`, options);
};

export const sendCreateMenu = async (bot: TelegramBot, chatId: string, fileName: string): Promise<void> => {
    const options = {
        reply_markup: JSON.stringify(
            {
                inline_keyboard: [
                    [
                        {
                            text: 'Creative',
                            callback_data: 'create creative',
                        },
                        {
                            text: 'Concept',
                            callback_data: 'create concept',
                        },
                        {
                            text: 'Collective',
                            callback_data: 'create collective',
                        },
                        {
                            text: 'Collaboration',
                            callback_data: 'create collaboration',
                        },
                    ],
                ],
            }
        ),
    } as any; 

    await bot.sendMessage(chatId, `${i18n.de.whatTypeOfEntity}[${fileName}]?`, options);
};

export const sendIsConfirmed = async (bot: TelegramBot, chatId: string, count: number, element: string): Promise<void> => {
    await bot.sendMessage(chatId, `${count} ${i18n.de.hasBeenConfirmed}${element}`);
};

export const sendIsUnconfirmed = async (bot: TelegramBot, chatId: string, count: number, element: string): Promise<void> => {
    await bot.sendMessage(chatId, `${count} ${i18n.de.hasBeenUnconfirmed}${element}`);
};

export const sendTelegramId = async (bot: TelegramBot, chatId: string, telegramId: string): Promise<void> => {
    await bot.sendMessage(chatId, `${i18n.de.yourId}${telegramId}`);
};

export const sendFileAlreadyExists = async (bot: TelegramBot, chatId: string, fileName: string): Promise<void> => {
    await bot.sendMessage(chatId, `${i18n.de.fileAlreadyExists}${fileName}`);
};

export const sendFileCreated = async (bot: TelegramBot, chatId: string, fileName: string): Promise<void> => {
    await bot.sendMessage(chatId, `${i18n.de.fileCreated}${fileName}`);
};

export const sendCantConfirmAMoreConfirmed = async (bot: TelegramBot, chatId: string, fileName: string, moreConfirmed: number, ownConfirmed: number): Promise<void> => {
    await bot.sendMessage(chatId, `${i18n.de.cantConfirmAMoreConfirmed}${fileName} ${moreConfirmed} >= ${ownConfirmed}`);
};

export const sendHelp = async (bot: TelegramBot, message: TelegramBot.Message): Promise<void> => {
    const chatId = message.chat.id;
    await bot.sendMessage(chatId, ` ${i18n.de.help}`);
};

export const sendConfirmedFiles = async (bot: TelegramBot, chatId: string, files: string[]): Promise<void> => {
    let string = i18n.de.confirmedFiles;
    for (let file of files) {
        string += `${file}\n`;
    }
    if (files.length == 0) {
        string += i18n.de.noFiles;
    }
    await bot.sendMessage(chatId, string);
};

export const sendDeleteConfirmation = async (bot: TelegramBot, chatId: string, fileName: string): Promise<void> => {
    await bot.sendMessage(chatId, `${fileName}${i18n.de.hasBeenDeleted}`);
};

export const sendUpdate = async (bot: TelegramBot, chatId: string, fileName: string, changes: string ) => {
  await bot.sendMessage(chatId, `${fileName}${i18n.de.hasBeenUpdated}${changes}`);
};

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
