import { Optional } from 'sequelize';
import { Table, Column, DataType, CreatedAt, UpdatedAt, Model, BelongsToMany } from 'sequelize-typescript';

import { Game } from './GameModel';
import { GamePlatform } from './GamePlatformModel';

interface PlatformAttributes {
  id: number;
  name: string;
  brandColor: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlatformCreation
  extends Optional<PlatformAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface PlatformUpdate
  extends Optional<PlatformAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

@Table({
  tableName: "platform",
  modelName: "Platform",
  timestamps: true,
})

export class Platform extends Model<PlatformAttributes, PlatformCreation> implements PlatformAttributes {
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
  })
  declare name: string;

  @Column({
    type: DataType.STRING(7),
    allowNull: false,
  })
  declare brandColor: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  // Association
  // N:N relationship with Game through GamePlatform
  // This means that a platform can have many games and a game can have many platforms
  @BelongsToMany(() => Game, () => GamePlatform)
  declare games?: Game[];
}

