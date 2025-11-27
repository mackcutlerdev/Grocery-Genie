import { Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar'
import Pantry from './pages/PantryPage'
import Recipes from './pages/RecipesPage'
import WhatCanIMake from './pages/WhatCanIMakePage'
import HomePage from './pages/HomePage';

function App() 
{
  return (
    <>
      <Navbar/>
        <Switch>
          <Route path='/' component={HomePage} exact/>
          <Route path='/pantry' component={Pantry} />
          <Route path='/recipes' component={Recipes} />
          <Route path='/whatcanimake' component={WhatCanIMake} />
        </Switch>
    </>
  );
}

export default App;