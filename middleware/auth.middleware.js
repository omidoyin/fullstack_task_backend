const jwt = require("jsonwebtoken");

// to check if Token present, if token is valid , then add userid on the req and call next.

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers;
    if (
      !authHeader.authorization ||
      !authHeader.authorization.startsWith("Bearer")
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // verify token and get payload

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
      return res.status(401).json({ message: "invalid token" });
    }

    req.user = payload;

    next();
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ error });
  }
};

module.exports = authMiddleware;
