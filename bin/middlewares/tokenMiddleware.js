const {verify} = require('jsonwebtoken');

const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY || "my_tasks_nodejs";

const tokenMiddleware = async (req, res, next) => {
    try {
        const token = req.headers['token'];
        const decodeToken = verify(token, TOKEN_SECRET_KEY);
        req.user = decodeToken;
        next();
    } catch (e) {
        console.log(e);
        res.status(401).send('please login!');
    }
};

module.exports = tokenMiddleware;