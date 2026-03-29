const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('../models/Question');
const Content = require('../models/Content');
const questions = require('./questions.seed.js');
const contentData = require('./content.seed.json');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/apnaits';

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Question.deleteMany({});
    await Content.deleteMany({});
    console.log('Cleared existing data');

    await Question.insertMany(questions);
    console.log(`Seeded ${questions.length} questions`);

    await Content.insertMany(contentData);
    console.log(`Seeded ${contentData.length} concept/remedial content entries`);

    console.log('Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
