require('dotenv').config()
require('./db/mongoose')
const cors = require('cors')
const express = require('express')
const app = express()
const port = process.env.PORT
const userRoutes = require('./routers/user')
const taskRoutes = require('./routers/task')

app.use(express.json())
app.use(cors())
app.use(userRoutes)
app.use(taskRoutes)

app.use('/', (req, res) => res.send("Tasks API"))
app.listen(port, () => console.log(`Server online at http://localhost:${port}`))


// const jwt = require('jsonwebtoken')

// const myToken = jwt.sign({id: 123}, 'nodejs')
// console.log(myToken)
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzLCJpYXQiOjE2NjMyODkyMzl9.Y2PrqWU3oIg3Tb7o46DHV7o6NniFf4APo5SoH445reI
// Header, Payload, Signature(Secret Key)