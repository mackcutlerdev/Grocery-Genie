import { Route, Switch, useLocation, Redirect } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import ProtectedRoute from './pages/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import PantryPage from './pages/PantryPage';
import RecipesPage from './pages/RecipesPage';
import WhatCanIMakePage from './pages/WhatCanIMakePage';
import HomePage from './pages/HomePage';
import ShoppingListPage from './pages/ShoppingListPage';
import RoadmapPage from './pages/RoadmapPage';
import SourcesPage from './pages/SourcesPage';

// Maps route paths to top bar titles. The title is split into 2 parts, like you see on the top bar :/
const PAGE_TITLES = 
{
    '/':             { italic: 'Dashboard',  strong: null    },
    '/pantry':       { italic: 'Pantry',     strong: null    },
    '/recipes':      { italic: 'Recipe',     strong: 'Book'  },
    '/whatcanimake': { italic: 'What Can I', strong: 'Make?' },
    '/shoppinglist': { italic: 'Shopping',   strong: 'List'  },
    '/roadmap':      { italic: 'Roadmap',    strong: null    },
    '/sources':      { italic: 'Sources',    strong: null    },
};

// Function to actaully render the top bar. Reads the curr path and looks up the title, if no title just do "GroceryGenie"
function TopBar()
{
    const location = useLocation();
    const title = PAGE_TITLES[location.pathname] || { italic: 'GroceryGenie', strong: null };

    return (
        <div id="gg-topbar">
            <div className="gg-topbar-title">
                <em>{title.italic}</em>
                {title.strong && <> <strong>{title.strong}</strong></>}
            </div>
            <div className="gg-topbar-right"></div>
        </div>
    );
}

// The shell layout: sidebar + topbar + content
// Only renders when the user is on a non-login route (already logged in)
function AppShell()
{
    return (
        <div id="gg-shell">
            <Navbar />
            <div id="gg-main">
                <TopBar />
                <div id="gg-content">
                    <Switch>
                        <ProtectedRoute path="/"             component={HomePage}        exact />
                        <ProtectedRoute path="/pantry"       component={PantryPage}            />
                        <ProtectedRoute path="/recipes"      component={RecipesPage}           />
                        <ProtectedRoute path="/whatcanimake" component={WhatCanIMakePage}      />
                        <ProtectedRoute path="/shoppinglist" component={ShoppingListPage}      />
                        <ProtectedRoute path="/roadmap"      component={RoadmapPage}           />
                        <ProtectedRoute path="/sources"      component={SourcesPage}           />
                    </Switch>
                </div>
            </div>
            <div id="gg-toast-container"></div>
        </div>
    );
}

// The main app bit. Decides whether to show the login page or the shell based on the route.
function App()
{
    return (
        <Switch>
            {/* /login is fully public and renders outside the shell */}
            <Route path="/login" component={LoginPage} />

            {/* public landing page, no auth */}
            <Route path="/landing" component={LandingPage} />

            {/* Everything else goes through the shell.
                ProtectedRoute inside AppShell handles the redirect
                to /landing if there's no token, no redirect logic here. */}
            <Route component={AppShell} />
        </Switch>
    );
}

export default App;