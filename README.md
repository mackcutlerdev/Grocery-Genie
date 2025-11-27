# GroceryGenie

GroceryGenie’s goal is an app that tracks items in your pantry at home, manage your recipes, and have a “What can I make?” matching system for people who don’t have time or don’t want to spend time trying to figure out what to cook at the end of a long day.

## Requirements

- Must have Node.js installed on your system.
  > you can install it from this link: https://nodejs.org/en/download <br> You can check if it's installed using `node -v` or `npm -v` in any terminal.
- Must have a modern web browser.
  > Chrome, Firefox, Edge, etc.
- A terminal or command prompt to use the build cmds.
- Git if you are cloning the project (**RECOMMENDED**) however you can also download the .zip instead.

## How to build

1. Open a terminal in whatever folder you want the project to live in, eg: `cd "C:\Projects"`.
2. Clone this repository using: `git clone https://github.com/mackcutlerdev/Grocery-Genie`
3. Then navigate to the project root, and which should just be `cd Grocery-Genie` if you are still in the same terminal.
4. From the project root, go into the client folder to install dependencies using: `cd client` -> `npm install`.
5. When that finishes, go into the server folder and install there too: `cd ../server` -> `npm install`.
6. Once both client and server have had npm install ran, the project is built and can be run.

## How to run

1. Open a terminal in the project root, then navigate into the server folder using `cd server`.
2. Start the dev setup (this runs the server and the React client together): `npm run dev`.
3. Your bwoser should open to the React app (usually http://localhost:3000). The API server runs on http://localhost:5000.
   (if it fails to start, check that both ports are open on your device).

### Extra notes

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
