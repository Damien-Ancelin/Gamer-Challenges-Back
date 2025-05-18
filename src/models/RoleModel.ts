import { Optional } from "sequelize";
import { BelongsToMany, Column, CreatedAt, DataType, Model, Table, UpdatedAt } from 'sequelize-typescript';

import { User } from "./UserModel";
import { UserRole } from "./UserRoleModel";

interface RoleAttributes {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleAttributesCreation
  extends Optional<RoleAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

@Table({
  tableName: 'role',
  modelName: 'Role',
  timestamps: true,
})

export class Role extends Model<RoleAttributes, RoleAttributesCreation> implements RoleAttributes {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    unique: true,
    defaultValue: 'user',
  })
  declare name: string;

  @CreatedAt
    declare createdAt: Date;
  
  @UpdatedAt
    declare updatedAt: Date;

  // Associations
  // N:N relationship with User through UserRole
  // This means that a role can have many users and a user can have many roles
  @BelongsToMany(() => User, () => UserRole)
    declare users?: User[];
}
