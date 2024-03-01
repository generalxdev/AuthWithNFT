const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const MONGODB_URI = 'mongodb+srv://devlord0625:guaRrSwBS5MYNvbo@cluster0.chfn2r0.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(MONGODB_URI)
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected')
})

const app = express()
app.use(express.json())
app.use(cors())

const routes = require('./routes/routes')
app.use('/api', routes)

app.listen(5000, () => {
    console.log('Server Started at 5000')
})