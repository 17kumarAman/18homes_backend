// role.middleware.js
import sendResponse from "../utils/apiResponse.js";

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendResponse(
        res,
        403,
        false,
        "You are not allowed to perform this action"
      );
    }
    next();
  };
};
