
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './App.css';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  faFacebook
  
} from "@fortawesome/free-brands-svg-icons";


function Nav() {
  return (
    <div className='navBar'>
      <a href='/'>
      <img className='App-logo'
        src="/images/Logo.png"
        alt="Slidesville Logo"
        style={{ width: "100px", height: "auto" }}
      />
      </a>
      <div className='headingTitle'>
        <h1>Slidesville</h1>
        <p>Your one stop shop for inflatable fun!!</p>
      </div>
      <div className='phoneNumber'>
        <p>
          <a href='tel:3212628831'> (321)262-8831 </a>
        </p>
      </div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/inflatables">Inflatables</Link>
        <Link to="/booking">Book Now</Link>
        <Link to="/signin">Sign In</Link>
      </nav>
    </div>
  );

}

function Footer() {
  const currentYear = new Date().getFullYear();
  return(
    <div className='footer'>
      <p>© {currentYear} Slidesville. All rights reserved.</p>
      <div className='footerContact'>
        <a href='tel:3212628831'> (321)262-8831 </a>
      
        <a href='mailto:info@slidesville.com'>info@slidesville.com</a>
      
        <a
          href='https://www.facebook.com/Slidesville'
          className='FacebookSocial'
        >
          <FontAwesomeIcon icon={faFacebook} size='2x' />
        </a>
      </div>
    </div>
  );
}

function FeaturedProducts() {
  const navigate = useNavigate();
  
  return (
    <div className="featuredContainer">
      <div>
        <p>
          Featured Products
        </p>
        <section>
          <div>
            <div>
              <img
                src="/images/40 Foot Obstacle Course.jpg"
                alt="Slidesville Logo"
                style={{ width: "100px", height: "auto" }} >
              </img>
              <p>Our 40-Foot Obstacle Course</p>
            </div>
            <div>
              <img
                src="/images/17' Octalous.jpg"
                alt="Slidesville Logo"
                style={{ width: "100px", height: "auto" }} >
              </img>
              <p>Octalous, Our 17 Foot Tall Water Slide!</p>
            </div>
            <div>
              <img
                src="/images/Tropical Oasis.jpg"
                alt="Slidesville Logo"
                style={{ width: "100px", height: "auto" }} >
              </img>
              <p>Tropical Oasis, a bounce and slide combo!</p>
            </div>
          </div>
          <button onClick={() => navigate("/inflatables")}>
            See All of Our Products
          </button>
        </section>
      </div>
    </div>
  );

}

function WhatsAvailable() {
  return (
    <div>
      <button onClick={() => ("")}>
            See whats available for your event now!
      </button>
    </div>
  );
}

function AboutUs() {
  const navigate = useNavigate();
  return(
    <div>
      <div>
        <p>Want to learn more about our inflatable family?</p>
      </div>

      <button onClick={() => navigate("/about")}>
        About Us
      </button>
    </div>  
  );
}




function Home() {
  return ( 
    <div className='page'>
      <Nav />
      <div className='content'>
        <FeaturedProducts/>
        <WhatsAvailable/>
        <AboutUs/>
        
      </div>
      <div className='footer'>
        <Footer/>
      </div>

    </div>
    
  );

}

export function Inflatables() {
  return (
    <div className='page'>
      <Nav />
      <div className='content'>
        
        
      </div>
      <div className='footer'>
        <Footer/>
      </div>
    </div>
      
    
  );

}


export function Booking() {
  return (
    <div className='page'>
      <Nav />
      <div className='content'>
        
        
      </div>
      <div className='footer'>
        <Footer/>
      </div>
    </div>
    
  );

}

export function SignIn() {
  return (
    <div className='page'>
      <Nav />
      <div className='content'>
        
        
      </div>
      <div className='footer'>
        <Footer/>
      </div>
    </div>
    
  );

}


export function About() {
  return (
    <div className='page'>
      <Nav />
      <div className='content'>
        
        
      </div>
      <div className='footer'>
        <Footer/>
      </div>
    </div>
    
  );

}







export function App() {
  
  return <Home />
}

export default App;
