# Milestone 04 - Final Project Documentation

## NetID
(mg7688)

## Name
(Michael Girum Kelemework)

## Repository Link
https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-MichaelGK-sid

## URL for deployed site
https://final-project-michaelgk-sid.onrender.com

## URL for form 1 (from previous milestone)
https://final-project-michaelgk-sid.onrender.com/login

## Special Instructions for Form 1
- Register a new account with any username and password
- Or login if you already have an account 
- Passwords are hashed with bcrypt
- On first login, encryption keys will be generated automatically

## URL for form 2 (for current milestone)
https://final-project-michaelgk-sid.onrender.com/profile
https://final-project-michaelgk-sid.onrender.com/home

## Special Instructions for Form 2
- Must be logged in to access profile page
- After logging in, click the "Profile" link from the home page
- Can update username or password (changes are saved to MongoDB)
- User can use the search feature in Home


## URL for form 3 (from previous milestone)
https://final-project-michaelgk-sid.onrender.com/chat/MrChrome2


## Special Instructions for Form 3
- Must be logged in
- Select a contact from the home page to open chat
- Messages are sent via Socket.io and encrypted with AES-GCM
- Message input form at bottom of chat page

## First link to github line number(s) for constructor, HOF, etc.
https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-MichaelGK-sid/blob/main/public/js/crypto.js#L3

## Second link to github line number(s) for constructor, HOF, etc.
https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-MichaelGK-sid/blob/main/app.mjs#L147
https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-MichaelGK-sid/blob/main/app.mjs#L209
https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-MichaelGK-sid/blob/main/app.mjs#L255


## Short description for links above
- First: `constructor` of my custom CryptoHandler class
- Second: `.map()` higher-order function used in different scenarios
## Link to github line number(s) for schemas (db.js or models folder)
https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-MichaelGK-sid/blob/main/db.mjs#L10
https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-MichaelGK-sid/blob/main/db.mjs#L24

## Description of research topics above with points
- 3 points - Socket.io for real-time messaging: enables instant message delivery between users without page refresh
- 4 points - Web Crypto API for end-to-end encryption: implements ECDH key exchange and AES-GCM encryption/decryption and authentication (receiver is guaranteed about the identity of sender) entirely in the browser.
- 3 points - Jest unit testing: testing encryption/decryption functions and key derivation with 6 unit tests

Total: 10 points

## Links to github line number(s) for research topics described above (one link per line)

https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-MichaelGK-sid/blob/main/app.mjs#L349
https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-MichaelGK-sid/blob/main/public/js/crypto.js
https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-MichaelGK-sid/blob/main/documentation/test_pass.png

## Optional project notes
### Testing the Encryption:
- Register two users in different browsers (or use regular + incognito mode)
- Send messages between them - messages are stored encrypted in MongoDB
- Only the intended recipient can decrypt messages
- Edit the private key in local storage (Inspect-Application-Storage-LocalStorage) to see what will happen if a person without the correct private tries to decrypt the messages.

### Known Limitations:
- Private keys are stored in browser localStorage - if you login from a different browser/device, you won't be able to decrypt old messages
- This is a realistic limitation of client-side key storage (similar to Signal on different devices)
- A warning message will appear if you try to login from a different browser


## Attributions
- MDN Web Crypto API Documentation - Encryption implementation in public/js/crypto.js - https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
- Socket.io Documentation - Real-time messaging in app.mjs - https://socket.io/docs/v4/
- Jest Documentation - Unit testing setup in __tests__/crypto.test.mjs - https://jestjs.io/docs/getting-started
- Express-session Documentation - Session management for authentication - https://www.npmjs.com/package/express-session
- bcrypt Documentation - Password hashing in registration/login routes - https://www.npmjs.com/package/bcrypt