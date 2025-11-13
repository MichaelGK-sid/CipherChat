# Milestone 03

## Repository Link
https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-MichaelGK-sid

## URL for form 1 (from previous milestone)
https://final-project-michaelgk-sid.onrender.com/register
https://final-project-michaelgk-sid.onrender.com/login

## Special Instructions for Form 1
- Register a new account with any username and password
- Or login if you already have an account
- Passwords are now properly hashed with bcrypt

## URL for form 2 (for current milestone)
https://final-project-michaelgk-sid.onrender.com/profile
https://final-project-michaelgk-sid.onrender.com/home

## Special Instructions for Form 2
- Must be logged in to access profile page
- After logging in, click the "Profile" link from the home page
- Can update username or password (changes are saved to MongoDB)
- User can use the search feature in Home

## URL(s) to github repository with commits that show progress on research

**Socket.io Integration (real-time messaging):**
https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-MichaelGK-sid/blob/main/app.mjs#L316

**Password hashing with bcrypt:**
https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-MichaelGK-sid/blob/main/app.mjs#L79-L298



**Jest unit tests (to be completed):**
- Will add test files for encryption/decryption functions in next milestone

**Web Crypto API (in progress):**
- Currently using placeholder keys
- Will implement full ECDH + AES-GCM encryption in final milestone

## References
- [Socket.io Documentation](https://socket.io/docs/v4/) - Used for real-time messaging implementation (lines 136-180 in app.mjs)
- [bcrypt Documentation](https://www.npmjs.com/package/bcrypt) - Used for secure password hashing (lines 70-95 in app.mjs)
- [Mongoose Documentation](https://mongoosejs.com/docs/) - Used for MongoDB schemas and queries