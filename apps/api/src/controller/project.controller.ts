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

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Invalid fields provided, Project ID is required' });
    }

    const { name, description } = req.body;

    const projectRepository = new ProjectRepository();
    const project = await projectRepository.findOne(id);

    if (!project) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Project ID does not exist' });
    }

    if (req.user.id !== project.createdBy.id) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'User is not the project creator' });
    }

    if (name !== undefined) {
      project.name = name;
    }
    if (description !== undefined) {
      project.description = description;
    }

    await projectRepository.update(project);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Project updated successfully',
      data: {
        id: project.id,
        name: project.name,
        description: project.description,
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
    const { page: pageNum, limit: limitNum } = paginationParams(req.query);
    const page = Number(pageNum);
    const limit = Number(limitNum);
    const offset = (page - 1) * limit;

    const projectRepository = new ProjectRepository();
    const projects = await projectRepository.find({
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
    const total = await projectRepository.count();
    const totalPages = Math.ceil(total / limit);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Projects retrieved successfully',
      data: {
        items: projects,
        meta: {
          page,
          limit,
          total,
          totalPages
        }
      }
    });
  } catch {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};
