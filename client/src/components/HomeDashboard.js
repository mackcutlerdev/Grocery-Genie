// Dependencies
import React, { Fragment } from 'react';

// Main home page component, doesn't do a lot but gives info immediately to the user
const HomeDashboard = (props) =>
{
    // All the props from HopePage, destructured for clarity and reuse
    // in order {still waiting on server, summary of numbers, the list of recipes, to jump to the open recipe, reload data from server cause sometimes it breaks???}
    const { isLoading, stats, makeableRecipes, onOpenRecipe, onReload } = props;

    return (
        <Fragment>
            {/*Main container for the doashboard*/}
            <div className="container">
                <h1>GroceryGenie Dashboard</h1>

                {/* If the page is loading, show a loading message, could also use the spinner but I can't figure out how to make the spinner but if I do, replace it here */}
                {isLoading && <p>Loading data...</p>}

                {/* Raload button */}
                <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
                    <button onClick={onReload}>
                        Refresh from server
                    </button>
                </div>

                {/* Stats cards, the main point of the dashboard to quickly see your numbers, cause big num = epic */}
                <div
                    className="home-stats"
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        marginBottom: '2rem',
                        flexWrap: 'wrap'
                    }}
                >
                    {/* First card, how many items are in the pantry rn */}
                    <div
                        style={{
                            flex: '1 1 150px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            padding: '1rem'
                        }}
                    >
                        <h3>Items in Pantry</h3>
                        <p style={{ fontSize: '1.5rem', margin: 0 }}>
                            {stats.pantryCount}
                        </p>
                    </div>

                    {/* Second card, how many total recipes the user has saved */}
                    <div
                        style={{
                            flex: '1 1 150px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            padding: '1rem'
                        }}
                    >
                        <h3>Total Recipes</h3>
                        <p style={{ fontSize: '1.5rem', margin: 0 }}>
                            {stats.recipeCount}
                        </p>
                    </div>

                    {/* Third card, how many recipes can be currently made (WCIM stats)*/}
                    <div
                        style={{
                            flex: '1 1 150px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            padding: '1rem'
                        }}
                    >
                        <h3>Recipes You Can Make Now</h3>
                        <p style={{ fontSize: '1.5rem', margin: 0 }}>
                            {stats.makeableCount}
                        </p>
                    </div>
                </div>

                {/* Scrollable "What Can I Make" list, basically a mini version of the WCIM page*/}
                <div>
                    <h2>What Can I Make Today?</h2>

                    {/* If there aren't any makeable pages and the loading is already over, tell the user they are dumb cause they don't have anything to make */}
                    {(!makeableRecipes || makeableRecipes.length === 0) && !isLoading && (
                        <p>No recipes are fully makeable yet. Add ingredients to your pantry!</p>
                    )}

                    <div
                        style={{
                            maxHeight: '250px',
                            overflowY: 'auto',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            padding: '0.5rem',
                            marginTop: '0.5rem'
                        }}
                    >
                        {/* Scroll box container for the makeable -btw it doesn't scroll yet, cause idk how to do that */}
                        {makeableRecipes && makeableRecipes.map((recipe) =>
                        (
                            <div
                                key={recipe.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.5rem 0',
                                    borderBottom: '1px solid #eee'
                                }}
                            >
                                <span>{recipe.name}</span>
                                <button onClick={() => onOpenRecipe(recipe.id)}>
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
