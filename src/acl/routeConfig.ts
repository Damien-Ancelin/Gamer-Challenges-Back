import { Roles as Role } from "./aclRoles"

interface RoutesConfig {
  [path: string]: {
    [method: string]: Role[]
  }
}

const routesConfig: RoutesConfig = {
  // ? Authentication routes
  '/api/auth/login': {
    POST: [],
  },
  '/api/auth/register': {
    POST: [],
  },
  '/api/auth/logout': {
    DELETE: [],
  },
  '/api/auth/refresh': {
    POST: [],
  },

  // ? Account routes
  '/api/account/user': {
    GET: [Role.USER, Role.ADMIN],
    POST: [Role.USER, Role.ADMIN],
  },
  '/api/account/update': {
    PATCH: [Role.USER, Role.ADMIN],
  },
  '/api/account/delete': {
    DELETE: [Role.USER, Role.ADMIN],
  },

  // ? Challenge routes
  '/api/challenges': {
    GET: [],
  },
  '/api/challenges/user': {
    POST: [Role.USER, Role.ADMIN],
  },
  '/api/challenges/create': {
    GET: [Role.USER, Role.ADMIN],
    POST: [Role.USER, Role.ADMIN],
  },
  '/api/challenges/delete': {
    DELETE: [Role.USER, Role.ADMIN],
  },
  '/api/challenges/owner': {
    POST: [Role.USER, Role.ADMIN],
  },
  '/api/challenges/:id/update': {
    PATCH: [Role.USER, Role.ADMIN],
  },
  '/api/challenges/:id': {
    GET: [],
  },
  // ? Particpation routes
  '/api/participations': {
    GET: [],
  },
  '/api/participations/leaderboard': {
    GET: [],
  },
  '/api/participations/user': {
    POST: [Role.USER, Role.ADMIN],
  },
  '/api/participations/popular': {
    GET: [],
  },
  '/api/participations/create': {
    POST: [Role.USER, Role.ADMIN],
  },
  '/api/participations/update': {
    PATCH: [Role.USER, Role.ADMIN],
  },
  '/api/participations/delete': {
    DELETE: [Role.USER, Role.ADMIN],
  },
  '/api/participations/check/user': {
    POST: [Role.USER, Role.ADMIN],
  },
  '/api/participations/owner': {
    POST: [Role.USER, Role.ADMIN],
  },
  '/api/participations/challenge/:challenge_id/count': {
    GET: [],
  },
  '/api/participations/challenge/:challenge_id': {
    GET: [],
  },
  '/api/participations/:id': {
    GET: [],
  },

  // ? Challenge Review routes
  '/api/challenge-reviews/create': {
    POST: [Role.USER, Role.ADMIN],
  },
  '/api/challenge-reviews/check/user': {
    POST: [Role.USER, Role.ADMIN],
  },
  '/api/challenge-reviews/challenge/:challenge_id/review': {
    GET: [],
  },

  // ? Participation Review routes
  '/api/participation-reviews/create': {
    POST: [Role.USER, Role.ADMIN],
  },
  '/api/participation-reviews/check/user': {
    POST: [Role.USER, Role.ADMIN],
  },
  '/api/participation-reviews/participation/:participation_id/review': {
    GET: [],
  }
  // ................................
}

export default routesConfig