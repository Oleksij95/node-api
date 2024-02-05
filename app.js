require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const errorMiddleware = require('./middlewares/error')

const cors = require('cors')

const router = require('./routs')
const app = express()

const PORT = process.env.PORT || 5050


app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use(express.json())
app.use(cookieParser())

app.use(router)

app.use(errorMiddleware)

const start = async () => {
    try{
        await mongoose.connect(process.env.DB_URL, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`Server was started in ${PORT} port`))
    } catch(e) {
        console.log(e)
    }
    
}

start()


