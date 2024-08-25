const { Client, RemoteAuth } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');

require('dotenv').config();

const clientPromise = mongoose.connect(process.env.MONGODB_URI).then(() => {
  const store = new MongoStore({ mongoose });
  return new Client({
    authStrategy: new RemoteAuth({
      store: store,
      backupSyncIntervalMs: 60000
    })
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  throw err;
});

module.exports = clientPromise;
