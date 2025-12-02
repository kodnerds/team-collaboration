import { ProjectRepository, TaskRepository, UserRepository } from '../repository';
import { HTTP_STATUS } from '../utils/const';
import logger from '../utils/logger';

import type { Request, Response } from 'express';

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status } = req.body;
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Project ID is required' });
    }

    const projectRepository = new ProjectRepository();
    const project = await projectRepository.findById(projectId);

    if (!project) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Project not found' });
    }

    const userRepository = new UserRepository();
    const user = await userRepository.findById(req.user.id);

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'User not found' });
    }

    const taskRepository = new TaskRepository();
    const task = await taskRepository.create({
      title,
      description,
      status,
      project,
      createdBy: user
    });

    res.status(HTTP_STATUS.CREATED).json({
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
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create task' });
  }
};
