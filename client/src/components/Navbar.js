import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => 
{
    return (
        <nav>
            <div className="nav-wrapper black">
                <Link to="/" className="brand-logo center">GroceryGenie</Link>
                <ul id="nav-mobile" className="right">
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/pantry'>Pantry</Link></li>
                    <li><Link to='/recipes'>Recipe Book</Link></li>
                    <li><Link to='/whatcanimake'>What Can I Make?</Link></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar