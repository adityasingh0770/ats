const { initStore } = require('../store/fileStore');

/** Replaces Mongo connect: initializes JSON file store for users / learners / sessions. */
const connectDB = async () => {
  initStore();
};

module.exports = connectDB;
