import { ProjectRepository, UserRepository } from '../repository';
import { HTTP_STATUS } from '../utils/const';
import logger from '../utils/logger';
import { paginationParams } from '../utils/pagination';

import type { Request, Response } from 'express';

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const { id } = req.user;

    const userRepository = new UserRepository();
    const user = await userRepository.findById(id);

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
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const { page, limit, offset } = paginationParams(req.query);

    const projectRepository = new ProjectRepository();
    const projects = await projectRepository.findAndCount({
      skip: offset,
      take: limit,
      relations: ['createdBy'],
      select: {
        createdBy: {
          id: true,
          name: true,
          email: true
        }
      }
    });
    const total = projects[1];
    const totalPages = Math.ceil(total / limit);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Projects retrieved successfully',
      data: {
        items: projects[0],
        meta: {
          page,
          limit,
          total,
          totalPages
        }
      }
    });
  } catch (error) {
    logger.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};
