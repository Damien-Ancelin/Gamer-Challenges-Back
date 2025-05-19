import { Optional } from "sequelize";
import { Column, Table, DataType, Model, CreatedAt, UpdatedAt, HasMany } from "sequelize-typescript";

import { Challenge } from "./ChallengeModel";

interface LevelAttributes {
  id: number;
  name: string;
  levelColor: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LevelCreation
  extends Optional<LevelAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface LevelUpdate
  extends Optional<LevelAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

@Table({
  tableName: "level",
  modelName: "Level",
  timestamps: true,
}) 

export class Level extends Model<LevelAttributes, LevelCreation> implements LevelAttributes {
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
  declare levelColor: string;

  @CreatedAt
    declare createdAt: Date;
  
  @UpdatedAt
    declare updatedAt: Date;

  // Associations
  // 1:N relationship with Challenge
  // This means that a level can have many challenges but a challenge can only belong to one level
  @HasMany((): typeof Challenge => Challenge)
  declare challenges: Challenge[];
}