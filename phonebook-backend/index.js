require('dotenv').config();
const express = require("express")
var morgan = require('morgan')

const Entry = require('./models/persons')

// const mongoose = require("mongoose")
// const password = process.env.MONGO_PASSWORD;

// const url = `mongodb+srv://mertsakar:${password}@noteapp.l6nhprm.mongodb.net/PhoneApp?retryWrites=true&w=majority`

// mongoose.set("strictQuery")
// mongoose.connect(url)

// const entrySchema = new mongoose.Schema({
//     name: String,
//     phoneNumber: Number
// })

// entrySchema.set('toJSON', {
//     transform: (document, returnedObject) => {
//       returnedObject.id = returnedObject._id.toString()
//       delete returnedObject._id
//       delete returnedObject.__v
//     }
//   })

// const Entry = mongoose.model("Entry", entrySchema)

const app = express();
app.use(express.json())

const cors = require('cors')
app.use(cors())

app.use(express.static('dist'))


morgan.token('reqbody', function getResBody(req) {
    if (req.method === "POST") {
        return JSON.stringify(req.body)
    } else {
        return ""
    }
})

app.use(morgan(':method :url :status :res[content-length] :response-time :reqbody'))


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
    Entry.find({}).then(entries => {
        res.json(entries)
    })
})

app.get("/info", (req, res) => {
    const count = persons.length;
    const timestamp = new Date();

    res.send(`<p>Phonebook has info for ${count} people</p><p>${timestamp}</p>`)
})

app.get("/api/persons/:id", (req, res) => {
    Entry.findById(req.params.id).then(entry => {
        res.json(entry)
      })
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)

    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    if (persons.find(item => item.name === request.body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const entry = new Entry({
        name: body.name,
        number: body.number
    })

    entry.save().then(savedEntry => {
        response.json(savedEntry)
    })
})


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})