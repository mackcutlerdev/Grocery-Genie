import { Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PantryPage from './pages/PantryPage';
import RecipesPage from './pages/RecipesPage';
import WhatCanIMakePage from './pages/WhatCanIMakePage';
import HomePage from './pages/HomePage';
import RoadmapPage from './pages/RoadmapPage';
import SourcesPage from "./pages/SourcesPage";

function App() 
{
  return (
    <>
      <Navbar/>
        <Switch>
          <Route path='/' component={HomePage} exact/>
          <Route path='/pantry' component={PantryPage} />
          <Route path='/recipes' component={RecipesPage} />
          <Route path='/whatcanimake' component={WhatCanIMakePage} />
          <Route path='/roadmap' component={RoadmapPage} />
          <Route path='/sources' component={SourcesPage} />
        </Switch>
      <Footer/>
    </>
  );
}

export default App;