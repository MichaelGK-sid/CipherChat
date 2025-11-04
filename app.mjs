import './config.mjs';
import express from 'express'
// import mongoose from 'mongoose'

import path from 'path'
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const mongoURI = process.env.DSN
// mongoose.connect(mongoURI)
//   .then(() => console.log('MongoDB connected successfully'))
//   .catch(err => console.error('MongoDB connection error:', err));

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
app.get('/', (req, res) => {
  res.send('Welcome to CipherChat!');
});

// TODO: Add routes for:
// - /register (GET, POST)
// - /login (GET, POST)
// - /home (GET)
// - /chat/:username (GET)
// - /profile (GET, POST)



app.listen(process.env.PORT || 3001);
