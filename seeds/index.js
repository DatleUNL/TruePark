const mongoose = require('mongoose')
const Park = require('../models/park');
const cities = require('./cities')
const { descriptors, places } = require('./seedHelper')

mongoose.connect('mongodb://localhost:27017/true-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
})

const ranTitle = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Park.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 10 + 5);

        const newPark = new Park({
            title: `${ranTitle(descriptors)} ${ranTitle(places)}`,
            location: `${cities[random].state}, ${cities[random].city}`,
            image: 'https://source.unsplash.com/collection/8769153',
            price: price,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Et placeat corrupti amet vel, ducimus aliquid sed necessitatibus officia in? Facere minima incidunt saepe, porro similique quasi. Nobis aperiam quidem nemo.'
        })
        await newPark.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});

