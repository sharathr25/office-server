const canRead = (req, res, next) => {
    const { user } = req;
    const { role } = user;
    if(role === 'read' || role === 'admin' || role === 'write') next();
    else res.status(403).send('Unauthorised');
}

module.exports = canRead;