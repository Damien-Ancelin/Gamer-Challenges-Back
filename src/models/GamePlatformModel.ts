import { Optional } from 'sequelize';
import { Table, Column, DataType, CreatedAt, UpdatedAt, ForeignKey, Model } from 'sequelize-typescript';

import { Game } from './GameModel';
import { Platform } from './PlatformModel';

interface GamePlatformAttributes {
  id: number;
  gameId: number;
  platformId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GamePlatformCreation
  extends Optional<GamePlatformAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

@Table({
  tableName: "game_platform",
  modelName: "GamePlatform",
  timestamps: true,
})

export class GamePlatform extends Model<GamePlatformAttributes, GamePlatformCreation> implements GamePlatformAttributes {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => Game)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare gameId: number;

  @ForeignKey(() => Platform)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare platformId: number;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  // Associations
  // Game and Platform associations are defined in their respective models
}

