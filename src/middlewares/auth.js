const jwt = require("jsonwebtoken");
const User = require("../models/User");
// require('dotenv').config()

const auth = async (req, res, next) => {

try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decode = jwt.verify(token, process.env.SECRET_KEY)
    const user = await User.findById({_id: decode._id})
    req.user = user
    next()
} catch(e) {
    res.status(401).send({error: 'Please Authenticate'})
}

}

module.exports = auth