# CipherChat


## Overview

CipherChat is a small end-to-end encrypted (E2EE) web messaging application built using Express and MongoDB. It allows users to securely register, log in, and exchange encrypted messages with each other — similar in spirit to Signal or WhatsApp, but in a much smaller scope for demonstration purposes.

Each user generates a public/private key pair upon first login. When one user sends a message to another, the plaintext message is encrypted in the browser using a shared secret key derived via Elliptic-Curve Diffie–Hellman (ECDH), ensuring that messages are stored encrypted on the server. Only the recipient, possessing the matching private key, can decrypt and read the message.

CipherChat demonstrates secure client–server interaction, database modeling with Mongoose, and applied cryptography in JavaScript through the Web Crypto API.

## Data Model

The application will store Users and Messages.

* Users can send and receive multiple messages (via references)
* Each message references both a sender and recipient user

An Example User:
```javascript
{
  username: "alice",
  passwordHash: "<bcrypt hash>",
  publicKey: "-----BEGIN PUBLIC KEY----- ...",
  createdAt: ISODate("2025-10-29T10:00:00Z")
}
```

An Example Message:
```javascript
{
  sender: // a reference to a User object
  recipient: // a reference to a User object
  ciphertext: "e3a2d91fa81c...",
  iv: "f9c1c2b3a4d5e6f7a8b9c0d1",
  timestamp: ISODate("2025-10-29T10:05:00Z")
}
```

## [Link to Commented First Draft Schema](db.mjs) 

## Wireframes

/register - page for user registration

![register](documentation/register.jpg)

/login - page for user login

![login](documentation/login.jpg)

/home - page showing contact list

![home](documentation/home.jpg)

/chat/:username - page for chatting with a specific user

![chat](documentation/chat.jpg)

/profile - page for editing user profile

![profile](documentation/profile.jpg)

## Site map
```
           [Login] <--> [Register]
              |
              |
           [Home]
            /   \
           /     \
      [Profile] [Chat (per contact)]
```

## User Stories

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can see my contact list and choose someone to message
4. as a user, I can send an encrypted message to another user
5. as a user, I can view previously exchanged encrypted messages that decrypt only on my device
6. as a user, I can update my username or password from my Profile page
7. as a user, I can search for contacts by username

## Research Topics

* (3 points) Unit testing with Jest
    * Using Jest to test encryption/decryption functions and key derivation
    * Includes 6 unit tests covering encryption, decryption, and ECDH key exchange
    * Test results screenshot available in documentation folder
    * see [Jest Testing Framework](https://jestjs.io/docs/getting-started)
* (3 points) Socket.io for real-time messaging
    * Socket.io enables instant message delivery without page refresh
    * Implements one-to-one messaging with user socket mapping
    * Messages persist to MongoDB and deliver in real-time if recipient is online
    * see [Socket.io Documentation](https://socket.io/docs/v4/)
* (4 points) Web Crypto API for client-side encryption
    * Implements ECDH (P-256 curve) for key exchange and AES-GCM for message encryption
    * Private keys stored in browser localStorage, public keys in MongoDB
    * All encryption/decryption happens client-side - server never sees plaintext
    * Includes key validation and browser detection warnings
    * see [MDN Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

**Total: 10 points**

## [Link to Initial Main Project File](app.mjs) 

## Known Limitations

* **Private keys are stored in browser localStorage** - If you login from a different browser or device, you won't be able to decrypt old messages. This is similar to how Signal works on different devices.
* **Key recovery is not implemented** - There is no way to recover lost keys if localStorage is cleared
* A warning message will appear if you attempt to login from a browser that doesn't have your private key

## Annotations / References Used

1. [MDN Web Docs – Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) - for ECDH and AES-GCM implementation
2. [Socket.io Documentation](https://socket.io/docs/v4/) - for real-time messaging
3. [Mongoose Documentation](https://mongoosejs.com/docs/) - for schema design
4. [Jest Testing Framework](https://jestjs.io/docs/getting-started) - for unit testing
5. [bcrypt Documentation](https://www.npmjs.com/package/bcrypt) - for password hashing
6. [Express-session Documentation](https://www.npmjs.com/package/express-session) - for session management
