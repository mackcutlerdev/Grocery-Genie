import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => 
{
    return (
        // Using Bootstrap styles for Navbar
        <nav>
            <div className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
                {/* container keeps stuff centered and not super wide or anything */}
                <div className="container nav-wrapper">
                    {/* app title on the left */}
                    <Link to="/" className="navbar-brand">
                        GroceryGenie
                    </Link>

                    {/* nav links on the right */}
                    <ul id="nav-mobile" className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link to='/' className="nav-link">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/pantry' className="nav-link">Pantry</Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/recipes' className="nav-link">Recipe Book</Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/whatcanimake' className="nav-link">What Can I Make?</Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/roadmap' className="nav-link">Roadmap/ Docs</Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/sources' className="nav-link">Sources</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;