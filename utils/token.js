import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      userID: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '20d',
    }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userID: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role
    },
    process.env.JWT_SECRET_REFRESH,
    {
      expiresIn: '30d',
    }
  );
};