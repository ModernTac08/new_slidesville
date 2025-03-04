
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './App.css';
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, Navigate, Outlet } from "react-router-dom";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
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
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/signin');
  };

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
  
        {isLoggedIn ? (
          <button className="WhiteButton" onClick={handleLogout}>Sign Out</button>
        ) : (
          <Link to="/signin">Sign In</Link>
        )}

      </nav>
    </div>
  );

}

function AdminNav() {
  return (
    <div className='adminNavBar'>
      <p> Admin Dashboard</p>
      <nav>
        <Link to="/admin/featured">Featured Products</Link>
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
      .then(res => {
        const formattedProducts = res.data.map(product => ({
          ...product,
          imagePath: product.imagePath ? `http://localhost:8081${product.imagePath}` : ''
        }));
        setProducts(formattedProducts);
      })
      .catch(err => console.error('Error fetching featured products:', err));
  }, []);
  
  return (
    <div className="featuredContainer">
      <div>
        <p className='featuredTitle'>Featured Products</p>
        <section className='featuredSection'>
          {products.length === 0 ? (
            <p>No featured products available.</p>
          ) : (
            products.map((product, index) => (
              <div key={index} className="featuredItem">
                {product.imagePath && (
                  <img src={product.imagePath} alt="Featured" className='featuredImage' />
                )}
                <p>{product.description}</p>
              </div>
            ))
          )}
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
      {isAdmin() && <AdminNav />}
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
  const navigate = useNavigate();
  const [inflatables, setInflatables] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/get-inflatables')
      .then(res => {
        const formattedInflatables = res.data.map(item => ({
          ...item,
          imagePath: item.imagePath ? `${item.imagePath}` : ''
        }));
        setInflatables(formattedInflatables);
      })
      .catch(err => console.error('Error fetching inflatables:', err));
  }, []);

  return (
    <div className='page'>
      <Nav />
      {isAdmin() && <AdminNav />}
      <div className='content'>
        <section className='inflatableGrid'>
          {inflatables.length === 0 ? (
            <p>No inflatables available.</p>
          ) : (
            inflatables.map((inflatable, index) => (
              <div key={index} className="inflatableCard">
                {inflatable.imagePath && (
                  <img src={inflatable.imagePath} alt={inflatable.name} className='inflatableImage' />
                )}
                <h>{inflatable.name}</h>
                <p>${inflatable.price} a day</p>
                <button onClick={() => navigate("/booking")} className='BlueButton'>Book Now</button>
              </div>
            ))
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}

export function Booking() {
  return (
    <div className='page'>
      <Nav />
      {isAdmin() && <AdminNav />}
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
      {isAdmin() && <AdminNav />}
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

  const defaultProducts = [
    { id: 1, imagePath: '', previewUrl: '', description: '' },
    { id: 2, imagePath: '', previewUrl: '', description: '' },
    { id: 3, imagePath: '', previewUrl: '', description: '' }
  ];

  const [featuredProducts, setFeaturedProducts] = useState(defaultProducts);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/signin');
    }
  }, [navigate]);

  useEffect(() => {
    axios.get('http://localhost:8081/get-featured-products')
      .then((res) => {
        if (res.data.length > 0) {
          setFeaturedProducts(res.data.map(product => ({
            ...product,
            previewUrl: product.imagePath ? `http://localhost:8081${product.imagePath}` : ''
          })));
        } else {
          setFeaturedProducts(defaultProducts);
        }
      })
      .catch((err) => {
        console.error('Error fetching featured products:', err);
        setFeaturedProducts(defaultProducts);
      });
  }, []);

  const handleFileChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
        const newProducts = [...featuredProducts];
        newProducts[index] = {
            ...newProducts[index],
            previewUrl: URL.createObjectURL(file),
            imageFile: file
        };
        setFeaturedProducts(newProducts);
    }
};

  const handleDescriptionChange = (event, index) => {
    const newProducts = [...featuredProducts];
    newProducts[index].description = event.target.value;
    setFeaturedProducts(newProducts);
  };

  const handleSave = async () => {
    const uploadPromises = featuredProducts.map(async (product, index) => {
        const formData = new FormData();
        formData.append('id', product.id);
        formData.append('description', product.description);

        if (product.imageFile) {
            formData.append('image', product.imageFile);
        }

        return axios.post('http://localhost:8081/save-featured-products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(res => {
            const updatedProducts = [...featuredProducts];
            updatedProducts[index] = {
                ...updatedProducts[index],
                imagePath: res.data.imagePath,
                previewUrl: '',
                imageFile: null
            };
            setFeaturedProducts(updatedProducts);
        })
        .catch(err => console.error('Error saving featured product:', err));
    });

    await Promise.all(uploadPromises);
    alert('Featured Products Updated!');
};

  return (
    <div className='page'>
      <Nav />
      {isAdmin() && <AdminNav />}
      <div className='adminFeaturedContainer'>
        {featuredProducts.map((product, index) => (
          <div key={index} className="admin-featured-product">
            <h2>Featured Product {index + 1}:</h2>
            <div className='featuredInputFields'>

              <div className="fileUploadContainer">
                <input 
                  type="file" 
                  id={`fileInput-${index}`} 
                  className="hiddenFileInput"
                  onChange={(e) => handleFileChange(e, index)}
                  accept="image/*"
                />
                <label htmlFor={`fileInput-${index}`} className="WhiteButton FeaturedSubmit">
                  Upload Image
                </label>
                <span className="fileName">
                  {product.imagePath || product.previewUrl ? "" : "No file chosen"}
                </span>
              </div>

              {product.previewUrl && (
                <img src={product.previewUrl} alt="Preview" className="featuredProductPreview" />
              )}

              <div className='featuredDescription'>
                <label>Description:</label>
                <input 
                  type="text" 
                  value={product.description} 
                  onChange={(e) => handleDescriptionChange(e, index)} 
                />
              </div>
            </div>
          </div>
        ))}
        <button onClick={handleSave} className='BlueButton FeaturedSubmit'>Save Featured Products</button>
      </div>
      <div className='footer'>
        <Footer />
      </div>
    </div>
  );
}

export function AdminInflatables() {
  const navigate = useNavigate();
  const [inflatables, setInflatables] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/signin');
    }
  }, [navigate]);

  useEffect(() => {
    axios.get('http://localhost:8081/get-inflatables')
      .then(res => {
        const formattedInflatables = res.data.map(item => ({
          ...item,
          imagePath: item.imagePath ? `${item.imagePath}` : ''
        }));
        setInflatables(formattedInflatables);
      })
      .catch(err => console.error('Error fetching inflatables:', err));
  }, []);
  
  const handleInputChange = (e, index, field) => {
    const newInflatables = [...inflatables];
    newInflatables[index] = {
        ...newInflatables[index],
        [field]: e.target.value,
        imagePath: inflatables[index].imagePath
    };
    setInflatables(newInflatables);
};


const handleFileChange = (e, index) => {
  const file = e.target.files[0];
  if (file) {
      setInflatables(prevInflatables => {
          const newInflatables = [...prevInflatables];
          newInflatables[index] = {
              ...newInflatables[index],
              previewUrl: URL.createObjectURL(file),
              imageFile: file,
          };
          return newInflatables;
      });
  }
};




const addInflatable = () => {
  setInflatables(prevInflatables => [
      ...prevInflatables,
      { 
          id: null, 
          name: '', 
          price: '', 
          imagePath: '', 
          previewUrl: '', 
          imageFile: null 
      }
  ]);
};


  const handleDelete = (id, index) => {
    if (!id) {
      setInflatables(prev => prev.filter((_, i) => i !== index));
      return;
    }
  
    axios.delete(`http://localhost:8081/delete-inflatable/${id}`)
      .then(res => {
        if (res.data.success) {
          setInflatables(prev => prev.filter(item => item.id !== id));
        } else {
          console.error('Delete failed:', res.data.message);
        }
      })
      .catch(err => console.error('Error deleting inflatable:', err));
  };
  
  const handleSave = async () => {
    const uploadPromises = inflatables.map(async (inflatable, index) => {
        const formData = new FormData();

        if (inflatable.id) {
            formData.append('id', inflatable.id);
        }

        formData.append('name', inflatable.name);
        formData.append('price', inflatable.price);

        if (inflatable.imageFile) {
            formData.append('image', inflatable.imageFile);
        } else if (inflatable.imagePath) {
            formData.append('imagePath', inflatable.imagePath);
        }

        return axios.post('http://localhost:8081/save-inflatable', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(res => {
            setInflatables(prevInflatables => {
                const updatedInflatables = [...prevInflatables];
                updatedInflatables[index] = {
                    ...updatedInflatables[index],
                    id: res.data.id || updatedInflatables[index].id,
                    imagePath: res.data.imagePath || updatedInflatables[index].imagePath,
                    previewUrl: '',
                    imageFile: null,
                };
                return updatedInflatables;
            });
        })
        .catch(err => console.error('Error saving inflatable:', err));
    });

    await Promise.all(uploadPromises);
    alert('Inflatables Updated!');
};





  return (
    <div className='page'>
      <Nav />
      {isAdmin() && <AdminNav />}
      <div className='adminInflatablesContainer'>
        <h2>Inflatable Inventory</h2>
        <button onClick={addInflatable} className='BlueButton'>Add New</button>

        {inflatables.map((inflatable, index) => (
          <div key={index} className="admin-inflatable-item">

            <div className="inflatableDetails">
              <button className="deleteButton" onClick={() => handleDelete(inflatable.id, index)}>
                  <FontAwesomeIcon icon={faTrash} />
              </button>
              <div className='fileUploadContainer'>
              <input 
                  type="file" 
                  id={`inflatableIMGUpload-${index}`} 
                  className='hiddenFileInput' 
                  onChange={(e) => handleFileChange(e, index)} 
              />
              <label htmlFor={`inflatableIMGUpload-${index}`} className='WhiteButton'>
                  Upload Image
              </label>
              {inflatable.previewUrl ? (
                  <img src={inflatable.previewUrl} alt="Preview" className="inflatablePreview" />
              ) : (
                  inflatable.imagePath && <img src={inflatable.imagePath} alt="Saved" className="inflatablePreview" />
              )}
              </div>
              <label>Title:</label>
              <input type="text" value={inflatable.name} onChange={(e) => handleInputChange(e, index, 'name')} />

              <label>Price (This is per day):</label>
              <input type="number" value={inflatable.price} onChange={(e) => handleInputChange(e, index, 'price')} />
            </div>
          </div>
        ))}

        <button onClick={handleSave} className='BlueButton'>Save Inflatables</button>
      </div>
      <Footer />
    </div>
  );
}



export function AdminSchedule() {
  return (
    <div className='page'>
      <Nav />
      {isAdmin() && <AdminNav />}
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
      {isAdmin() && <AdminNav />}
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
