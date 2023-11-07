const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
}

const password = process.argv[2]

const url = `mongodb+srv://mertsakar:${password}@noteapp.l6nhprm.mongodb.net/PhoneApp?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)
mongoose.connect(url)

const entrySchema = new mongoose.Schema({
    name: String,
    phoneNumber: Number,
})

const Entry = mongoose.model("Entry", entrySchema)

if (process.argv.length > 3) {
    const entry = new Entry({
        name: process.argv[3],
        phoneNumber: process.argv[4],
    })

    entry.save().then(result => {
        console.log(`added ${entry.name} number ${entry.phoneNumber} to phonebook`)
        mongoose.connection.close()
    })
} else {
    Entry.find({}).then(result => {
        console.log("phonebook:");
        result.forEach(entry => {
            console.log(`${entry.name} ${entry.phoneNumber}`)
        })
        mongoose.connection.close()
    })
}

