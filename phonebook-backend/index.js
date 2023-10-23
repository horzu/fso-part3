const express = require("express")

const app = express();
app.use(express.json())

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get("/api/persons", (req, res) => {
    res.json(persons)
})

app.get("/info", (req, res) => {
    const count = persons.length;
    const timestamp = new Date();

    res.send(`<p>Phonebook has info for ${count} people</p><p>${timestamp}</p>`)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)

    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)

    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (request, response) => {
    if (!request.body.name || !request.body.number) {
        return response.status(400).json({ 
          error: 'name or number missing' 
        })
    }
    if(persons.find(item => item.name === request.body.name)){
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }

    const newId = Math.floor(Math.random()*10000000);
  
    const person = request.body
    person.id = newId
  
    persons = persons.concat(person)
  
    response.json(person)
})


const port = 3001;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})