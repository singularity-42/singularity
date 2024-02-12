// metadata.ts
import { ExtractResult, InexactResult, Metadata } from "@/types";

const displayMetadata = (metadata: Metadata): string => {
  let metadataString = '';
  for (let key in metadata) {
      metadataString += `**${key}:** ${metadata[key]}\n`;
  }
  return metadataString;
};

const deserializeMetadata = (metadataString: string): Metadata => {
  const metadataLines = metadataString.split('\n').filter(line => line.trim() !== '');

  let metadata: Metadata = {};

  for (let line of metadataLines) {
      const [key, ...values] = line.split(':').map(item => item.trim());
      metadata[key] = values.join(':').trim();
  }

  let lastKey = '';
  for (let key in metadata) {
      let hasListSyntax = key.includes(' ') && key.includes('-');
      let hasEmptyValue = metadata[key] === '';

      if (hasListSyntax && hasEmptyValue) {
          if (!metadata[lastKey] || !Array.isArray(metadata[lastKey])) {
              metadata[lastKey] = [];
          }
          (metadata[lastKey] as string[]).push(key.replace(/ /g, '').replace(/-/g, '').replace(/\"/g, ''));
          delete metadata[key];
      } else {
          lastKey = key;
      }
  }

  return metadata;
};

const serializeMetadata = (metadata: Metadata): string => {
  let metadataString = '';
  for (let key in metadata) {
      if (Array.isArray(metadata[key])) {
          metadataString += `${key}:\n`;
          (metadata[key] as string[]).forEach(value => {
              metadataString += `  - ${!isNaN(Number(value)) ? `"${value}"` : value}\n`;
          });
      } else {
          metadataString += `${key}: ${metadata[key]}\n`;
      }
  }
  return metadataString;
};

const editMetadataKeyValue = (metadata: Metadata, key: string, value: string): Metadata => {
  let newMetadata: Metadata = { ...metadata };
  if (Array.isArray(newMetadata[key])) {
      if ((newMetadata[key] as string[]).map(item => item.toString()).includes(value.toString())) {
          newMetadata[key] = (newMetadata[key] as string[]).filter(item => item.toString() !== value.toString());
      } else {
          (newMetadata[key] as string[]).push(value);
      }
  } else if (key == 'confirmed') {
      newMetadata[key] = [value];
  } else {
      newMetadata[key] = value;
  }
  return newMetadata;
};

const checkMetadataKeyValue = (metadata: Metadata, key: string, value: string): boolean => {
  if (!metadata) return false;
  if (!metadata[key]) return false;
  if (Array.isArray(metadata[key])) {
      return (metadata[key] as string[]).filter(item => item.toString() === value.toString()).length > 0;
  }
  return metadata[key] === value;
};

const removeMetadataKeyValue = (metadata: Metadata, key: string, value: string | null = null): Metadata => {
  if (Array.isArray(metadata[key])) {
      if (value) {
          metadata[key] = (metadata[key] as string[]).filter(item => item !== value);
      } else {
          delete metadata[key];
      }
  } else {
      delete metadata[key];
  }
  return metadata;
};

const updateMetadataKeyValue = (metadata: Metadata, key: string, value: string): Metadata => {
  metadata[key] = value;
  return metadata;
};

const extractMetadataMarkdown = (content: string): ExtractResult => {
  let sections = content.split("---");
  if (sections.length < 3) return { metadata: {}, markdown: "", content };

  if (sections.length <= 1) return { metadata: {}, markdown: sections[0], content };

  let metadata = deserializeMetadata(sections[1]);
  let markdown = sections[2];

  return { metadata, markdown, content };
};

const inexactMetadataMarkdown = (metadata: Metadata, markdown: string): InexactResult => {
  return { inexactContent: `---\n${serializeMetadata(metadata)}---${markdown}` };
};

export { inexactMetadataMarkdown, extractMetadataMarkdown, displayMetadata, editMetadataKeyValue, checkMetadataKeyValue, removeMetadataKeyValue, updateMetadataKeyValue, serializeMetadata, deserializeMetadata };
