//Checks whether the incoming request is authenticated (Makes sure the incoming request contains valid token in header)

import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {

    //decode the jwt token and check if it is a valid token 
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export default authenticate;