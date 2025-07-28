import { afterAll, beforeAll } from 'vitest';
import sequelize from './src/configs/sequelize';
import { seedDatabase } from './src/migrations/seedingTest';

beforeAll(async () => {
    await sequelize.sync({ force: true });
    await seedDatabase();
});

afterAll(async () => {
    await sequelize.close();
});