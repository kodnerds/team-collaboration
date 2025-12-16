import { TaskRepository, ProjectRepository, UserRepository } from '../repository';
import { HTTP_STATUS } from '../utils/const';
import logger from '../utils/logger';
import { paginationParams } from '../utils/pagination';

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

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { taskId, projectId } = req.params;
    const { title, description, status } = req.body;
    const { id: userId } = req.user;

    if (!taskId || !projectId) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Task ID and Project ID are required' });
    }

    const userRepository = new UserRepository();
    const user = await userRepository.findById(userId);

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'User not found' });
    }

    const taskRepository = new TaskRepository();
    const task = await taskRepository.findOne(taskId);

    if (!task) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Task not found' });
    }

    if (task.project.id !== projectId) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Task not found in this project' });
    }

    if (task.project.createdBy.id !== userId) {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ message: 'You are not authorized to update this task' });
    }

    const updatedTask = await taskRepository.update({
      id: taskId,
      title,
      description,
      status
    });

    return res.status(HTTP_STATUS.OK).json({
      message: 'Task updated successfully',
      data: {
        id: updatedTask.id,
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        createdBy: {
          id: updatedTask.createdBy.id,
          name: updatedTask.createdBy.name,
          email: updatedTask.createdBy.email
        },
        createdAt: updatedTask.createdAt,
        updatedAt: updatedTask.updatedAt
      }
    });
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { page, limit, offset } = paginationParams(req.query);

    if (!projectId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Project ID is required' });
    }

    const projectRepository = new ProjectRepository();
    const project = await projectRepository.findOne(projectId);

    if (!project) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Project not found' });
    }

    const taskRepository = new TaskRepository();
    const [tasks, total] = await taskRepository.findAllByProject({
      projectId,
      skip: offset,
      take: limit,
      relations: ['createdBy']
    });

    return res.status(HTTP_STATUS.OK).json({
      message: 'Tasks fetched successfully',
      data: tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        createdBy: {
          id: task.createdBy.id,
          name: task.createdBy.name,
          email: task.createdBy.email
        },
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      })),
      meta: {
        page,
        limit,
        total
      }
    });
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const { taskId, projectId } = req.params;

    if (!taskId || !projectId) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Invalid project ID or task ID provided' });
    }

    const taskRepository = new TaskRepository();
    const task = await taskRepository.findOne(taskId);

    if (!task) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Task not found' });
    }

    if (task.project.id !== projectId) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'Task does not belong to this project' });
    }

    return res.status(HTTP_STATUS.OK).json({
      message: 'Task fetched successfully',
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        createdBy: {
          id: task.createdBy.id,
          name: task.createdBy.name,
          email: task.createdBy.email
        },
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }
    });
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { taskId, projectId } = req.params;
    const { id: userId } = req.user;
    if (!taskId || !projectId) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Task ID and Project ID are required' });
    }

    const userRepository = new UserRepository();
    const user = await userRepository.findById(userId);

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'User not found' });
    }

    const taskRepository = new TaskRepository();
    const task = await taskRepository.findOne(taskId);
    if (!task) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Task not found' });
    }
    if (task.project.id !== projectId) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Task not found in this project' });
    }
    if (task.project.createdBy.id !== userId) {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ message: 'You are not authorized to delete this task' });
    }
    await taskRepository.delete(taskId);
    return res.status(HTTP_STATUS.OK).json({ message: 'Task deleted successfully' });
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};
