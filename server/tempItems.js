const uuid = require('uuid');

const items = [
    {
        id: uuid.v4(),
        name: "Egg",
        quantity: 12
    },
    {
        id: uuid.v4(),
        name: "Milk",
        quantity: 1
    },
    {
        id: uuid.v4(),
        name: "Potato",
        quantity: 5
    }
]

module.exports = items;