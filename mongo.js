const mongoose = require('mongoose')

if (process.argv.length !== 5 && process.argv.length !== 3) {
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://bakki:${password}@cluster0.i7cox.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const itemSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Item = mongoose.model('Item', itemSchema)


if(process.argv.length === 5){
    
    const item = new Item({
        name: process.argv[3],
        number: process.argv[4],
    })
    
    item.save().then(response => {
         console.log(`added ${item.name} number ${item.number} to phonebook`)
         mongoose.connection.close()
    }) 
}
else if(process.argv.length === 3){
    
    Item.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(item => {
            console.log(item.name, item.number)
        })
        mongoose.connection.close()
    })
}
