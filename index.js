require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Item = require('./models/item')
const app = express()
app.use(express.json())
morgan.token('postBodyData', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : '')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBodyData'))
app.use(cors())
app.use(express.static('build'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)


let persons = [
    { id: 1, name: 'Arto Hellas', number: '040-123456' },
    { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
    { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
]

const randomId = () => Math.floor(Math.random() * 100000000000)


app.get('/api/persons', (req, res) => {
  Item.find({}).then(items => {
    res.json(items)
  })
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response, next) => {
  Item.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  // Input validation:
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Name and/or number missing!' 
    })
  }
  if (persons.find(person => person.name === body.name)) {
      return response.status(400).json({ 
        error: 'name must be unique'
      })
  }

  const item = new Item({
    name: body.name,
    number: body.number
  })

  item.save().then(item => {
    response.json(item)
  }) 
})
  
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
