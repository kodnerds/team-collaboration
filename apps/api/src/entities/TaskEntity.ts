import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';

import { ProjectEntity } from './ProjectEntity';
import { UserEntity } from './UserEntity';

export enum TaskStatus {
  BACKLOG = 'backlog',
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

  @ManyToMany(() => UserEntity, (user) => user.assignedTasks)
  @JoinTable()
  assignees: UserEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
