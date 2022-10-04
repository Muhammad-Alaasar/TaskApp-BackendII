const mongoose = require('mongoose');
const validator = require('validator')
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
// require('dotenv').config()

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is Invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 20,
        validate(value) {
            if (value <= 0) {
                throw new Error('Invalid age')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate(value){
            const regExp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])")
            if (!regExp.test(value)) throw new Error("Password is weakly")
        }
    },
    // confirmPassword: {
    //     type: String,
    //     required: true,
    //     minlength: 8,
    //     validate(value){
    //         if (value !== this.password){
    //             throw new Error("Password missmatch")
    //         }
    //     }
    // },
    image: {
        type: Buffer
    }
})

schema.virtual('tasks', {
    localField: '_id',
    foreignField: 'owner',
    ref: 'Task'
})

schema.pre('save', async function(){
    if (this.isModified('password')){
        this.password = await bcryptjs.hash(this.password, 8)
    }
})

schema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if (!user) {
        throw new Error("Please check your email or password")
    }
    const isMatch = await bcryptjs.compare(password, user.password)
    if (!isMatch) {
        throw new Error("Please check your email or password")
    }
    return user
}

schema.methods.generateToken = function(){
    const token = jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY)
    return token
}

schema.methods.toJSON = function (){
    const userObject = this.toObject() // Convert document to object
    delete userObject.password
    return userObject
}

const User = mongoose.model('User', schema)

module.exports = User