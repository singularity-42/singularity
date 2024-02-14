// file.ts
import * as path from "path";
import * as fs from "fs";
import * as glob from "glob";
import {
  deserializeMetadata,
  checkMetadataKeyValue,
  serializeMetadata,
  extractMetadataMarkdown,
  inexactMetadataMarkdown,
  editMetadataKeyValue,
} from "./metadata";
import { Metadata, FileContent, LoadResult, SaveFile, Change } from "@/types";

export const loadFile = (credentials: string[], name?: string, path?: string, category?: string, date?: string): FileContent | null => {
  let content = '';
  let file_path = null;
  if (path && path.length > 0) {
    file_path = path;
  } else if (name && name.length > 0) {
    file_path = getFilePath(name);
  } else {
    let file_paths = getFilePaths();
    if (file_paths.length > 1) {
      if (category && category.length > 0)
        file_paths = file_paths.filter((file) => file.includes(category));
      if (file_paths.length > 1)
        if (date && date.length > 0)
          file_paths = file_paths.filter((file) => file.includes(date));
    }
  }

  if (!file_path) {
    console.error(`File ${name} not found. ${((path?.length || 0) > 0) ? `Path: ${path}` : ''}`);
    return {
      metadata: {},
      markdown: "",
      name: "",
      category: "",
      path: "",
      date: "",
    };
  }

  try {
    content = fs.readFileSync(file_path).toString();
  } catch {
    content = "";
  }

  let { metadata, markdown } = extractMetadataMarkdown(content);
  let { category: fileCategory, date: fileDate, name: fileName } = getCategoryDateName(file_path);
  let file = { metadata, markdown, content, name: fileName, category: fileCategory, path: file_path, date: fileDate } as FileContent;

  if (hasLockAndNoCredentials(file, credentials)) return null;
  return file;
};


const hasAllFilterTags = (tags: string[], filters: string[]) => {
  let allFiltersAreInTags = true;
  for (let i = 0; i < filters.length; i++) {
    let filter = filters[i];
    if (!tags.includes(filter)) {
      allFiltersAreInTags = false;
      break;
    }
  }
  return allFiltersAreInTags;
};

const hasLockAndNoCredentials = (file: FileContent, credentials: string[]) => {
  let hasLock = file.metadata.credentials !== undefined;
  let hasNoCredentials = credentials.length === 0;
  if (!hasLock && !hasNoCredentials) return false;

  let foundCredentials = credentials.filter((credential) => {
    if (!file.metadata.credentials) return false;
    if (typeof file.metadata.credentials === 'string') return file.metadata.credentials === credential;
    if (!Array.isArray(file.metadata.credentials)) return false;
    console.log(`Checking ${file.metadata.credentials} for credential ${credential}`);
    return file.metadata.credentials?.includes(credential);
  });

  let hasCredentials = foundCredentials.length > 0;
  return !hasCredentials;
}


// just list paths
// const loadFiles
export const loadFiles = (
  category: string | null = null, // null for all categories
  filter: string[] = [],
  credentials: string[] | null = null,
  date: string | null = null,
  limit: number = 0
): FileContent[] => {
  let filePaths = getFilePaths();
  if (date) {
    filePaths = filePaths.filter((file) => file.includes(getFileDatePath(date)));
  }
  if (category) {
    filePaths = filePaths.filter((file) => file.includes(category));
  }

  if (limit > 0) {
    filePaths = filePaths.slice(0, limit);
  }
  let file_contents: FileContent[] = [];


  filePaths.forEach((filePath) => {
    let content = fs.readFileSync(filePath).toString();
    let { metadata, markdown } = extractMetadataMarkdown(content);
    let { category, name, date } = getCategoryDateName(filePath);
    let fileContent: FileContent = { metadata, markdown, name, category, path: filePath, date };
    if (!hasAllFilterTags(metadata?.tags as string[] || [], filter) && filter.length !== 0) return;
    if (hasLockAndNoCredentials(fileContent, credentials || [])) return;

    // filter following information out if file content meta

    let ignoredMetadata = ['credentials', 'confirmed'];
    ignoredMetadata.forEach((key) => {
      delete fileContent.metadata[key];
    });

    file_contents.push(fileContent);
  });

  return file_contents;
};

export const getCategoryDateName = (file_path: string): { category: string; date: string; name: string } => {
  let localPath = file_path.replace(getDocsDir(), "");

  let result = {
    category: localPath.split(/(?:\/|\\)([^\/\\]+)/)[1] || '',
    date: localPath
      .split(/(?:\/|\\)(\d+)(?:\/|\\)(\d+)(?:\/|\\)(\d+)/)
      .filter((value) => {
        return !isNaN(Number(value));
      })
      .filter((v: string) => v.length > 0)
      .reverse()
      .join("-") || "",
    name: localPath.split(/(?:\/|\\)([^\/\\]+)\.md$/)[1] || '',
  };

  return result;
};

export const getChanges = (oldFile: FileContent, newFile: FileContent): Change[] => {
  const changes: Change[] = [];

  const compareMetadata = (key: string) => {
    const post = (newFile.metadata[key] || "").toString();
    const past = (oldFile.metadata[key] || "").toString();

    if (post !== past) {
      changes.push({
        type: "metadata",
        key,
        post,
        past,
      });
    }
  };

  const compareLines = (post: string, past: string, type: string, key: string) => {
    if (post !== past) {
      changes.push({
        type,
        key,
        post,
        past,
      });
    }
  };

  // Compare metadata
  Object.keys(newFile.metadata).forEach(compareMetadata);
  Object.keys(oldFile.metadata).forEach((key) => {
    if (newFile.metadata[key] === undefined) {
      compareMetadata(key);
    }
  });

  // Compare markdown lines
  const newLines = (newFile.markdown || "").split(/\r?\n|\r/);
  const oldLines = (oldFile.markdown || "").split(/\r?\n|\r/);
  const maxLines = Math.max(newLines.length, oldLines.length);

  for (let index = 0; index < maxLines; index++) {
    const post = newLines[index] || "";
    const past = oldLines[index] || "";

    compareLines(post, past, "markdown", `line_${index + 1}`);
  }

  return changes;
};
export const saveFile = (file: FileContent): void => {
  let filePath = file.path ? file.path : getFilePath(file.name, file.date, file.category);

  if (filePath) {
    let folder_path = filePath.split(/[\/\\]/).slice(0, -1).join("/");
    if (!fs.existsSync(folder_path)) {
      fs.mkdirSync(folder_path, { recursive: true });
    }

    if (file == null) {
      fs.unlinkSync(filePath);
      return;
    }

    let content = inexactMetadataMarkdown(file.metadata, file.markdown);
    fs.writeFileSync(filePath, content);
  }
};

export const getFileDatePath = (date: string): string => {
  let date_paths = date.split(".").reverse();
  for (let i = 0; i < date_paths.length; i++) {
    if (date_paths[i].startsWith("0")) {
      date_paths[i] = date_paths[i].substring(1);
    }
  }
  let date_path = date_paths.join("/");
  return date_path;
};

export const getFilePath = (name: string, date: string | null = null, category: string | null = null): string | false => {
  const files = getFilePaths(name);
  if (files.length > 0) {
    return files[0];
  } else {
    if (date && category) return path.join(getDocsDir(), `${category}s`, getFileDatePath(date), `${name}.md`);
    else if (category) return path.join(getDocsDir(), `${category}s`, `${name}.md`);
    else return false;
  }
};

export const getDocsDir = (): string => {
  if (__dirname.includes("chucks"))return path.join(__dirname, "..", "..", "..", "docs").toString();
  else if (__dirname.includes("app")) return path.join(__dirname, "..", "..", "..", "..", "..", "docs").toString();
  return path.join(__dirname, "..", "docs").toString();
};

export const getFilePaths = (name: string = "**"): string[] => {
  let filePath = path.join(getDocsDir(), '**', `${name}.md`);
  // normalize path for windows or linux
  filePath = filePath.replace(/\\/g, "/");
  filePath = filePath.replace(/\/\//g, "");
  let files = glob.sync(filePath, {
    nocase: true,
  });

  return files.length > 0 ? files : [filePath.replace("**/", "")];
};

export const deepSearchFiles = (key: string, value: string): number => {
  let count = 0;
  for (let file of getFilePaths()) {
    let content = fs.readFileSync(file).toString();
    let { metadata } = extractMetadataMarkdown(content);
    if (checkMetadataKeyValue(metadata, key, value)) {
      count++;
    }
  }
  return count;
};

export const deepListFiles = (key: string): string[] => {
  let file_path = path.join(getDocsDir(), "**", "*.md");
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
  return values;
};

export const deepListAllFiles = (key: string, value: string): string[] => {
  let file_path = path.join(getDocsDir(), "**", "*.md");
  let files = glob.sync(file_path);
  let result: string[] = [];
  for (let file of files) {
    let content = fs.readFileSync(file).toString();
    let { metadata } = extractMetadataMarkdown(content);
    if (checkMetadataKeyValue(metadata, key, value)) {
      result.push(file.split("docs/")[1]);
    }
  }
  return result;
};

export const deleteFile = (name: string): boolean => {
  let file_path = getFilePath(name);
  if (file_path) {
    fs.unlinkSync(file_path);
    return true;
  } else {
    return false;
  }
};

export const generateChangesFile = (file: FileContent, name: string): FileContent => {
  // new name will be "YYYY-MM-DD-HH-SS_NAME.md", than replace file name in path and name in file content
  
  let changeFileContent = file;
  changeFileContent.metadata = editMetadataKeyValue(changeFileContent.metadata, 'cancel', '0');
  changeFileContent.metadata = editMetadataKeyValue(changeFileContent.metadata, 'confirmed', '0');
  changeFileContent.metadata = editMetadataKeyValue(changeFileContent.metadata, 'original', `[[${name}]]`);
  let date_time_today = new Date().toISOString().split("T")[0]; // as YYYY-MM-DD-HH-MM-SS 
  let newFileName = `${date_time_today}_${name}`;
  changeFileContent.name = newFileName;
  changeFileContent.path = changeFileContent.path?.replace(`${name}.md`, `${newFileName}.md`) || '';
  let oldCategory = changeFileContent.category || '';
  changeFileContent.category = 'changes';
  changeFileContent.path = (changeFileContent.path || '').replace(oldCategory, changeFileContent.category);
  console.log(changeFileContent.path);
  return changeFileContent;
}
