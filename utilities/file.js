const path = require('path');
const fs = require('fs');
const glob = require('glob');
const { deserialize, check, serialize } = require('./metadata');

const load = (name) => {
    const files = getFiles(name);
    if (files.length > 0) {
        let file_path = files[0];
        let content = fs.readFileSync(file_path).toString();
        let { metadata, markdown } = extract(content);
        return { metadata, markdown, content };
    } else {
        return null;
    }
};

const extract = (content) => {
    let sections = content.split('---');
    if (sections.length < 3)
        return { metadata: {}, markdown: '' };

    if (sections.length <= 1)
        return { metadata: {}, markdown: sections[0] };

    let metadata = deserialize(sections[1]);
    let markdown = sections[2];


    return { metadata, markdown, content };
};

const inexact = (metadata, markdown) => {
    return `---\n${serialize(metadata)}---${markdown}`;
}

const save = (name, file, date = null, entityType = null) => {
    let file_path = getPath(name, date, entityType);
    if (file_path) {
        let folder_path = file_path.split('/').slice(0, -1).join('/');
        if (!fs.existsSync(folder_path)) {
            fs.mkdirSync(folder_path, { recursive: true });
        }
        
        if (file == null) {
            fs.unlinkSync(file_path);
            return;
        }

        let content = inexact(file.metadata, file.markdown);
        fs.writeFileSync(file_path, content);
    }
}

const getDatePath = (date) => {
    // make make it without the first 0
    let date_paths = date.split('.').reverse();
    for (let i = 0; i < date_paths.length; i++) {
        if (date_paths[i].startsWith('0')) {
            date_paths[i] = date_paths[i].substring(1);
        }
    }
    let date_path = date_paths.join('/');
    return date_path;
}

const getPath = (name, date = null, entityType = null) => {
    const files = getFiles(name);
    if (files.length > 0) {
        return files[0];
    } else {
        if (date && entityType)
            return path.join(__dirname, '..', 'docs', `${entityType}s`, getDatePath(date), `${name}.md`);
        else if (entityType)
            return path.join(__dirname, '..', 'docs', `${entityType}s`, `${name}.md`);
        else
            return false;
    }
};

const getFiles = (name = '*') => {
    let file_path = path.join(__dirname, '..', 'docs', '**', `${name}`);
    file_path = file_path.endsWith('.md') ? file_path : file_path + '.md';
    let files = glob.sync(file_path, { nocase: true });
    return files.length < 0 ? [file_path.replace('**/', '')] : files;
}

// will search in all .md files, read metadata and check key value and we want to count how many files have this key value
const deepSearch = (key, value) => {
    let count = 0;
    for (let file of getFiles()) {
        let content = fs.readFileSync(file).toString();
        let { metadata } = extract(content);
        if (check(metadata, key, value)) {
            count++;
        }
    }
    return count;
}

// lists all existing values by key in all .md files without duplicates
const deepList = (key) => {
    let file_path = path.join(__dirname, '..', 'docs', '**', '*.md');
    let files = glob.sync(file_path);
    let values = [];
    for (let file of files) {
        let content = fs.readFileSync(file).toString();
        let { metadata } = extract(content);
        if (metadata[key]) {
            if (Array.isArray(metadata[key])) {
                metadata[key].forEach(value => {
                    if (!values.includes(value)) {
                        values.push(value);
                    }
                });
            } else {
                if (!values.includes(metadata[key])) {
                    values.push(metadata[key]);
                }
            }
        }
    }
    return values;
}

// list all files where key value is present
const deepListFiles = (key, value) => {
    let file_path = path.join(__dirname, '..', 'docs', '**', '*.md');
    let files = glob.sync(file_path);
    let result = [];
    for (let file of files) {
        let content = fs.readFileSync(file).toString();
        let { metadata } = extract(content);
        if (check(metadata, key, value)) {
            // result.push(file); cut all path until "docs"
            result.push(file.split('docs/')[1]);
        }
    }
    return result;
}


module.exports = { deepListFiles, deepList, load, save, getPath, getFiles, extract, intract: inexact, deepSearch };