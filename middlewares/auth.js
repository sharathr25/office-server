const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const { headers } = req;
    const token = headers['authorisation'];
    try {
        const { employee } = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = employee;
        next();
    } catch (error) {
        return res.status(403).send('Unathorised');
    }
}

module.exports = auth;