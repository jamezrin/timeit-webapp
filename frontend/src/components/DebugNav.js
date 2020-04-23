import React from 'react';
import { Link } from 'react-router-dom';


export default function DebugNav() {
  return (
    <nav className="absolute bottom-0 py-2 px-4 m-3 z-10 rounded bg-white shadow-xl">
      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/test1">Test1</Link>
        </li>
        <li>
          <Link to="/home">Home</Link>
        </li>
      </ul>
    </nav>
  );
}
