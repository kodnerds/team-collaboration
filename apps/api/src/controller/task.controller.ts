import { TaskRepository, ProjectRepository, UserRepository } from '../repository';
import { HTTP_STATUS } from '../utils/const';
import logger from '../utils/logger';

import type { Request, Response } from 'express';

export const createTask = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { title, description, status } = req.body;
    const { id: userId } = req.user;

    if (!projectId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Project ID is required' });
    }

    const userRepository = new UserRepository();
    const user = await userRepository.findById(userId);

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'User not found' });
    }

    const projectRepository = new ProjectRepository();
    const project = await projectRepository.findOne(projectId);

    if (!project) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Project not found' });
    }

    const taskRepository = new TaskRepository();
    const task = await taskRepository.create({
      title,
      description,
      status,
      project,
      createdBy: user
    });

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Task created successfully',
      data: {
        id: task.id,
        title: task.title,
        status: task.status,
        project: {
          id: project.id,
          name: project.name
        },
        createdBy: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};
