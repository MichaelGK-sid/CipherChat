import './config.mjs';
import express from 'express'
import mongoose from 'mongoose'

import path from 'path'
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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

const PersonSchema = new mongoose.Schema({
  name: String,
  age: Number
});

const Person = mongoose.model('Person', PersonSchema);
const mike = await Person.findOne({ name: 'Michael' });
console.log(mike);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Basic route placeholders
app.get('/', (req, res) => {
  res.send(mike.name + ' is ' + mike.age + ' years old.');
});

// TODO: Add routes for:
// - /register (GET, POST)
// - /login (GET, POST)
// - /home (GET)
// - /chat/:username (GET)
// - /profile (GET, POST)
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  res.redirect(req.body.username + "'s password is " + req.body.password);
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  res.redirect('/home');
});

app.get('/home', (req, res) => {
  // TODO: Get actual contacts from database
  const contacts = [
    { username: 'Alice', lastMessageTime: '7:43 PM', hasUnread: true },
    { username: 'Bob', lastMessageTime: '2:18 PM', hasUnread: true },
    { username: 'Charlie', lastMessageTime: '1:01 PM', hasUnread: true },
    { username: 'David', lastMessageTime: '2:15 PM', hasUnread: false },
    { username: 'Eve', lastMessageTime: 'Oct 11', hasUnread: true },
    { username: 'Frank', lastMessageTime: 'Oct 12', hasUnread: false },
    { username: 'Grace', lastMessageTime: '2:00 AM', hasUnread: true }
  ];
  res.render('home', { contacts });
});

app.get('/home/search', (req, res) => {
  // TODO: Implement search functionality
  res.redirect('/home');
});

app.get('/chat/:username', (req, res) => {
  res.send(`Chat with ${req.params.username} - To be implemented`);
});

app.get('/profile', (req, res) => {
  res.render('profile');
});
app.post('/profile', (req, res) => {
  res.redirect('/profile');
});



app.listen(process.env.PORT || 3001);
