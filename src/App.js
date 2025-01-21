
import './App.css';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


function Nav() {
  return (
    
    <div>
      
      <h1>Slidesville</h1>
      <h2>Your one stop shop for inflatable fun!!</h2>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/inflatables">Inflatables</Link>
        <Link to="/booking">Book Now</Link>
        <Link to="/signin">Sign In</Link>
      </nav>
    </div>
  );

}


function Home() {
  return ( 
    <Nav />
      
    
  );

}

export function Inflatables() {
  return (
    <Nav />
      
    
  );

}


export function Booking() {
  return (
    <Nav />
    
  );

}

export function SignIn() {
  return (
    <Nav />
    
  );

}


export function About() {
  return (
    <Nav />
    
  );

}







export function App() {
  return <Home />
}

export default App;
