Milestone 02
===

Repository Link
---
https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-MichaelGK-sid

Special Instructions for Using Form (or Login details if auth is part of your project)
---
* Register a new account at `/register` with any username and password
* Login credentials are stored in MongoDB
* After login, you'll be redirected to `/home` where you can access the chat interface
* Profile page (`/profile`) allows you to update your username and password
* To test real-time messaging: open `/chat/testuser` in two different browser windows and send messages to see them appear instantly in both windows

URL for form 
---
* Registration: https://final-project-michaelgk-sid.onrender.com/register
* Login: https://final-project-michaelgk-sid.onrender.com/login
* Profile Update: https://final-project-michaelgk-sid.onrender.com/profile

URL for form result
---
* After registration/login: https://final-project-michaelgk-sid.onrender.com/home
* After profile update: https://final-project-michaelgk-sid.onrender.com/profile

URL to github that shows line of code where research topic(s) are used / implemented
--- 
* Socket.io server setup: https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-MichaelGK-sid/blob/main/app.mjs#L[223]-L[238]
* Socket.io client implementation: https://github.com/nyu-csci-ua-0467-001-002-fall-2025/final-project-MichaelGK-sid/blob/main/views/chat.hbs#L[28]-L[56]

Research Topic: Socket.io for Real-Time Messaging
* Currently implemented basic proof-of-concept for real-time message broadcasting
* Messages sent through Socket.io appear instantly in all connected clients without page refresh
* Next steps: Implement private rooms for one-on-one conversations, persist messages to MongoDB, and integrate with user sessions

References 
---
* Socket.io Getting Started Guide: https://socket.io/get-started/chat
* Socket.io Documentation: https://socket.io/docs/v4/