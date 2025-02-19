
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
import axios from 'axios'
import { useSearchParams } from "react-router-dom";


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

export function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUp = (e) => {
      e.preventDefault();
      axios.post('http://localhost:8081/signup', { email, password })
          .then((res) => setMessage(res.data.message || res.data.error))
          .catch((err) => setMessage(err.response?.data?.error || "Error signing up"));
  };

  return (
    <div className='page'>
      <Nav />
      <div className='content'>
      <form onSubmit={handleSignUp}>
          <h2>Sign Up</h2>
          {message && <p>{message}</p>}
          <div>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              placeholder='Email Address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type='submit'>Sign Up</button>
          
        </form>
      </div>
      <div className='footer'>
        <Footer />
      </div>
    </div>
  );
}

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
      event.preventDefault();
      axios.post('http://localhost:8081/forgot-password', { email })
          .then((res) => setMessage(res.data.message))
          .catch(() => setMessage("Error requesting password reset."));
  }

  return (
      <div>
          <h2>Forgot Password</h2>
          {message && <p>{message}</p>}
          <form onSubmit={handleSubmit}>
              <label>Email:</label>
              <input type="email" onChange={(e) => setEmail(e.target.value)} required />
              <button type="submit">Reset Password</button>
          </form>
      </div>
  );
}

export function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  function handleSubmit(event) {
      event.preventDefault();
      axios.post('http://localhost:8081/reset-password', { token, newPassword })
          .then((res) => setMessage(res.data.message))
          .catch(() => setMessage("Error resetting password."));
  }

  return (
      <div>
          <h2>Reset Password</h2>
          {message && <p>{message}</p>}
          <form onSubmit={handleSubmit}>
              <label>New Password:</label>
              <input type="password" onChange={(e) => setNewPassword(e.target.value)} required />
              <button type="submit">Update Password</button>
          </form>
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

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    axios
      .post('http://localhost:8081/login', { email, password })
      .then((res) => {
        if (res.data.message === "Login Successful") {
          setMessage("Login Successful");

          if (res.data.role === 'admin') {
            navigate('/admin');
          } else if (res.data.role === 'user') {
            navigate('/');
          }
        } else {
          setMessage(res.data.error || "Login failed. Please check your credentials.");
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("An error occurred while trying to log in.");
      });
  }

  return (
    <div className='page'>
      <Nav />
      <div className='content'>
        <form onSubmit={handleSubmit} className='SignInContainer'>
          <h2>LOGIN</h2>
          {message && <p className='errorMessage'>{message}</p>}
          <div className='loginInfo'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              placeholder=''
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='loginInfo'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              placeholder=''
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type='submit' className='BlueButton loginBtn'>Login</button>
          <button onClick={() => navigate("/forgotpass")} className='forgotPasswordBtn'>Forgot Password</button>
          <p className='signUpText'>
            Need an account?<button onClick={() => navigate("/signup")} className='signUpBtn'>SIGN UP</button>
          </p>

        </form>
      </div>
      <div className='footer'>
        <Footer />
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
