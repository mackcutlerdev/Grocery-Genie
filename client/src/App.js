import { Route, Switch, useLocation, Redirect } from 'react-router-dom';
import './App.css';
import Navbar         from './components/Navbar';
import ProtectedRoute from './pages/ProtectedRoute';
import LoginPage      from './pages/LoginPage';
import PantryPage     from './pages/PantryPage';
import RecipesPage    from './pages/RecipesPage';
import WhatCanIMakePage from './pages/WhatCanIMakePage';
import HomePage       from './pages/HomePage';
import RoadmapPage    from './pages/RoadmapPage';
import SourcesPage    from './pages/SourcesPage';

const PAGE_TITLES = {
    '/':             { italic: 'Dashboard',  strong: null    },
    '/pantry':       { italic: 'Pantry',     strong: null    },
    '/recipes':      { italic: 'Recipe',     strong: 'Book'  },
    '/whatcanimake': { italic: 'What Can I', strong: 'Make?' },
    '/roadmap':      { italic: 'Roadmap',    strong: null    },
    '/sources':      { italic: 'Sources',    strong: null    },
};

function TopBar()
{
    const location = useLocation();
    const title    = PAGE_TITLES[location.pathname] || { italic: 'GroceryGenie', strong: null };

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

function App()
{
    const token = localStorage.getItem('gg-token');

    return (
        <Switch>
            {/* Login page — full screen, no sidebar, no topbar */}
            <Route path="/login">
                {token
                    ? <Redirect to="/" />      // already logged in, go home
                    : <LoginPage />
                }
            </Route>

            {/* All other routes — protected, render inside the shell */}
            <Route>
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
                                <ProtectedRoute path="/roadmap"      component={RoadmapPage}           />
                                <ProtectedRoute path="/sources"      component={SourcesPage}           />
                            </Switch>
                        </div>
                    </div>

                    <div id="gg-toast-container"></div>
                </div>
            </Route>
        </Switch>
    );
}

export default App;