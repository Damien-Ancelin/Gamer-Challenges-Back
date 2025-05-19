import { Optional } from "sequelize";
import { Column, Table, DataType, Model, CreatedAt, UpdatedAt, ForeignKey } from "sequelize-typescript";

import { User } from "./UserModel";
import { Role } from "./RoleModel";

interface UserRoleAttributes {
  id: number;
  userId: number;
  roleId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRoleCreation
  extends Optional<UserRoleAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface UserRoleUpdate
  extends Optional<UserRoleAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

@Table({
  tableName: 'user_role',
  modelName: 'UserRole',
  timestamps: true,
})

export class UserRole extends Model<UserRoleAttributes, UserRoleCreation> implements UserRole {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare roleId: number

  @CreatedAt
    declare createdAt: Date;
  
  @UpdatedAt
    declare updatedAt: Date;

  // Associations
  // User and Role associations are defined in their respective models

}