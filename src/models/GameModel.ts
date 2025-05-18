import { Optional } from 'sequelize';
import { Table, Column, DataType, CreatedAt, UpdatedAt, Model, BelongsToMany, HasMany } from 'sequelize-typescript';

import { Platform } from './PlatformModel';
import { GamePlatform } from './GamePlatformModel';
import { Challenge } from './ChallengeModel';


interface GameAttributes {
  id: number;
  name: string;
  gameImage: string | null;
  genre: string;
  description: string;
  developer: string;
  publisher: string;
  pegi: string;
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameCreation
  extends Optional<GameAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

@Table({
  tableName: "game",
  modelName: "Game",
  timestamps: true,
})

export class Game extends Model<GameAttributes, GameCreation> implements GameAttributes {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare gameImage: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare genre: string; 

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare developer: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare publisher: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare pegi: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare releaseDate: Date;

  @CreatedAt
    declare createdAt: Date;
  
  @UpdatedAt
    declare updatedAt: Date;

  // Associations
  // N:N relationship with Platform through GamePlatform
  // This means that a game can be on many platforms and a platform can have many games
  @BelongsToMany(() => Platform, () => GamePlatform)
  declare platforms?: Platform[];
  
  // 1:N relationship with GamePlatform
  // This means that a game can have many game platforms and a game platform belongs to one game
  @HasMany((): typeof Challenge => Challenge)
  declare challenges?: Challenge[];
}
  