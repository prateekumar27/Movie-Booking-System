import User from "../modules/users/user.model.js";
import { verifyAccessToken } from "../modules/auth/generateToken.js";

const authCheck = async (req, res, next) => {
  try {
    // 1. get token from cookies
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return res.status(401).json({ message: "Access token is missing" });
    }

    // 2. verify token → decode user id
    const decodedToken = verifyAccessToken(accessToken);

    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // 3. find user from db using decoded id
    const user = await User.findById(decodedToken.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4. attach full user to request
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authCheck;
