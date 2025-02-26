
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './App.css';
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, Navigate, Outlet } from "react-router-dom";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';
import axios from 'axios';


// This is the functiom checking if the user is an Admin

const isAdmin = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return token && role === 'admin';
};

export const ProtectedAdminRoute = () => {
  return isAdmin() ? <Outlet /> : <Navigate to="/signin" />;
};


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

function AdminNav() {
  return (
    <div className='adminNavBar'>
      <nav>
        <Link to="/admin/dashboard">Home</Link>
        <Link to="/admin/inflatables">Inflatables</Link>
        <Link to="/admin/schedule">Schedule</Link>
        <Link to="/admin/accounts">Accounts</Link>
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
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/get-featured-products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching featured products:', err));
  }, []);
  
  return (
    <div className="featuredContainer">
      <div>
        <p className='featuredTitle'>
          Featured Products
        </p>
        <section className='featuredSection'>
          {products.map((product, index) => (
            <div key={index} className="featuredItem">
              {product.image && <img src={product.image} alt="Featured" className='featuredImage' />}
              <p>{product.description}</p>
            </div>
          ))}
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
    <div className='page'>
    <Nav />
      <div className='content'>         
          <form onSubmit={handleSubmit} className='SignInContainer'>
            <h2>Forgot Password</h2>
            {message && <p>{message}</p>}
            <div className='loginInfo'>
              <label>Email:</label>
              <input type="email" onChange={(e) => setEmail(e.target.value)} required />
            </div> 
            <button type="submit" className='BlueButton loginBtn'>Reset Password</button>
          </form>
      </div>
      <div className='footer'>
        <Footer />
      </div>    
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
      <div className='page'>
        <Nav />
        <div className='content'>
          <form onSubmit={handleSubmit} className='SignInContainer'>
            <h2>Reset Password</h2>
            {message && <p>{message}</p>}
            <div className='loginInfo'>
              <label>New Password:</label>
              <input type="password" onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
              <button type="submit" className='BlueButton loginBtn'>Update Password</button>
          </form>
        </div>  
        <div className='footer'>
        <Footer />
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
          <button onClick={() => navigate("/booking")}className='GreyButton'>
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
        if (res.data.success) {
          localStorage.setItem('token', res.data.token); 
          localStorage.setItem('role', res.data.role); 
          setMessage(res.data.message || "Login Successful");

          if (res.data.role === 'admin') {
            navigate('/admin/featured');
          } else {
            navigate('/');
          }
        } else {
          setMessage(res.data.message || "Login failed. Please check your credentials.");
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
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([
    { id: 1, image: '', description: '' },
    { id: 2, image: '', description: '' },
    { id: 3, image: '', description: '' },
  ]);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/signin');
    }
  }, [navigate]);

  const handleFileChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const newProducts = [...featuredProducts];
      newProducts[index].image = URL.createObjectURL(file);
      setFeaturedProducts(newProducts);
    }
  };

  const handleDescriptionChange = (event, index) => {
    const newProducts = [...featuredProducts];
    newProducts[index].description = event.target.value;
    setFeaturedProducts(newProducts);
  };

  const handleSave = () => {
    axios.post('http://localhost:8081/save-featured-products', { products: featuredProducts })
      .then(() => alert('Featured Products Updated'))
      .catch(err => console.error('Error saving featured products:', err));
  };

  return (
    <div className='page'>
      <Nav />
      <div className='content'>
        {featuredProducts.map((product, index) => (
          <div key={index} className="featured-product">
            <h2>Featured Product {index + 1}:</h2>
            <label>Image:</label>
            <input type="file" onChange={(e) => handleFileChange(e, index)} />
            {product.image && <img src={product.image} alt="Uploaded Preview" className='featuredProductPreview'/>}
            <label>Description:</label>
            <input type="text" value={product.description} onChange={(e) => handleDescriptionChange(e, index)} />
          </div>
        ))}
        <button onClick={handleSave}>Save Featured Products</button>
      </div>
      <div className='footer'>
        <Footer />
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
