// Note, this is also my DOCUMENTATION page
// Dependencies
import React, { Fragment } from 'react';

// I thought this would be a fun way for me to keep track of things, 
// make it feel more offical, and importantly learn Bootstrap
const Roadmap = () =>
{
    return (
        <Fragment>
            <div className="container py-3">
                <h1 className="mb-4">GroceryGenie Roadmap</h1>

                {/* Version card */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h2 className="h4 card-title mb-3">Current Version: <strong>v0.9.1</strong></h2>
                        <p className="card-text text-muted">
                            Core features are implemented and working, but data is still stored in temporary
                            server memory. MongoDB persistence will be before the official v1.0 release.
                        </p>
                    </div>
                </div>

                {/* Upcoming Features */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h2 className="h4 card-title">Upcoming Features (v1.0.0 Roadmap)</h2>

                        <ul className="list-group list-group-flush mt-3">
                            <li className="list-group-item">
                                <strong>1. Shopping List Page</strong><br />
                                A dedicated UI page for viewing, checking off, and managing required ingredients.
                            </li>

                            <li className="list-group-item">
                                <strong>2. Add Missing Ingredients to Shopping List</strong><br />
                                From the “What Can I Make?” page, instantly send missing ingredients to the shopping list.
                            </li>

                            <li className="list-group-item">
                                <strong>3. Post-Recipe Prompt</strong><br />
                                After making a recipe, ask: <em>“Add used ingredients to shopping list?”</em>
                            </li>

                            <li className="list-group-item rm-list-highlight">
                                <strong>4. MongoDB Integration</strong><br />
                                Store pantry, recipes, and shopping list in MongoDB for full persistence.
                            </li>

                            <li className="list-group-item">
                                <strong>5. Search & Filter</strong><br />
                                Search bar for recipes and pantry items + category filtering.
                            </li>

                            <li className="list-group-item">
                                <strong>6. Ingredient Persistence (Quantity = 0 but Saved)</strong><br />
                                Keep ingredients even when depleted and visually gray them out in the UI.
                            </li>

                            <li className="list-group-item">
                                <strong>7. Ingredient & Recipe Tags</strong><br />
                                Ingredients: poultry, seafood, frozen, boxed, produce, etc.<br />
                                Recipes: main dish, side dish, soup, multi-dish, etc.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Future Ideas */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h2 className="h5 card-title">Future Ideas (Post-1.0)</h2>

                        <ul className="list-group list-group-flush mt-3">
                            <li className="list-group-item">
                                • Export shopping list to PDF or phone-friendly view (no idea how to do that)
                            </li>
                            <li className="list-group-item">
                                • AI-suggested recipes based on partial ingredients
                            </li>
                            <li className="list-group-item">
                                • Auto-detect duplicates in pantry (e.g., “milk” vs “2% milk”) (maybe should be 1.0 not after)
                            </li>
                            <li className="list-group-item">
                                • Dark/ Light theme, or even more advanced themes like: Cozy, Modern, Cyberpunk, etc..
                            </li>
                            <li className="list-group-item">
                                • Ingredient DB so you can just press [+] on an ingredient instead of adding name, qty, and unit
                            </li>
                            <li className="list-group-item">
                                • Changelog system, could be better way to enhance roadmap
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bugs */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h2 className="h5 card-title">Bugs to fix</h2>

                        <ul className="list-group list-group-flush mt-3">
                            <li className="list-group-item">
                                • On mobile view the navbar is extended way to THICK (honestly there's no responsive design)
                            </li>
                            <li className="list-group-item">
                                • Duplicate pantry entries
                            </li>
                            <li className="list-group-item">
                                • On mobile view in Recipes, the 2 sides collide and overlap
                            </li>
                            <li className="list-group-item">
                                • The "Items in Pantry" currently only counts the items not the quantity of each item
                            </li>
                        </ul>
                    </div>
                </div>

                <h1 className="mb-4">Documentation Requirement</h1>
                {/* === HOW TO USE === */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h2 className="h4 card-title">How to Use GroceryGenie</h2>
        
                        <p>
                            GroceryGenie helps you track what's in your pantry, save your recipes, and figure out 
                            what you can cook with what you already have.
                        </p>
                
                        <h3 className="h5 mt-3">Pantry Page</h3>
                        <ul>
                            <li>Click "Add New Item" to add stuff to your pantry</li>
                            <li>Type in the name, how much you have, and the unit</li>
                            <li>Click "Edit" to change an item or "Delete" to remove it</li>
                        </ul>
                
                        <h3 className="h5 mt-3">Recipes Page</h3>
                        <ul>
                            <li>Click "Add New Recipe" to save a recipe</li>
                            <li>Add ingredients with the + button (each one needs a name, quantity, and unit)</li>
                            <li>Type instructions, one step per line</li>
                            <li>Click on a recipe name to see the full recipe</li>
                            <li>Click "Make Recipe" to automatically subtract ingredients from your pantry</li>
                        </ul>
                
                        <h3 className="h5 mt-3">What Can I Make?</h3>
                        <ul>
                            <li>Shows recipes you can make right now with your current pantry</li>
                            <li>Also shows recipes you're missing stuff for (and tells you what you need)</li>
                            <li>Check the box to only show recipes you can fully make</li>
                        </ul>
                
                        <h3 className="h5 mt-3">Home Page</h3>
                        <ul>
                            <li>Quick view of your stats (how many items, recipes, etc.)</li>
                            <li>Shows a list of what you can make today</li>
                        </ul>
                    </div>
                </div>

                {/* === BUILD INSTRUCTIONS === */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h2 className="h4 card-title">How to Build & Run</h2>
                        
                        <p><strong>You need:</strong></p>
                        <ul>
                            <li>Node.js installed (check with <code>node -v</code>)</li>
                            <li>A terminal</li>
                        </ul>
                
                        <p><strong>Steps:</strong></p>
                        <ol>
                            <li>Clone the repo: <code>git clone https://github.com/mackcutlerdev/Grocery-Genie</code></li>
                            <li>Go to the folder: <code>cd Grocery-Genie</code></li>
                            <li>Install client stuff: <code>cd client</code> then <code>npm install</code></li>
                            <li>Install server stuff: <code>cd ../server</code> then <code>npm install</code></li>
                            <li>Run it: <code>npm run dev</code></li>
                            <li>Open your browser to <code>http://localhost:3000</code></li>
                        </ol>
                    </div>
                </div>

                {/* === FEATURES FOR GRADING === */}
                <div className="card mb-5">
                    <div className="card-body">
                        <h2 className="h4 card-title">Features Implemented (for grading)</h2>
                        
                        <p><strong>Components & Organization:</strong></p>
                        <ul>
                            <li>7 components total (Navbar, Footer, HomeDashboard, Pantry, Recipes, WhatCanIMake, Roadmap)</li>
                            <li>Multiple components use state (useState hooks)</li>
                            <li>Props get passed from pages down to components</li>
                        </ul>
                
                        <p><strong>Functionality:</strong></p>
                        <ul>
                            <li>Add, Edit, Delete for pantry items</li>
                            <li>Add, Edit, Delete for recipes</li>
                            <li>Filter toggle on What Can I Make page</li>
                        </ul>
                
                        <p><strong>Routing:</strong></p>
                        <ul>
                            <li>6 different pages with React Router</li>
                            <li>Uses query params to link to specific recipes</li>
                        </ul>
                
                        <p><strong>Backend API:</strong></p>
                        <ul>
                            <li>10 routes total (5 for pantry, 5 for recipes)</li>
                            <li>GET routes for collections and individual items</li>
                            <li>POST, PUT, DELETE routes that work</li>
                            <li>Returns proper status codes (like 404 when stuff isn't found)</li>
                        </ul>
                
                        <p><strong>Database:</strong></p>
                        <ul>
                            <li>Currently using temp memory (resets on server restart)</li>
                            <li>MongoDB coming soon, I got backed up on getting logic to work</li>
                        </ul>

                        <p><strong>Cool (I think it's cool) stuff I added:</strong></p>
                        <ul>
                            <li>Smart ingredient matching - "Milk" matches "2% Milk" or "Whole Milk"</li>
                            <li>"Make Recipe" button subtracts ingredients from pantry automatically</li>
                            <li>Real-time calculation of what recipes you can make (kinda the whole point of the app)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Roadmap;
