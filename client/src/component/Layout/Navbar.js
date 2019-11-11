import React from 'react';
import {Link} from 'react-router-dom'

export const Navbar = () => {
    return (
       <nav className="navbar bg-dark">
           <h2>
               <Link to="/"><i className="fas fa-code"></i>Dev Blog</Link>
           </h2>
           <ul>
               <li>
                   <Link to="profiles.html">Developers</Link>
               </li>
               <li>
                   <Link to="/register">Register</Link>
               </li>
               <li>
                   <Link to="/login">Login</Link>
               </li>
           </ul>
       </nav>
    )
}
