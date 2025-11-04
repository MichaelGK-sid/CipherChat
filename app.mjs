import './config.mjs';
import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session';
import { User, Message } from './db.mjs';

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

// const PersonSchema = new mongoose.Schema({
//   name: String,
//   age: Number
// });

// const Person = mongoose.model('Person', PersonSchema);
// const mike = await Person.findOne({ name: 'Michael' });
// console.log(mike);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Basic route placeholders

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


app.get('/home', (req, res) => {
  const contacts = [
    { username: 'Alice', lastMessageTime: '7:43 PM', hasUnread: true },
    // { username: 'Bob', lastMessageTime: '2:18 PM', hasUnread: true },
    // { username: 'Charlie', lastMessageTime: '1:01 PM', hasUnread: true },
    // { username: 'David', lastMessageTime: '2:15 PM', hasUnread: false },
    // { username: 'Eve', lastMessageTime: 'Oct 11', hasUnread: true },
    // { username: 'Frank', lastMessageTime: 'Oct 12', hasUnread: false },
    { username: 'Grace', lastMessageTime: '2:00 AM', hasUnread: true }
  ];
  res.render('home', { contacts });
});

app.get('/home/search', (req, res) => {
  res.redirect('/home');
});

app.get('/chat/:username', (req, res) => {
  const messages = [
    { text: 'Hey, how are you?', isMine: false },
    { text: 'I\'m good! How about you?', isMine: true },
    { text: 'Doing great, thanks for asking!', isMine: false },
    { text: 'That\'s awesome to hear', isMine: true },
    { text: 'What are you up to today?', isMine: false },
    { text: 'Hey, how are you?', isMine: false },
    { text: 'I\'m good! How about you?', isMine: true },
    { text: 'Doing great, thanks for asking!', isMine: false },
    { text: 'That\'s awesome to hear', isMine: true },
    { text: 'What are you up to today?', isMine: false },
    { text: 'Hey, how are you?', isMine: false },
    { text: 'I\'m good! How about you?', isMine: true },
    { text: 'Doing great, thanks for asking!', isMine: false },
    { text: 'That\'s awesome to hear', isMine: true },
    { text: 'What are you up to today?', isMine: false }
  ];
  res.render('chat', { 
    username: req.params.username,
    messages: messages 
  });
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



app.listen(process.env.PORT || 3001);
