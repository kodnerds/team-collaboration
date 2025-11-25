import { ProjectRepository, UserRepository } from '../repository';
import { HTTP_STATUS } from '../utils/const';

import type { Request, Response } from 'express';

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const authenticatedUser = req.user;

    if (!authenticatedUser) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'User is not authorized' });
    }

    const userRepository = new UserRepository();
    const user = await userRepository.findById(authenticatedUser.id);

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'User not found' });
    }

    const projectRepository = new ProjectRepository();
    const project = await projectRepository.create({ name, description, createdBy: user });

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Project created successfully',
      data: {
        id: project.id,
        name: project.name,
        createdBy: {
          id: project.createdBy.id,
          name: project.createdBy.name,
          email: project.createdBy.email
        }
      }
    });
  } catch {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};
