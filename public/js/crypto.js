
class CryptoHandler {
  constructor() {
    this.keyPair = null;
  }

  async generateKeyPair() {
    try {
      this.keyPair = await window.crypto.subtle.generateKey(
        {
          name: "ECDH",
          namedCurve: "P-256"
        },
        true, // extractable
        ["deriveKey", "deriveBits"]
      );
      
      console.log("Key pair generated successfully");
      return this.keyPair;
    } catch (error) {
      console.error("Error generating key pair:", error);
      throw error;
    }
  }

  async exportPublicKey(publicKey) {
    try {
      const exported = await window.crypto.subtle.exportKey("spki", publicKey);
      const exportedAsBase64 = this.arrayBufferToBase64(exported);
      return exportedAsBase64;
    } catch (error) {
      console.error("Error exporting public key:", error);
      throw error;
    }
  }

  async importPublicKey(base64Key) {
    try {
      const binaryKey = this.base64ToArrayBuffer(base64Key);
      const publicKey = await window.crypto.subtle.importKey(
        "spki",
        binaryKey,
        {
          name: "ECDH",
          namedCurve: "P-256"
        },
        true,
        []
      );
      return publicKey;
    } catch (error) {
      console.error("Error importing public key:", error);
      throw error;
    }
  }

  async exportPrivateKey(privateKey) {
    try {
      const exported = await window.crypto.subtle.exportKey("pkcs8", privateKey);
      const exportedAsBase64 = this.arrayBufferToBase64(exported);
      return exportedAsBase64;
    } catch (error) {
      console.error("Error exporting private key:", error);
      throw error;
    }
  }

  async importPrivateKey(base64Key) {
    try {
      const binaryKey = this.base64ToArrayBuffer(base64Key);
      const privateKey = await window.crypto.subtle.importKey(
        "pkcs8",
        binaryKey,
        {
          name: "ECDH",
          namedCurve: "P-256"
        },
        true,
        ["deriveKey", "deriveBits"]
      );
      return privateKey;
    } catch (error) {
      console.error("Error importing private key:", error);
      throw error;
    }
  }

  async deriveAESKey(privateKey, publicKey) {
    try {
      const sharedSecret = await window.crypto.subtle.deriveKey(
        {
          name: "ECDH",
          public: publicKey
        },
        privateKey,
        {
          name: "AES-GCM",
          length: 256
        },
        false, // not extractable
        ["encrypt", "decrypt"]
      );
      return sharedSecret;
    } catch (error) {
      console.error("Error deriving AES key:", error);
      throw error;
    }
  }

  async encryptMessage(message, aesKey) {
    try {
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encodedMessage = new TextEncoder().encode(message);
      
      const ciphertext = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv
        },
        aesKey,
        encodedMessage
      );

      return {
        ciphertext: this.arrayBufferToBase64(ciphertext),
        iv: this.arrayBufferToBase64(iv)
      };
    } catch (error) {
      console.error("Error encrypting message:", error);
      throw error;
    }
  }

  async decryptMessage(ciphertextBase64, ivBase64, aesKey) {
    try {
      const ciphertext = this.base64ToArrayBuffer(ciphertextBase64);
      const iv = this.base64ToArrayBuffer(ivBase64);

      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv
        },
        aesKey,
        ciphertext
      );

      const decodedMessage = new TextDecoder().decode(decrypted);
      return decodedMessage;
    } catch (error) {
      console.error("Error decrypting message:", error);
      throw error;
    }
  }

  arrayBufferToBase64(buffer) {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    return window.btoa(binary);
  }

  base64ToArrayBuffer(base64) {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  async saveKeysToLocalStorage(userId) {
    try {
      const publicKeyBase64 = await this.exportPublicKey(this.keyPair.publicKey);
      const privateKeyBase64 = await this.exportPrivateKey(this.keyPair.privateKey);
      
      localStorage.setItem(`publicKey_${userId}`, publicKeyBase64);
      localStorage.setItem(`privateKey_${userId}`, privateKeyBase64);
      
      console.log("Keys saved to localStorage");
      return publicKeyBase64;
    } catch (error) {
      console.error("Error saving keys:", error);
      throw error;
    }
  }

  async loadKeysFromLocalStorage(userId) {
    try {
      const publicKeyBase64 = localStorage.getItem(`publicKey_${userId}`);
      const privateKeyBase64 = localStorage.getItem(`privateKey_${userId}`);
      
      if (!publicKeyBase64 || !privateKeyBase64) {
        console.log("No keys found in localStorage");
        return null;
      }

      const publicKey = await this.importPublicKey(publicKeyBase64);
      const privateKey = await this.importPrivateKey(privateKeyBase64);
      
      this.keyPair = { publicKey, privateKey };
      console.log("Keys loaded from localStorage");
      return this.keyPair;
    } catch (error) {
      console.error("Error loading keys:", error);
      throw error;
    }
  }
}

window.CryptoHandler = CryptoHandler;