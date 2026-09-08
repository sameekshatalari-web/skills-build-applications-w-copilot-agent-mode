import { Router } from 'express';
import type { SortOrder } from 'mongoose';
import { Activity, Leaderboard, Team, User, Workout } from '../models/index.js';

const router = Router();

const resources = [
  ['users', User],
  ['teams', Team],
  ['activities', Activity],
  ['leaderboard', Leaderboard],
  ['workouts', Workout],
] as const;

for (const [name, model] of resources) {
  router.get(`/${name}`, async (_request, response, next) => {
    try {
      const sort: Record<string, SortOrder> = name === 'leaderboard' ? { points: -1 } : { createdAt: -1 };
      response.json(await model.find().sort(sort));
    } catch (error) {
      next(error);
    }
  });

  router.post(`/${name}`, async (request, response, next) => {
    try {
      response.status(201).json(await model.create(request.body));
    } catch (error) {
      next(error);
    }
  });

  router.get(`/${name}/:id`, async (request, response, next) => {
    try {
      const item = await model.findById(request.params.id);
      if (!item) {
        response.status(404).json({ error: `${name} item not found` });
        return;
      }
      response.json(item);
    } catch (error) {
      next(error);
    }
  });

  router.patch(`/${name}/:id`, async (request, response, next) => {
    try {
      const item = await model.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
      if (!item) {
        response.status(404).json({ error: `${name} item not found` });
        return;
      }
      response.json(item);
    } catch (error) {
      next(error);
    }
  });

  router.delete(`/${name}/:id`, async (request, response, next) => {
    try {
      const item = await model.findByIdAndDelete(request.params.id);
      if (!item) {
        response.status(404).json({ error: `${name} item not found` });
        return;
      }
      response.status(204).send();
    } catch (error) {
      next(error);
    }
  });
}

export default router;