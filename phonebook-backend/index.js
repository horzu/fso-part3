require('dotenv').config();
const express = require("express")
var morgan = require('morgan')
const cors = require('cors')
const Entry = require('./models/persons')
const app = express();

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] :response-time :reqbody'))
app.use(errorHandler) // this has to be the last loaded middleware.

morgan.token('reqbody', function getResBody(req) {
    if (req.method === "POST") {
        return JSON.stringify(req.body)
    } else {
        return ""
    }
})

app.get("/api/persons", (req, res) => {
    Entry.find({}).then(entries => {
        res.json(entries)
    })
})

app.get("/info", (req, res) => {
    Entry.find({}).then(entries => {
        const count = entries.length;
        const timestamp = new Date();

        res.send(`<p>Phonebook has info for ${count} people</p><p>${timestamp}</p>`)
    })
})

app.get("/api/persons/:id", (request, response, next) => {
    Entry.findById(request.params.id).then(entry => {
        if (entry) {
            response.json(entry)
        } else {
            response.status(404).end()
        }
    })
        .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
    Entry.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const entry = {
        name: body.name,
        phoneNumber: body.number,
    }

    Entry.findByIdAndUpdate(request.params.id, entry, { new: true })
        .then(updatedEntry => {
            response.json(updatedEntry)
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body;

    // if (!body.name || !body.number) {
    //     return response.status(400).json({
    //         error: 'name or number missing'
    //     })
    // }
    // if (persons.find(item => item.name === request.body.name)) {
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    const entry = new Entry({
        name: body.name,
        phoneNumber: body.number
    })

    entry.save().then(savedEntry => {
        response.json(savedEntry)
    })
})


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})