
// Crypto utilities for testing (server-side compatible version)
import crypto from 'crypto';

function arrayBufferToBase64(buffer) {
  return Buffer.from(buffer).toString('base64');
}

function base64ToArrayBuffer(base64) {
  return Buffer.from(base64, 'base64');
}

// Simple encryption test using Node's crypto (for testing purposes)
export function encryptText(text, key) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  const authTag = cipher.getAuthTag();
  
  return {
    ciphertext: encrypted,
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64')
  };
}

// Simple decryption test
export function decryptText(ciphertext, iv, authTag, key) {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(iv, 'base64')
  );
  
  decipher.setAuthTag(Buffer.from(authTag, 'base64'));
  
  let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

export function generateAESKey() {
  return crypto.randomBytes(32); 
}

// Test key derivation (simplified ECDH simulation), use hash of combined keys instead of real ECDH
export function simulateECDHKeyDerivation(privateKey, publicKey) {
  const combined = privateKey + publicKey;
  return crypto.createHash('sha256').update(combined).digest();
}