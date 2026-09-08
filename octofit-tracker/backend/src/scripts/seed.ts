import mongoose from 'mongoose';
import { Activity, Leaderboard, Team, User, Workout } from '../models/index.js';
import { connectionString, disconnectDatabase } from '../config/database.js';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.create([
      { username: 'alex', email: 'alex@example.com', points: 320 },
      { username: 'jordan', email: 'jordan@example.com', points: 275 },
      { username: 'sam', email: 'sam@example.com', points: 190 },
    ]);
    const teams = await Team.create([
      { name: 'Morning Movers', description: 'Early birds building healthy habits.', memberIds: [users[0]._id, users[1]._id] },
      { name: 'Weekend Warriors', description: 'Making every weekend count.', memberIds: [users[2]._id] },
    ]);
    await User.updateOne({ _id: users[0]._id }, { teamId: teams[0]._id });
    await User.updateOne({ _id: users[1]._id }, { teamId: teams[0]._id });
    await User.updateOne({ _id: users[2]._id }, { teamId: teams[1]._id });
    await Activity.create([
      { userId: users[0]._id, type: 'running', durationMinutes: 30, points: 120 },
      { userId: users[1]._id, type: 'strength', durationMinutes: 25, points: 95 },
      { userId: users[2]._id, type: 'walking', durationMinutes: 40, points: 80 },
    ]);
    await Leaderboard.create([
      { userId: users[0]._id, points: 320, rank: 1 },
      { userId: users[1]._id, points: 275, rank: 2 },
      { userId: users[2]._id, points: 190, rank: 3 },
    ]);
    await Workout.create([
      { title: 'Quick Cardio', description: 'A brisk cardio session for busy days.', difficulty: 'beginner', durationMinutes: 20, tags: ['cardio', 'quick'] },
      { title: 'Full Body Circuit', description: 'A balanced strength and conditioning circuit.', difficulty: 'intermediate', durationMinutes: 35, tags: ['strength', 'full-body'] },
    ]);

    console.log('Database seeding complete');
    await disconnectDatabase();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
