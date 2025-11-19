import { AppDataSource } from './data-source';

export const connectToDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.info('Database connection established successfully 🚀');
  } catch (error) {
    console.error('Failed to initialize AppDataSource:', error);
  }
};
