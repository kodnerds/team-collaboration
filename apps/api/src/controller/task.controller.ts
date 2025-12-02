import { ProjectRepository, UserRepository } from '../repository';
import { TaskRepository } from '../repository/TaskRepository';

import logger from '../utils/logger';
import { HTTP_STATUS } from '../utils/const';

import { Request, Response } from 'express';

export const createTask = async (req: Request, res: Response) => {
  try {

    const { title, description, status } = req.body;
    const { projectId } = req.params;
    const userId: string = req.user.id;

    const projectRepository = new ProjectRepository();
    const userRepository = new UserRepository();
    const taskRepository = new TaskRepository();


    const project = await projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newTask = await taskRepository.create({
      title,
      description,
      project,
      createdBy: user,
      status: status || "TODO",
    });

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Task created successfully',
      data: {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description,
      }
    });

  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
