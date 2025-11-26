const uuid = require('uuid');

const items = [
    {
        id: uuid.v4(),
        name: "Egg",
        quantity: 12,
        unit: "Unit"
    },
    {
        id: uuid.v4(),
        name: "Milk",
        quantity: 1,
        unit: "L"
    },
    {
        id: uuid.v4(),
        name: "Potato",
        quantity: 5,
        unit: "Unit"
    }
]

module.exports = items;