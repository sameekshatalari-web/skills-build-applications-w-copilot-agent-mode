import mongoose from 'mongoose';
import { User, WaterLog, Workout } from '../models/index.js';
import { connectionString, disconnectDatabase } from '../config/database.js';

const additionalWorkouts = [
  { title: 'Mobility Reset', description: 'Gentle mobility work for hips, shoulders, and spine.', difficulty: 'beginner', durationMinutes: 15, tags: ['mobility', 'recovery'] },
  { title: 'Interval Run', description: 'A structured run with short efforts and recovery periods.', difficulty: 'advanced', durationMinutes: 30, tags: ['cardio', 'running'] },
  { title: 'Core Builder', description: 'A focused core session using controlled bodyweight movements.', difficulty: 'intermediate', durationMinutes: 25, tags: ['strength', 'core'] },
];

async function ensureDemoData(): Promise<void> {
  try {
    await mongoose.connect(connectionString);
    const user = await User.findOne().sort({ createdAt: 1 });
    if (!user) throw new Error('Create a user before adding demo data.');

    for (const workout of additionalWorkouts) {
      await Workout.updateOne({ title: workout.title }, { $setOnInsert: workout }, { upsert: true });
    }
    if (!(await WaterLog.exists({ userId: user._id }))) {
      await WaterLog.create({ userId: user._id, amountMl: 500, loggedAt: new Date() });
    }
    console.log('Additional workout and water data are ready');
  } finally {
    await disconnectDatabase();
  }
}

void ensureDemoData().catch((error: unknown) => {
  console.error('Error ensuring demo data:', error);
  process.exitCode = 1;
});
