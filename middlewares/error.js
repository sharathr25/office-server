module.exports = (err, req, res, next) => {
    console.error("something went wrong", err);
    res.status(500).send("something went wrong");
};