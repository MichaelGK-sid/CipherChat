import mongoose from 'mongoose';

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/cipherChat';

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

});

// Message Schema
const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    // Reference to the User who sent the message
  },

  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    // Reference to the User who receives the message
  },

  ciphertext: {type: String,required: true},

  iv: {type: String,required: true},

  timestamp: {
    type: Date,
    default: Date.now
  }
});


const User = mongoose.model('User', UserSchema);
const Message = mongoose.model('Message', MessageSchema);

// Export models
export { User, Message };