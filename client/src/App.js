import { Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar'
import Home from './pages/HomePage'
import Pantry from './pages/PantryPage'
import Recipes from './pages/RecipesPage'
import WhatCanIMake from './pages/WhatCanIMakePage'

function App() 
{
  return (
    <>
      <Navbar/>
        <Switch>
          <Route path='/' component={Home} exact/>
          <Route path='/pantry' component={Pantry} />
          <Route path='/recipes' component={Recipes} />
          <Route path='/whatcanimake' component={WhatCanIMake} />
        </Switch>
    </>
  );
}

export default App;
