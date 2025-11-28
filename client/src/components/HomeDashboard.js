// Dependencies
import React, { Fragment } from 'react';

// Main homepage component, doesn't do a lot but gives info immediately to the user
const HomeDashboard = (props) =>
{
    // All the props from HopePage, destructured for clarity and reuse
    // in order {still waiting on server, summary of numbers, the list of recipes, to jump to the open recipe, reload data from server cause sometimes it breaks???}
    const { isLoading, stats, makeableRecipes, onOpenRecipe, onReload } = props;

    return (
        <Fragment>
            {/*Main container for the doashboard*/}
            <div className="container">
                <h1 className="mb-4">GroceryGenie Dashboard</h1>

                {/* If the page is loading, show a loading message, could also use the spinner but I can't figure out how to make the spinner but if I do, replace it here */}
                {isLoading && <p>Loading data...</p>}

                {/* Raload button */}
                <div className="home-reload">
                    <button onClick={onReload} className="btn btn-outline-secondary">
                        Refresh from server
                    </button>
                </div>

                {/* Stats cards, the main point of the dashboard to quickly see your numbers, cause big num = epic */}
                <div className="home-stats">
                    {/* First card, how many items are in the pantry rn */}
                    <div className="home-stat-card card">
                        <div className="card-body">
                            <h3 className="card-title">Items in Pantry</h3>
                            <p className="home-stat-number card-text">
                                {stats.pantryCount}
                            </p>
                        </div>
                    </div>

                    {/* Second card, how many total recipes the user has saved */}
                    <div className="home-stat-card card">
                        <div className="card-body">
                            <h3 className="card-title">Total Recipes</h3>
                            <p className="home-stat-number card-text">
                                {stats.recipeCount}
                            </p>
                        </div>
                    </div>

                    {/* Third card, how many recipes can be currently made (WCIM stats)*/}
                    <div className="home-stat-card card">
                        <div className="card-body">
                            <h3 className="card-title">Recipes You Can Make Now</h3>
                            <p className="home-stat-number card-text">
                                {stats.makeableCount}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Scrollable "What Can I Make" list, basically a mini version of the WCIM page*/}
                <div className="mt-4">
                    <h2>What Can I Make Today?</h2>

                    {/* If there aren't any makeable pages and the loading is already over, tell the user they are dumb cause they don't have anything to make */}
                    {(!makeableRecipes || makeableRecipes.length === 0) && !isLoading && 
                    (
                        <p>No recipes are fully makeable yet. Add ingredients to your pantry!</p>
                    )}

                    <div className="home-scroll-box">
                        {/* Scroll box container for the makeable -btw it doesn't scroll yet, cause idk how to do that */}
                        {makeableRecipes && makeableRecipes.map((recipe) =>
                        (
                            <div key={recipe.id} className="home-scroll-row">
                                <span>{recipe.name}</span>
                                <button 
                                    onClick={() => onOpenRecipe(recipe.id)} 
                                    className="btn btn-sm btn-primary"
                                >
                                    Open Recipe
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default HomeDashboard;
