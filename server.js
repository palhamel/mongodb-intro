import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Database setup:
// const mongoURL = process.env.MONGO_URL || "mongodb://localhost/animals"
// mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
// mongoose.Promise = Promise

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/animals"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Mongoose model setup:
const Animal = mongoose.model('Animal', {
  name: String,
  age: Number,
  isFurry: Boolean
})

// Populate database:
new Animal({ name: 'Alfons', age: 2, isFurry: true }).save()
new Animal({ name: 'Lucy', age: 5, isFurry: true }).save()
new Animal({ name: 'Goldy the goldfish', age: 1, isFurry: false }).save()

// Start defining your routes here
app.get('/', (req, res) => {
  // res.send('Hello world')
  // find all animals and return as json:
  Animal.find().then(animals => {
    res.json(animals)
  })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
