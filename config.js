const { matches } = require("lodash")

const config = {
    'dev': {
        mongodbURL: "mongodb://localhost/office"
    },
    'prod' : {
        mongodbURL: `mongodb+srv://${process.env.OFFICE_DB_USER}:${process.env.OFFICE_DB_PASSWORD}@cluster0-phtnz.mongodb.net/office?retryWrites=true&w=majority`
    }
}

module.exports = config[process.env.ENV || 'dev'];