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
  '/api/auth/logout': {
    DELETE: [],
  },
  '/api/auth/register': {
    POST: [],
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
  '/api/challenges/create': {
    GET: [Role.USER, Role.ADMIN],
    POST: [Role.USER, Role.ADMIN],
  },
  '/api/challenges/owner': {
    POST: [Role.USER, Role.ADMIN],
  },
  '/api/challenges/:id/review': {
    GET: [],
  },
  '/api/challenges/:id': {
    GET: [],
  },
  // ? Particpation routes
  '/api/participations/create': {
    POST: [Role.USER, Role.ADMIN],
  },
  '/api/participations/delete': {
    DELETE: [Role.USER, Role.ADMIN],
  },
  '/api/participations/check/user': {
    POST: [Role.USER, Role.ADMIN],
  },
  '/api/participations/:challenge_id/review': {
    GET: [],
  },
  // ................................
}

export default routesConfig