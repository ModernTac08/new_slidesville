
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './App.css';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';


//These are the features used in the pages

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
        <p className='featuredTitle'>
          Featured Products
        </p>
        <section className='featuredSection'>

            <div className="featuredItem">
              <img
                src="/images/40 Foot Obstacle Course.jpg"
                alt="Slidesville Logo"
                className='featuredImage' >
              </img>
              <p>Our 40-Foot Obstacle Course</p>
            </div>

            <div className="featuredItem">
              <img
                src="/images/17' Octalous.jpg"
                alt="Slidesville Logo"
                className='featuredImage' >
              </img>
              <p>Octalous, Our 17 Foot Tall Water Slide!</p>
            </div>

            <div className="featuredItem">
              <img
                src="/images/Tropical Oasis.jpg"
                alt="Slidesville Logo"
                className='featuredImage' >
              </img>
              <p>Tropical Oasis, a bounce and slide combo!</p>
            </div>
        </section>
        <button onClick={() => navigate("/inflatables")} className='WhiteButton'>
            See All of Our Products
        </button>
      </div>
    </div>
  );

}

function AboutUs() {
  const navigate = useNavigate();
  return(
    <div className='aboutUsContainer'>
      <div className='aboutUs'>
        <p>Want to learn more about our inflatable family?</p>
      </div>
      <div className='aboutButton'>
        <button onClick={() => navigate("/about")} className='BlueButton'>
          About Us
        </button>
      </div>
    </div>  
  );
}

function BookingSelector(){
  const [selectedDates, setSelectedDates] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState('');

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

  };


  return (
    <div className='booking'>
      <h1>Choose the date of your event</h1>
      <div className='calendar'>
        <DatePicker
          selected={startDate}
          onChange={onChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          dateFormat='yyyy-MM-dd'
          className='datePicker'
          inline
        />
      </div>
      <div className='startTime'>
        <h2>Event Start Time</h2>
        <TimePicker
          className='StartTimePicker'
          value={startTime}
          onChange={setStartTime}
        />
      </div>
      <div className='endTime'>
        <h2>Event End Time</h2>
        <TimePicker
          className='EndTimePicker'
          value={endTime}
          onChange={setEndTime}
          
        />
      </div>
    </div>
  );
}







//These are the main pages

function Home() {
  const navigate = useNavigate();

  return ( 
    <div className='page'>

      <Nav />

      <div className='content'>
        <FeaturedProducts/>
        <div className='whatsAvailable'>
          <button onClick={() => navigate("/inflatables")}className='GreyButton'>
            See whats available for your event now!
          </button>
        </div>  
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
        <p> Inflatable Card is going to go on this page. I am working on learning that.</p>
        
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
        <BookingSelector/>
        
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
  const navigate = useNavigate();
  return (
    <div className='page'>
      <Nav />
      <div className='content'>
        <div className='aboutUsContainer'>
        <div className='aboutUs'>
          <p>
          We are a proud family-owned and operated inflatable rental business dedicated to bringing joy and excitement
          to our community. Our mission is to make every event memorable by adding a touch of fun and laughter for people of all ages. 
          Whether it's a birthday party, school event, or community celebration, we're here to help make your special moments even more unforgettable. 
          Serving our beloved small town is not just our business—it's our passion!
          </p>
        </div>
        <div className='aboutButton'>
        <button onClick={() => navigate("/booking")} className='BlueButton'>
          Book with us today!
        </button>
        </div>
        </div>
        
      </div>
      <div className='footer'>
        <Footer/>
      </div>
    </div>
    
  );

}







//These are the Admin pages

export function AdminFeaturedProducts() {
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

export function AdminInflatables() {
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

export function AdminSchedule() {
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

export function AdminAccounts() {
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
