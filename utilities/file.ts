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
  Change,
} from "@/types";

const loadFile = (name: string): LoadResult => {
  const files = getFiles(name);
  if (files.length > 0) {
    let file_path = files[0];
    let content = fs.readFileSync(file_path).toString();
    let { metadata, markdown } = extractMetadataMarkdown(content);
    let { category, date, name } = getCategoryDateName(file_path);
    return { metadata, markdown, content, name, category, path: file_path, date};
  } else {
    return { metadata: {}, markdown: "", content: "", name, category: "", path: null, date: null};
  }
};

// just list paths
// const loadFiles
const loadFiles = (category: string, filter: string[] = [], date: string | null = null, limit: number = 0): FileContent[] => {
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
  
  files.forEach((file_path, index) => {
    let content = fs.readFileSync(file_path).toString();
    let { category, name, date } = getCategoryDateName(file_path);
    let { metadata, markdown } = extractMetadataMarkdown(content);
    let file_content: FileContent = { metadata, markdown, name, category, path: file_path, date};
    if (filter.length > 0){
      let isInFilter = true;
      filter.forEach((key) => {
        if (!metadata.tags.includes(key)) {
          isInFilter = false;
        }
      });
      if (!isInFilter) {
        return;
      }
    }

      file_contents.push(file_content);
  });

  return file_contents;
}

const getCategoryDateName = (file_path: string): { category: string, date: string, name: string} => {
    let local_path = file_path.replace(getDocsDir(), "");


    let result = {
      category: local_path.split("/")[1],
      // filter out every not number
      date: local_path.split("/").filter( (value) => { 
        return !isNaN(Number(value))
      }).filter((v: string) => v.length > 0).reverse().join("-"),
      name: local_path.split("/").slice(-1)[0].replace(".md", ""),
    };

    return result;
}

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

  const compareLines = (line: string, index: number) => {
    const post = ((newFile.markdown || '').split("\n")[index] || "").toString();
    const past = ((oldFile.markdown || '').split("\n")[index] || "").toString();

    if (post !== past) {
      changes.push({
        type: "markdown",
        key: `line_${index + 1}`,
        post,
        past,
      });
    }
  };

  Object.keys(newFile.metadata).forEach(compareMetadata);
  Object.keys(oldFile.metadata).forEach((key) => {
    if (newFile.metadata[key] === undefined) {
      compareMetadata(key);
    }
  });

  (newFile.markdown || '').split("\n").forEach(compareLines);
  (oldFile.markdown || '').split("\n").forEach((line, index) => {
    if (!(newFile.markdown || '').split("\n").includes(line)) {
      compareLines(line, index);
    }
  });

  return changes;
};


const saveFile = (name: string, file: SaveFile, date: string | null = null, category: string | null = null): void => {
  let file_path = getFilePath(name, date, category);
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
  if (__dirname.includes('.next')) return  path.join(__dirname, "..", "..", "..", "..", "..", "docs").toString();
  return path.join(__dirname, "..", "docs").toString();
}

const getFiles = (name: string = "*"): string[] => {
  let file_path = path.join(getDocsDir(), "**", `${name}`);
  file_path = file_path.endsWith(".md") ? file_path : file_path + ".md";
  let files = glob.sync(file_path, { nocase: true });
  return files.length < 0 ? [file_path.replace("**/", "")] : files;
};

const deepSearchFiles = (key: string, value: string): number  => {
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

// const editFile 

export {
  deepListAllFiles, deepListFiles, loadFiles,
  loadFile, saveFile, deleteFile, getChanges,
  getFilePath, getFiles, extractMetadataMarkdown, inexactMetadataMarkdown, deepSearchFiles
};
