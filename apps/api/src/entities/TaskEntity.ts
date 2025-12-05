import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

import { ProjectEntity } from './ProjectEntity';
import { UserEntity } from './UserEntity';

export enum TaskStatus {
  TODO = 'todo',
  DOING = 'doing',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  DONE = 'done'
}

@Entity({ name: 'task' })
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO
  })
  status: TaskStatus;

  @ManyToOne(() => ProjectEntity, (project) => project.tasks, { onDelete: 'CASCADE' })
  project: ProjectEntity;

  @ManyToOne(() => UserEntity, (user) => user.tasks)
  createdBy: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
