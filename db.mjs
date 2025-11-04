import mongoose from 'mongoose';

const mongoURI = process.env.DSN || 'mongodb://localhost/cipherChat';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  passwordHash: {type: String, required: true},
  publicKey: {type: String, required: true},
  createdAt: {type: Date, default: Date.now}

});

// Message Schema
const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  ciphertext: {type: String,required: true},

  iv: {type: String,required: true},

  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
});


const User = mongoose.model('User', UserSchema);
const Message = mongoose.model('Message', MessageSchema);

// Export models
export { User, Message };