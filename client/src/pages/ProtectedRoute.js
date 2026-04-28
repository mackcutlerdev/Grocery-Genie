import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// Wraps any <Route> that requires the user to be logged in.
// If there's no token in localStorage, redirects to /landing so new users see the landing page first.
// Usage in App.js:
//   <ProtectedRoute path="/pantry" component={PantryPage} />
const ProtectedRoute = ({ component: Component, ...rest }) =>
{
    const token = localStorage.getItem('gg-token');

    return (
        <Route
            {...rest}
            render={(props) =>
                token
                    ? <Component {...props} />
                    : <Redirect to="/landing" /> // was /login but now sends new users to landing page first
            }
        />
    );
};

export default ProtectedRoute;