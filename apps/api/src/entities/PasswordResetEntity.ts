import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";

import { UserEntity } from "./UserEntity";

@Entity({name: "resetToken"})
export class PasswordResetEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  token!: string;
  @Column()

  email!: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: "CASCADE" })
  user!: UserEntity;

  @Column({ type: "varchar", default: "active" })
  status!: "active" | "used";

  @Column({ type: "timestamp" })
  expiresAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
  
}
