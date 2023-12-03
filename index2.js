const crypto = require('crypto');

// Encryption
function encryptObject(obj, secretKey) {
  const jsonString = JSON.stringify(obj);
  const iv = crypto.randomBytes(16); // Initialization vector
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let encrypted = cipher.update(jsonString, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encryptedData: encrypted };
}

// Decryption
function decryptToObject(encryptedData, secretKey, iv) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return JSON.parse(decrypted);
}

// Example
const secretKey = 'a_secret_key'; // Should be kept secure
const dataObject = { message: 'I love you', count: 42 };

const encryptedResult = encryptObject(dataObject, secretKey);
console.log('Encrypted:', encryptedResult);

const decryptedObject = decryptToObject(encryptedResult.encryptedData, secretKey, encryptedResult.iv);
console.log('Decrypted:', decryptedObject);
