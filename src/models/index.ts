import { Category } from "./CategoryModel";
import { Challenge } from "./ChallengeModel";
import { ChallengeReview } from "./ChallengeReviewModel";
import { Game } from "./GameModel";
import { GamePlatform } from "./GamePlatformModel";
import { Level } from "./LevelModel";
import { Participation } from "./ParticipationModel";
import { ParticipationReview } from "./ParticipationReviewModel";
import { Platform } from "./PlatformModel";
import { Role } from "./RoleModel";
import { User } from "./UserModel";
import { UserRole } from "./UserRoleModel";

const models = {
  User,
  Role,
  UserRole,
  Participation,
  Challenge,
  ChallengeReview,
  ParticipationReview,
  Category,
  Level,
  Game,
  Platform,
  GamePlatform,
}

export default models;