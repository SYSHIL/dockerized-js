const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user'); // Assuming the user model is in a separate file

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection URL (modify as needed)
const mongoUrlLocal = MONGO_URI;

// Connect to MongoDB using the Docker Compose service name
mongoose.connect(mongoUrlLocal, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Create a new user
app.post('/users', async (req, res) => {
  const userData = req.body;

  try {
    const user = await User.create(userData);
    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Error creating user' });
  }
});

// Read all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ error: 'Error fetching users' });
  }
});

// Read a specific user by ID
app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Error fetching user' });
  }
});

// Update a user by ID
app.put('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const updatedUserData = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Error updating user' });
  }
});

// Delete a user by ID
app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndRemove(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: 'Error deleting user' });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
