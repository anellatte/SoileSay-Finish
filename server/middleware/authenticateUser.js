const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).send({ error: 'No token provided' });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, 'qolshatyr');

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).send({ error: 'Invalid token' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Invalid token' });
    }
};

module.exports = authenticateUser;
