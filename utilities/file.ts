// file.ts
import * as path from "path";
import * as fs from "fs";
import * as glob from "glob";
import { deserializeMetadata, checkMetadataKeyValue, serializeMetadata, extractMetadataMarkdown, inexactMetadataMarkdown } from "./metadata";
import {
  Metadata,
  FileContent,
  LoadResult,
  SaveFile,
  DeleteResult,
  DeepSearchResult as DeepSearchFilesResult,
  DeepListResult as DeepListFilesResult,
  DeepListFilesResult as DeepListAllFilesResult,
  ExtractResult,
  InexactResult,
  GetFilesResult,
  GetPathResult,
} from "@/types";

const loadFile = (name: string): LoadResult => {
  const files = getFiles(name).files;
  if (files.length > 0) {
    let file_path = files[0];
    let content = fs.readFileSync(file_path).toString();
    let { metadata, markdown } = extractMetadataMarkdown(content);
    return { metadata, markdown, content };
  } else {
    return { metadata: {}, markdown: "", content: "" };
  }
};

const saveFile = (name: string, file: SaveFile, date: string | null = null, entityType: string | null = null): void => {
  let file_path = getFilePath(name, date, entityType);
  if (file_path) {
    let folder_path = file_path.split("/").slice(0, -1).join("/");
    if (!fs.existsSync(folder_path)) {
      fs.mkdirSync(folder_path, { recursive: true });
    }

    if (file == null) {
      fs.unlinkSync(file_path);
      return;
    }

    let content = inexactMetadataMarkdown(file.metadata, file.markdown).inexactContent;
    fs.writeFileSync(file_path, content);
  }
};

const getFileDatePath = (date: string): string => {
  let date_paths = date.split(".").reverse();
  for (let i = 0; i < date_paths.length; i++) {
    if (date_paths[i].startsWith("0")) {
      date_paths[i] = date_paths[i].substring(1);
    }
  }
  let date_path = date_paths.join("/");
  return date_path;
};

const getFilePath = (name: string, date: string | null = null, entityType: string | null = null): string | false => {
  const files = getFiles(name).files;
  if (files.length > 0) {
    return files[0];
  } else {
    if (date && entityType) return path.join(__dirname, "..", "docs", `${entityType}s`, getFileDatePath(date), `${name}.md`);
    else if (entityType) return path.join(__dirname, "..", "docs", `${entityType}s`, `${name}.md`);
    else return false;
  }
};

const getFiles = (name: string = "*"): GetFilesResult => {
  let file_path = path.join(__dirname, "..", "docs", "**", `${name}`);
  file_path = file_path.endsWith(".md") ? file_path : file_path + ".md";
  let files = glob.sync(file_path, { nocase: true });
  return { files: files.length < 0 ? [file_path.replace("**/", "")] : files };
};

const deepSearchFiles = (key: string, value: string): DeepSearchFilesResult => {
  let count = 0;
  for (let file of getFiles().files) {
    let content = fs.readFileSync(file).toString();
    let { metadata } = extractMetadataMarkdown(content);
    if (checkMetadataKeyValue(metadata, key, value)) {
      count++;
    }
  }
  return { count };
};

const deepListFiles = (key: string): DeepListFilesResult => {
  let file_path = path.join(__dirname, "..", "docs", "**", "*.md");
  let files = glob.sync(file_path);
  let values: string[] = [];
  for (let file of files) {
    let content = fs.readFileSync(file).toString();
    let { metadata } = extractMetadataMarkdown(content);
    if (metadata[key]) {
      if (Array.isArray(metadata[key])) {
        (metadata[key] as string[]).forEach((value) => {
          if (!values.includes(value as string)) {
            values.push(value as string);
          }
        });
      } else {
        if (!values.includes(metadata[key] as string)) {
          values.push(metadata[key] as string);
        }
      }
    }
  }
  return { values };
};

const deepListAllFiles = (key: string, value: string): DeepListAllFilesResult => {
  let file_path = path.join(__dirname, "..", "docs", "**", "*.md");
  let files = glob.sync(file_path);
  let result: string[] = [];
  for (let file of files) {
    let content = fs.readFileSync(file).toString();
    let { metadata } = extractMetadataMarkdown(content);
    if (checkMetadataKeyValue(metadata, key, value)) {
      result.push(file.split("docs/")[1]);
    }
  }
  return { result };
};

const deleteFile = (name: string): DeleteResult => {
  let file_path = getFilePath(name);
  if (file_path) {
    fs.unlinkSync(file_path);
    return { deleted: true };
  } else {
    return { deleted: false };
  }
}; 

// const editFile 

export { deepListAllFiles, deepListFiles, 
  loadFile, saveFile, deleteFile,
  getFilePath, getFiles, extractMetadataMarkdown, inexactMetadataMarkdown, deepSearchFiles };
