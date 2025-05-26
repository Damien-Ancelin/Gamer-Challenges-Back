import { Roles as Role } from "./aclRoles"

interface RoutesConfig {
  [path: string]: {
    [method: string]: Role[]
  }
}

const routesConfig: RoutesConfig = {
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
  '/api/account/user': {
    GET: [Role.USER],
    POST: [Role.USER],
  },
  '/api/account/update': {
    PATCH: [Role.USER],
  },
  '/api/account/delete': {
    DELETE: [Role.USER],
  },
  // ................................
}

export default routesConfig