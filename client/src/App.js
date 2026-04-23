import { Route, Switch, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import PantryPage from './pages/PantryPage';
import RecipesPage from './pages/RecipesPage';
import WhatCanIMakePage from './pages/WhatCanIMakePage';
import HomePage from './pages/HomePage';
import RoadmapPage from './pages/RoadmapPage';
import SourcesPage from './pages/SourcesPage';

// Page title definitions
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

function App()
{
  return (
    <div id="gg-shell">

      {/* Left sidebar */}
      <Navbar />

      {/* Right: topbar + scrollable page panels */}
      <div id="gg-main">
        <TopBar />

        <div id="gg-content">
          <Switch>
            <Route path='/'             component={HomePage}        exact />
            <Route path='/pantry'       component={PantryPage}            />
            <Route path='/recipes'      component={RecipesPage}           />
            <Route path='/whatcanimake' component={WhatCanIMakePage}      />
            <Route path='/roadmap'      component={RoadmapPage}           />
            <Route path='/sources'      component={SourcesPage}           />
          </Switch>
        </div>
      </div>

      {/* Global toast container */}
      <div id="gg-toast-container"></div>
    </div>
  );
}

export default App;