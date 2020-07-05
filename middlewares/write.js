const canWrite = (req, res, next) => {
    const { user } = req;
    const { role } = user;
    if(role === 'write' || role === 'admin') next();
    else res.status(403).send('Unauthorised');
}

module.exports = canWrite;