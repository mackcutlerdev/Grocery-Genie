const uuid = require('uuid');

const recipes = [
    {
        id: uuid.v4(),
        name: "Mashed Potatoes",
        ingredients: [
            { name: "Yukon Gold Potato", quantity: 4, unit: "Unit"},
            { name: "2% Milk", quantity: 1, unit: "Cup"},
            { name: "Unsalted Butter", quantity: 1, unit: "Cup"},
            { name: "Salt", quantity: 1, unit: "g"}
        ],
        instructions: [
            "Fill a large pot with cold water.",
            "Add 4 unpeeled potatoes to the filled pot (make sure they're covered in water).",
            "Turn on the heat to high, and boil the potatoes for 45 minutes or until tender.",
            "Drain the water from the pot.",
            "Peel the potatoes, removing all peel.",
            "Mash the peeled potatoes in the pot.",
            "Add warmed milk to the mash, and mix.",
            "Add room temperature butter to the mash, and mix.",
            "Salt to taste, and ready to serve!"
        ]
    },
    {
        id: uuid.v4(),
        name: "Chili",
        ingredients: [
            {name: "Crushed Tomatoes", quantity: 2, unit: "Can"},
            {name: "Tomato Soup", quantity: 1, unit: "Can"},
            {name: "Tomato Paste", quantity: 1, unit: "Can"},
            {name: "Canned Corn", quantity: 1, unit: "Can"},
            {name: "Canned Mushroom", quantity: 1, unit: "Can"},
            {name: "Ground Beef", quantity: 1.2, unit: "Kg"},
            {name: "Chili Powder", quantity: 2, unit: "Tbsp"},
            {name: "Onion Powder", quantity: 1, unit: "Tbsp"},
            {name: "Garlic Powder", quantity: 1, unit: "Tbsp"},
            {name: "Salt", quantity: 0.5, unit: "Tbsp"},
            {name: "Brown Sugar", quantity: 2, unit: "Tbsp"}
        ],
        instructions: [
            "Brown the ground beef in a large pot.",
            "Add all of the crushed tomatoes to the pot.",
            "Add the tomato soup to the pot.",
            "Add the tomato soup to the pot.",
            "Add the corn to the pot.",
            "Add the mushroom to the pot.",
            "Add all the spices to the mix.",
            "Stir thourghougly and turn down the heat to a simmer.",
            "Let the pot simmer for 2 hours.",
            "Ready to serve!"
        ]
    },
    {
        id: uuid.v4(),
        name: "Oreo Truffles",
        ingredients: [
            {name: "Oreos", quantity: 36, unit: "Unit"},
            {name: "Cream Cheese", quantity: 250, unit: "g"},
            {name: "Bakers Semi-Sweet Chocolate", quantity: 2, unit: "Unit"}
        ],
        instructions: [
            "Put all Oreos into a completely sealed ziplock baggie.",
            "Smash/ Crush the Oreos into crumbs.",
            "Mix the Oreo crumbs with the Cream Cheese until fully combined.",
            "Roll the mixature into small balls.",
            "Put all the balls onto a baking sheet with parchament paper.",
            "Put the baking sheet into the fridge for at-least 2 hours.",
            "Melt the semi-sweet chocolate using a double boiler.",
            "Prepare a second baking sheet with more parchament paper.",
            "Dip the cold truffle balls into the melted chocolate, and put them on the new tray",
            "After all the truffles are dipped, put the tray into the fridge overnight.",
            "Make sure they're cold, and ready to serve!"
        ]
    },
    {
        id: uuid.v4(),
        name: "Kraft Dinner Mac n' Cheese",
        ingredients: [
            {name: "Kraft Dinner", quantity: 1, unit: "Box"},
            {name: "Milk", quantity: 0.5, unit: "Cup"},
            {name: "Margarine", quantity: 1.5, unit: "tbsp"}
        ],
        instructions: [
            "Boil a pot of 6 cups of water until rolling.",
            "Add the dry macaroni from the box of Kraft Dinner.",
            "Boil the macaroni for 7 minutes.",
            "After 7 minutes, drain the cooked pasta from the water, and put it back in the pot.",
            "Add the milk to the pot, and mix with the pasta.",
            "Add the margarine to the pot, and mix with the pasta.",
            "Open the cheese mix from the KD box, and add to the pasta and mix.",
            "Plate and serve!"
        ]
    }
]

module.exports = recipes;