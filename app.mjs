import './config.mjs';
import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session';
import { User, Message } from './db.mjs';
import { createServer } from 'http';
import { Server } from 'socket.io';


import path from 'path'
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret ',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.engine('hbs', engine({ 
  extname: '.hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


const mongoURI = process.env.DSN
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// Middleware to check if user is logged in
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/home');
  } else {
    res.redirect('/login');
  }
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.redirect('/register?error=Username already exists');
    }

    // For now, generate a dummy public key (you'll replace this with real crypto later)
    const publicKey = 'dummy_public_key_for_now' + Date.now();

    // Create new user
    const user = new User({
      username,
      passwordHash: password, // Not hashed yet - just storing plain text for now
      publicKey
    });

    await user.save();

    // Log them in automatically
    req.session.userId = user._id;
    req.session.username = user.username;

    res.redirect('/home');
  } catch (err) {
    console.error(err);
    res.redirect('/register');
  }
});

// Login routes
app.get('/login', (req, res) => {
  res.render('login', { error: req.query.error });
});



app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.redirect('/login?error=Invalid username or password');
    }

    // Check password (not hashed yet)
    if (user.passwordHash !== password) {
      return res.redirect('/login?error=Invalid username or password');
    }

    // Create session
    req.session.userId = user._id;
    req.session.username = user.username;

    res.redirect('/home');
  } catch (err) {
    console.error(err);
    res.redirect('/login?error=Login failed');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});


app.get('/home', requireLogin, async (req, res) => {
  try {
    // Get all users except the current user
    const contacts = await User.find({ 
      _id: { $ne: req.session.userId } 
    }).select('username').lean();
    
    // Get last message for each contact
    const contactsWithMessages = await Promise.all(
      contacts.map(async (contact) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: req.session.userId, recipient: contact._id },
            { sender: contact._id, recipient: req.session.userId }
          ]
        }).sort({ timestamp: -1 }).lean();
        
        return {
          username: contact.username,
          lastMessageTime: lastMessage 
            ? formatTimestamp(lastMessage.timestamp) 
            : 'No messages',
          hasUnread: false  // TODO: implement unread logic later
        };
      })
    );
    
    res.render('home', { 
      contacts: contactsWithMessages,
      currentUsername: req.session.username 
    });
  } catch (err) {
    console.error(err);
    res.render('home', { contacts: [] });
  }
});

// Helper function to format timestamps
function formatTimestamp(date) {
  const now = new Date();
  const messageDate = new Date(date);
  const diffTime = now - messageDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Today - show time
    return messageDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  } else if (diffDays < 7) {
    // This week - show day
    return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    // Older - show date
    return messageDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }
}

app.get('/home/search', requireLogin, async (req, res) => {
  try {
    const searchQuery = req.query.q || '';
    
    const contacts = await User.find({ 
      _id: { $ne: req.session.userId },
      username: { $regex: searchQuery, $options: 'i' }  // Case-insensitive search
    }).select('username').lean();
    
    const contactsWithMessages = await Promise.all(
      contacts.map(async (contact) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: req.session.userId, recipient: contact._id },
            { sender: contact._id, recipient: req.session.userId }
          ]
        }).sort({ timestamp: -1 }).lean();
        
        return {
          username: contact.username,
          lastMessageTime: lastMessage 
            ? formatTimestamp(lastMessage.timestamp) 
            : 'No messages',
          hasUnread: false
        };
      })
    );
    
    res.render('home', { 
      contacts: contactsWithMessages,
      currentUsername: req.session.username,
      searchQuery 
    });
  } catch (err) {
    console.error(err);
    res.render('home', { contacts: [], searchQuery: '' });
  }
});

app.get('/chat/:username', requireLogin, async (req, res) => {
  try {
    // Find the other user
    const otherUser = await User.findOne({ username: req.params.username });
    if (!otherUser) {
      return res.redirect('/home');
    }
    
    // Get messages between current user and other user
    const messages = await Message.find({
      $or: [
        { sender: req.session.userId, recipient: otherUser._id },
        { sender: otherUser._id, recipient: req.session.userId }
      ]
    }).sort({ timestamp: 1 });
    
    // Format messages for template
    const formattedMessages = messages.map(msg => ({
      text: msg.ciphertext,
      isMine: msg.sender.toString() === req.session.userId.toString(),
      iv: msg.iv,
      timestamp: msg.timestamp
    }));
    
    res.render('chat', { 
      username: req.params.username,
      recipientId: otherUser._id.toString(),
      currentUserId: req.session.userId.toString(),
      messages: formattedMessages 
    });
  } catch (err) {
    console.error(err);
    res.redirect('/home');
  }
});

app.post('/chat/:username/send', (req, res) => {
  res.redirect(`/chat/${req.params.username}`);
});

app.get('/profile', requireLogin, (req, res) => {
  res.render('profile', { username: req.session.username });
});

app.post('/profile/username', requireLogin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.session.userId, {
      username: req.body.username
    });
    req.session.username = req.body.username;
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.redirect('/profile');
  }
});

app.post('/profile/password', requireLogin, async (req, res) => {
  try {
    // Generate new public key when password changes
    const newPublicKey = 'dummy-public-key-' + Date.now();
    
    await User.findByIdAndUpdate(req.session.userId, { 
      passwordHash: req.body.password, 
      publicKey: newPublicKey 
    });
    
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.redirect('/profile');
  }
});


// Socket.io setup
const httpServer = createServer(app);
const io = new Server(httpServer);

// Store socket-to-user mappings
const userSockets = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // User identifies themselves when connecting
  socket.on('register_user', (userId) => {
    userSockets.set(userId, socket.id);
    socket.userId = userId;
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });
  
  // Handle sending messages
  socket.on('send_message', async (data) => {
    try {
      const { senderId, recipientId, ciphertext, iv } = data;
      
      // Save message to database
      const message = new Message({
        sender: senderId,
        recipient: recipientId,
        ciphertext: ciphertext,
        iv: iv,
        timestamp: new Date()
      });
      await message.save();
      
      // Send to recipient if they're online
      const recipientSocketId = userSockets.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('receive_message', {
          senderId,
          ciphertext,
          iv,
          timestamp: message.timestamp
        });
      }
      
      // Also send back to sender for confirmation
      socket.emit('message_sent', {
        messageId: message._id,
        timestamp: message.timestamp
      });
      
      console.log(`Message from ${senderId} to ${recipientId} saved`);
    } catch (err) {
      console.error('Error saving message:', err);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      userSockets.delete(socket.userId);
      console.log(`User ${socket.userId} disconnected`);
    }
  });
});

httpServer.listen(process.env.PORT || 3001, '0.0.0.0', () => {
  console.log(`Server running on port ${process.env.PORT || 3001}`);
});