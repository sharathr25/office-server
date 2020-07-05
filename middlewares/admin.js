const isAdmin = (req, res, next) => {
    const { user } = req;
    const { role } = user;
    if(role === 'admin') next();
    else res.status(403).send('Unauthorised');
}

module.exports = isAdmin;