import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Basic route placeholders
app.get('/', (req, res) => {
  res.send('CipherChat - Coming Soon');
});

// TODO: Add routes for:
// - /register (GET, POST)
// - /login (GET, POST)
// - /home (GET)
// - /chat/:username (GET)
// - /profile (GET, POST)



app.listen(process.env.PORT || 3000);
