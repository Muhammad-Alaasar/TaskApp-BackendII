const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
    description: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    image: {
        type: Buffer
    }
})

schema.methods.toJSON = function (){
    const taskObject = this.toObject()
    return taskObject
}
const Task = mongoose.model('Task', schema)

module.exports = Task