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

const loadFile = (name: string): LoadResult => {
  const files = getFiles(name);
  if (files.length > 0) {
    let file_path = files[0];
    let content = '';
    try {
      content = fs.readFileSync(file_path).toString();
    }catch {
      console.error("file not found");
    }
    let { metadata, markdown } = extractMetadataMarkdown(content);
    let { category, date, name } = getCategoryDateName(file_path);
    return { metadata, markdown, content, name, category, path: file_path, date };
  } else {
    return { metadata: {}, markdown: "", content: "", name, category: "", path: null, date: null };
  }
};

// just list paths
// const loadFiles
const loadFiles = (
  category: string | null = null, // null for all categories
  filter: string[] = [],
  date: string | null = null,
  limit: number = 0
): FileContent[] => {
  let files = getFiles();
  if (date) {
    files = files.filter((file) => file.includes(getFileDatePath(date)));
  }
  if (category) {
    files = files.filter((file) => file.includes(category));
  }

  if (limit > 0) {
    files = files.slice(0, limit);
  }
  let file_contents: FileContent[] = [];

  let hasAllFilterTags = (metadata: Metadata, filters: string[]) => {
    return filters.every((filter) => metadata[filter]);
  };

  files.forEach((file_path) => {
    let content = fs.readFileSync(file_path).toString();
    let { metadata, markdown } = extractMetadataMarkdown(content);
    let { category, name, date } = getCategoryDateName(file_path);
    let file_content: FileContent = { metadata, markdown, name, category, path: file_path, date };
    if (!hasAllFilterTags(metadata, filter) && filter.length !== 0) return;
    file_contents.push(file_content);
  });
  
  return file_contents;
};

const getCategoryDateName = (file_path: string): { category: string; date: string; name: string } => {
  let localPath = file_path.replace(getDocsDir(), "");

  let result = {
    category: localPath.split(/(?:\/|\\)([^\/\\]+)/)[1],
    date: localPath
      .split(/(?:\/|\\)(\d+)(?:\/|\\)(\d+)(?:\/|\\)(\d+)/)
      .filter((value) => {
        return !isNaN(Number(value));
      })
      .filter((v: string) => v.length > 0)
      .reverse()
      .join("-"),
      name: localPath.split(/(?:\/|\\)([^\/\\]+)\.md$/)[1],
  };

  return result;
};

const getChanges = (oldFile: FileContent, newFile: FileContent): Change[] => {
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
const saveFile = (file: FileContent): void => {
  let file_path = file.path ? file.path : getFilePath(file.name, file.date, file.category);
  
  if (file_path) {
    let folder_path = file_path.split(/[\/\\]/).slice(0, -1).join("/");
    if (!fs.existsSync(folder_path)) {
      fs.mkdirSync(folder_path, { recursive: true });
    }

    if (file == null) {
      fs.unlinkSync(file_path);
      return;
    }

    let content = inexactMetadataMarkdown(file.metadata, file.markdown);
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

const getFilePath = (name: string, date: string | null = null, category: string | null = null): string | false => {
  const files = getFiles(name);
  if (files.length > 0) {
    return files[0];
  } else {
    if (date && category) return path.join(getDocsDir(), `${category}s`, getFileDatePath(date), `${name}.md`);
    else if (category) return path.join(getDocsDir(), `${category}s`, `${name}.md`);
    else return false;
  }
};

const getDocsDir = (): string => {
  if (__dirname.includes(".next")) return path.join(__dirname, "..", "..", "..", "..", "..", "docs").toString();
  return path.join(__dirname, "..", "docs").toString();
};

const getFiles = (name: string = "**"): string[] => {
  let filePath = path.join(getDocsDir(), '**', `${name}.md`);
  // normalize path for windows or linux
  filePath = filePath.replace(/\\/g, "/");
  filePath = filePath.replace(/\/\//g, "");
  let files = glob.sync(filePath, {
    nocase: true,
  });

  return files.length > 0 ? files : [filePath.replace("**/", "")];
};

const deepSearchFiles = (key: string, value: string): number => {
  let count = 0;
  for (let file of getFiles()) {
    let content = fs.readFileSync(file).toString();
    let { metadata } = extractMetadataMarkdown(content);
    if (checkMetadataKeyValue(metadata, key, value)) {
      count++;
    }
  }
  return count;
};

const deepListFiles = (key: string): string[] => {
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

const deepListAllFiles = (key: string, value: string): string[] => {
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

const deleteFile = (name: string): boolean => {
  let file_path = getFilePath(name);
  if (file_path) {
    fs.unlinkSync(file_path);
    return true;
  } else {
    return false;
  }
};

const generateChangesFile = (file: FileContent, name: string): FileContent => {
  let changeFileContent = file;
  changeFileContent.metadata = editMetadataKeyValue(changeFileContent.metadata, 'cancel', '0');
  changeFileContent.metadata = editMetadataKeyValue(changeFileContent.metadata, 'confirmed', '0');
  let date_time_today = new Date().toISOString().split("T")[0]; // as YYYY-MM-DD-HH-MM-SS 
  changeFileContent.metadata = editMetadataKeyValue(changeFileContent.metadata, 'changed', date_time_today);
  changeFileContent.metadata = editMetadataKeyValue(changeFileContent.metadata, 'original', name);  
  let oldCategory = changeFileContent.category || '';
  changeFileContent.category = 'changes';
  changeFileContent.path = (changeFileContent.path || '').replace(oldCategory, changeFileContent.category);
  console.log(changeFileContent.path);
  return changeFileContent;
}

export {
  generateChangesFile,
  deepListAllFiles,
  deepListFiles,
  loadFiles,
  loadFile,
  saveFile,
  deleteFile,
  getChanges,
  getFilePath,
  getFiles,
  extractMetadataMarkdown,
  inexactMetadataMarkdown,
  deepSearchFiles,
};
