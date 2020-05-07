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

// Middleware for handling if "no connection to Mongodb":
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable '})
  }
})

// Database setup:
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/animals"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Mongoose model setup:
const Animal = mongoose.model('Animal', {
  name: String,
  type: String,
  age: Number,
  isFurry: Boolean
})

// First clear database - then populate database:
Animal.deleteMany().then(() => {
  new Animal({ name: 'Alfons', type: 'dog', age: 2, isFurry: true }).save()
  new Animal({ name: 'Lucy', type: 'cat', age: 5, isFurry: true }).save()
  new Animal({ name: 'Goldy the goldfish', type: 'fish', age: 1, isFurry: false }).save()
  new Animal({ name: 'Coco', type: 'bird', age: 8, isFurry: false }).save()
})

// Start defining your routes here
// FIRST:
app.get('/', (req, res) => {
  // res.send('Hello world')
  // find ALL animals in db and return as json:
  Animal.find().then(animals => {
    res.json(animals)
  })
})
// SECOND:
app.get('/:name', (req, res) => {
 // find ONE animal per NAME:
 Animal.findOne({ name: req.params.name }).then(animal => {
   if (animal) {
     res.json(animal)
   } else {
     res.status(404).json({ error: 'Not found'})
   }
 })
})





// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
