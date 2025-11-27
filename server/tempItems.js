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
    },
    {
        id: uuid.v4(),
        name: "Butter",
        quantity: 4,
        unit: "Cup"
    },
    {
        id: uuid.v4(),
        name: "Salt",
        quantity: 260,
        unit: "g"
    },
    {
        id: uuid.v4(),
        name: "Kraft Dinner",
        quantity: 2,
        unit: "Box"
    },
    {
        id: uuid.v4(),
        name: "Margarine",
        quantity: 29,
        unit: "tbsp"
    },
]

module.exports = items;