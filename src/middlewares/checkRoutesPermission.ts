import routesConfig from "acl/routeConfig";
import debug from "debug";

import type { Request, Response, NextFunction } from "express";
import { Roles as aclRole } from "acl/aclRoles";
import { checkUser } from "./checkUser";

const checkRoutesPermissionDebug = debug("app:checkRoutesPermissionDebug");

export async function checkRoutesPermission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  checkRoutesPermissionDebug("🗺 CheckRoutePermissionMiddleware");
  const errorMessage = "Vous n'êtes pas autorisé à accéder à cette ressource";

  const method = req.method;
  const path = req.path;

  let allowedRoles = routesConfig[path]?.[method];

  if (!allowedRoles) {
    const matchingPattern = Object.keys(routesConfig).find((pattern) => {
      const regex = new RegExp(`^${pattern.replace(/\\d\+/g, "\\d+")}$`);
      return regex.test(path);
    });

    if (matchingPattern) {
      checkRoutesPermissionDebug("✔ Matching pattern found:", matchingPattern);
      allowedRoles = routesConfig[matchingPattern]?.[method];
    }
  }

  if (!allowedRoles || allowedRoles.length === 0) {
    checkRoutesPermissionDebug("✔ No allowed roles found for this route");
    next();
    return;
  }

  const userError = await checkUser(req, res);
  if (userError?.success === false) {
    res.status(userError.statusCode).json({
      success: false,
      message: userError.message,
    });
    return;
  }

  if (
    !Array.isArray(allowedRoles) ||
    !allowedRoles.includes(req.user?.role as aclRole)
  ) {
    checkRoutesPermissionDebug("❌ User role not allowed");
    res.status(403).json({
      message: errorMessage,
    });
    return;
  }

  next();
}
