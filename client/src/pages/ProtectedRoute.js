import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// Wraps any <Route> that requires the user to be logged in.
// If there's no token in localStorage, redirects to /login.
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
                    : <Redirect to="/login" />
            }
        />
    );
};

export default ProtectedRoute;