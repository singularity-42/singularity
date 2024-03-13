// file.ts
import * as path from "path";
import * as fs from "fs";
import * as glob from "glob";
import {
  checkMetadataKeyValue,
  extractMetadataMarkdown,
  inexactMetadataMarkdown,
  editMetadataKeyValue,
} from "./metadata";
import { FileContent, Change } from "@/app/types";

export const loadFile = (credentials: string[], name?: string, got_file_path?: string, category?: string, date?: string): FileContent | null => {
  let content = '';
  let file_path = got_file_path;
  if (!file_path) {
    let file_paths = getFilePaths(name || undefined);

    if (file_paths.length === 0) {
      return null;
    }

    if (file_paths.length > 1 && name && name.length > 0) {
      file_paths = file_paths.filter((file) => file.includes(name));
    }

    if (file_paths.length > 1 && category && category.length > 0) {
      file_paths = file_paths.filter((file) => file.includes(category));
    }

    if (file_paths.length > 1 && date && date.length > 0) {
      let dateParts = date.split('-');
      file_paths = file_paths.filter((single_file_path) => {
        let { category, name, date } = getCategoryDateName(single_file_path);
        if (category !== category) return false;
        if (name !== name) return false;
        if (dateParts.length === 3)
          if (dateParts[0] !== date.split('-')[0]) return false;
          else if (dateParts[1] !== date.split('-')[1]) return false;
          else if (dateParts[2] !== date.split('-')[2]) return false;
        return true;
      });
    }

    file_path = file_paths[0];
  }

  if (!file_path)
    return null;

  if (!file_path) {
    console.error(`File ${name} not found. ${((file_path?.length || 0) > 0) ? `Path: ${path}` : ''}`);
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

export const loadCategories = (credentials: string[]): string[] => {
  if (!fs.existsSync(getDocsDir())) return [];
  let categories = fs.readdirSync(getDocsDir()).map((category) => category.toLowerCase());
  categories = categories.filter((category) => {
    return fs.statSync(path.join(getDocsDir(), category)).isDirectory();
  });

  return categories;
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

const hasAllConnections = (file: FileContent, connections: string[], credentials: string[] = []) => {
  if (connections.length === 0) return true;
  if (connections.includes(file.name.toLowerCase())) return true;

  let hasMetadataConnections = false;
  if (file.metadata.connections)
    if (Array.isArray(file.metadata.connections))
      file.metadata.connections.forEach((connection) => {
        connections.forEach((connectionFilter) => {
          if (connection.toLowerCase().includes(connectionFilter.toLowerCase())) hasMetadataConnections = true;
        });
      });
    else
      // if (connections.includes(file.metadata.connections.toString().toLowerCase())) return true;
      connections.forEach((connection) => {
        if (file.metadata.connections.toString().toLowerCase().includes(connection)) hasMetadataConnections = true;
      })
  return hasMetadataConnections;
};

const hasNameInContent = (file: FileContent, name: string) => {
  return file.markdown.toLowerCase().includes(name.toLowerCase()) || file.name.toLowerCase().includes(name.toLowerCase());
};

const hasLockAndNoCredentials = (file: FileContent, credentials: string[]) => {
  let hasLock = file.metadata.credentials !== undefined;
  let hasNoCredentials = credentials.length === 0;
  if (!hasLock && !hasNoCredentials) return false;

  let foundCredentials = credentials.filter((credential) => {
    if (!file.metadata.credentials) return false;
    if (typeof file.metadata.credentials === 'string') return file.metadata.credentials === credential;
    if (!Array.isArray(file.metadata.credentials)) return false;
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
  connections: string[] = [],
  name: string = ''
): FileContent[] => {
  let filePaths = getFilePaths();

  if (category && category.length > 0) {
    filePaths = filePaths.filter((file) => file.includes(category));
  }

  let file_contents: FileContent[] = [];

  filePaths.forEach((filePath) => {
    let content = fs.readFileSync(filePath).toString();
    let { metadata, markdown } = extractMetadataMarkdown(content);
    let { category: fileCategory, name: fileName, date } = getCategoryDateName(filePath);
    if (category && category.length > 0 && fileCategory !== category) return;
    let fileContent: FileContent = { metadata, markdown, name: fileName, category: fileCategory, path: filePath, date };
    if (name && name.length > 0 && !hasNameInContent(fileContent, name)) return;
    if (!hasAllFilterTags(metadata?.tags as string[] || [], filter) && filter.length !== 0) return;
    if (hasLockAndNoCredentials(fileContent, credentials || [])) return;
    if (!hasAllConnections(fileContent, connections, credentials || [])) return;

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
  if (__dirname.includes("server") && !__dirname.includes("app")) return path.join(__dirname, "..", "..", "..", "data", "markdown").toString();
  else if (__dirname.includes("app")) return path.join(__dirname, "..", "..", "..", "..", "..", "data", "markdown").toString();
  return path.join(__dirname, "..", "data", "markdown").toString();
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
