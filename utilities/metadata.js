const display = (metadata) => {
    let metadataString = '';
    for (let key in metadata) {
        metadataString += `**${key}:** ${metadata[key]}\n`;
    }
    return metadataString;
}


const deserialize = (metadata_string) => {
    const metadataLines = metadata_string.split('\n').filter(line => line.trim() !== '');

    let metadata = {};

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
            metadata[lastKey].push(key.replace(/ /g, '').replace(/-/g, '').replace(/\"/g, ''));
            delete metadata[key];
        } else {
            lastKey = key;
        }

    }

    return metadata;

};

const serialize = (metadata) => {
    let metadataString = '';
    for (let key in metadata) {
        if (Array.isArray(metadata[key])) {
            metadataString += `${key}:\n`;
            metadata[key].forEach(value => {
                metadataString += `  - ${!isNaN(value) ? `"${value}"` : value}\n`;
            });
        } else {
            metadataString += `${key}: ${metadata[key]}\n`;
        }
    }
    return metadataString;
}

const edit = (metadata, key, value) => {
    let newMetadata = { ...metadata };
    if (Array.isArray(newMetadata[key]))
        if (newMetadata[key].map(item => item.toString()).includes(value.toString()))
            newMetadata[key] = newMetadata[key].filter(item => item.toString() !== value.toString());
        else
            newMetadata[key].push(value);
    else if (key == 'confirmed')
        newMetadata[key] = [value]
    else
        newMetadata[key] = value;
    return newMetadata;
};

const check = (metadata, key, value) => {
    if (!metadata) return false;
    if (!metadata[key]) return false;
    if (Array.isArray(metadata[key]))
        return metadata[key].filter(item => item.toString() === value.toString()).length > 0;
    return metadata[key] === value;
}

const remove = (metadata, key, value = null) => {
    if (Array.isArray(metadata[key])) {
        if (value) {
            metadata[key] = metadata[key].filter(item => item !== value);
        } else {
            delete metadata[key];
        }
    } else {
        delete metadata[key];
    }
    return metadata;
}

const update = (metadata, key, value) => {
    metadata[key] = value;
    return metadata;
}

module.exports = { display, edit, check, remove, update, serialize, deserialize };
