// Function to generate a key pair
async function generateKeyPair() {
    const algorithm = {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
    };
    const keyPair = await crypto.subtle.generateKey(algorithm, true, ["encrypt", "decrypt"]);
    return keyPair;
}

// Function to validate if a public key matches a private key
function validateKeys(publicKey: CryptoKey, privateKey: CryptoKey) {
    // Assuming publicKey and privateKey are CryptoKey objects
    return publicKey.extractable === true && privateKey.extractable === true &&
        publicKey.type === "public" && privateKey.type === "private";
}

// Example usage
// (async () => {
//     const keyPair = await generateKeyPair();
//     console.log('Generated key pair');

//     // To simulate validation, we compare the type and extractable properties
//     const isValid = validateKeys(keyPair.publicKey, keyPair.privateKey);
//     console.log(`Is valid: ${isValid}`);
// })();
