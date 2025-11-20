// __tests__/crypto.test.mjs

import { 
  encryptText, 
  decryptText, 
  generateAESKey,
  simulateECDHKeyDerivation 
} from '../crypto-utils.mjs';

describe('Encryption and Decryption', () => {
  test('should encrypt and decrypt a message successfully', () => {
    const message = 'Hello, this is a secret message!';
    const key = generateAESKey();
    
    const encrypted = encryptText(message, key);
    const decrypted = decryptText(encrypted.ciphertext, encrypted.iv, encrypted.authTag, key);
    
    expect(decrypted).toBe(message);
  });

  test('should produce different ciphertext for same message', () => {
    const message = 'Same message';
    const key = generateAESKey();
    
    const encrypted1 = encryptText(message, key);
    const encrypted2 = encryptText(message, key);
    
    // IVs should be different
    expect(encrypted1.iv).not.toBe(encrypted2.iv);
    // Ciphertexts should be different
    expect(encrypted1.ciphertext).not.toBe(encrypted2.ciphertext);
  });

  test('should fail to decrypt with wrong key', () => {
    const message = 'Secret message';
    const key1 = generateAESKey();
    const key2 = generateAESKey();
    
    const encrypted = encryptText(message, key1);
    
    expect(() => {
      decryptText(encrypted.ciphertext, encrypted.iv, encrypted.authTag, key2);
    }).toThrow();
  });

  test('should handle empty messages', () => {
    const message = '';
    const key = generateAESKey();
    
    const encrypted = encryptText(message, key);
    const decrypted = decryptText(encrypted.ciphertext, encrypted.iv, encrypted.authTag, key);
    
    expect(decrypted).toBe(message);
  });
});

describe('Key Derivation', () => {
  test('should derive same key from same inputs', () => {
    const privateKey = 'alice-private-key';
    const publicKey = 'bob-public-key';
    
    const key1 = simulateECDHKeyDerivation(privateKey, publicKey);
    const key2 = simulateECDHKeyDerivation(privateKey, publicKey);
    
    expect(key1.equals(key2)).toBe(true);
  });

  test('should derive different keys from different inputs', () => {
    const alicePrivate = 'alice-private-key';
    const bobPublic = 'bob-public-key';
    const charliePublic = 'charlie-public-key';
    
    const key1 = simulateECDHKeyDerivation(alicePrivate, bobPublic);
    const key2 = simulateECDHKeyDerivation(alicePrivate, charliePublic);
    
    expect(key1.equals(key2)).toBe(false);
  });
});