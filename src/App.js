
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
import 'antd/dist/reset.css';
import axios from 'axios';


// This is the functiom checking if the user is an Admin

const isAdmin = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return token && role === 'admin';
};

const isUser = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return token && role === 'user';
};

const AUTO_LOGOUT_TIME = 15 * 60 * 1000;

const resetTimer = (handleLogout) => {
  if (logoutTimer) {
    clearTimeout(logoutTimer);
  }
  logoutTimer = setTimeout(() => {
    handleLogout();
  }, AUTO_LOGOUT_TIME);
};
let logoutTimer;

export const ProtectedAdminRoute = () => {
  return isAdmin() ? <Outlet /> : <Navigate to="/signin" />;
};

export const ProtectedUserRoute = () => {
  return isUser() ? <Outlet /> : <Navigate to="/signin" />;
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

  useEffect(() => {
    if (isLoggedIn) {
      resetTimer(handleLogout);
  
      const activityEvents = ['mousemove', 'keydown', 'click', 'scroll'];
  
      const reset = () => {resetTimer(handleLogout);};
  
      activityEvents.forEach(event => window.addEventListener(event, reset));
  
      return () => {
        activityEvents.forEach(event => window.removeEventListener(event, reset));
        if (logoutTimer) clearTimeout(logoutTimer);
      };
    }
  }, [isLoggedIn]);

  return (
    <div className='navBar'>
      <a href='/'>
      <img className='App-logo'
        src="/images/Logo.png"
        alt="Slidesville Logo"
        style={{ width: "14vh", height: "auto" }}
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

function UserNav() {
  return (
    <div className='adminNavBar'>
      <p> User Dashboard</p>
      <nav>
        <Link to="/user/bookings">My Bookings</Link>
        <Link to="/user/profile">My Account</Link>
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
      <form onSubmit={handleSignUp} className='SignInContainer'>
          <h2>Sign Up</h2>
          {message && <p>{message}</p>}
          <div className='loginInfo'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              placeholder='Email Address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='loginInfo'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type='submit' className='BlueButton loginBtn'>Sign Up</button>
          
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
      {isUser() && <UserNav />}
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
      {isUser() && <UserNav />}
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
  const navigate = useNavigate();
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [availableInflatables, setAvailableInflatables] = useState([]);
  const [selectedInflatable, setSelectedInflatable] = useState(null);

  const [startDate, endDate] = selectedDates;

  useEffect(() => {
    if (startDate && endDate) {
      axios
        .post("http://localhost:8081/get-available-inflatables", {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        })
        .then((res) => setAvailableInflatables(res.data))
        .catch((err) => console.error("Error fetching available inflatables:", err));
    }
  }, [startDate, endDate]);

  const handleBooking = () => {
    const token = localStorage.getItem("token");


    if (!token) {
        alert("Please sign in to book an inflatable.");
        navigate("/signin");
        return;
    }

    if (!selectedInflatable || !startDate || !endDate) {
        alert("Please select a date range and an inflatable.");
        return;
    }

    axios
        .post(
            "http://localhost:8081/book-inflatable",
            {
                inflatableId: selectedInflatable.id,
                startDate,
                endDate
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
            console.log("Booking Response:", res.data);
            alert("Booking successful!");
            navigate("/user/bookings");
        })
        .catch((err) => {
            console.error("Error booking inflatable:", err);
            alert("Error booking inflatable. Check the console for details.");
        });
};


  return (
    <div className="page">
      <Nav />
      {isAdmin() && <AdminNav />}
      {isUser() && <UserNav />}

      <div className="content">

        <div className="booking">

          <h2>Choose the date of your event</h2>

          <DatePicker
            selected={startDate}
            onChange={(dates) => setSelectedDates(dates)}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            className="datePicker"
          />
          
          <h3>Select Available Inflatable:</h3>
          <select onChange={(e) => setSelectedInflatable(JSON.parse(e.target.value))}>
            <option value="">-- Choose Inflatable --</option>
            {availableInflatables.map((inflatable) => (
              <option key={inflatable.id} value={JSON.stringify(inflatable)}>
                {inflatable.name} - ${inflatable.price}/day
              </option>
            ))}
          </select>

          <button onClick={handleBooking} className="BlueButton">
            Book Now
          </button>
        </div>
      </div>
      <div className="footer">
        <Footer />
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
      {isUser() && <UserNav />}
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
    axios.post("http://localhost:8081/login", { email, password })
        .then((res) => {
            if (res.data.success) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userId", String(res.data.id));
                localStorage.setItem("email", res.data.email);
                localStorage.setItem("role", res.data.role);
                navigate(res.data.role === "admin" ? "/admin/featured" : "/");
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





//These are the User Pages

export function UserBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
      axios.get("http://localhost:8081/user/bookings", {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => setBookings(res.data))
      .catch(err => console.error("Error fetching bookings:", err));
  }, []);

  const handleCancel = (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    const userId = parseInt(localStorage.getItem('userId'), 10);

    if (isNaN(userId)) {
        alert("Error: User ID is invalid. Please log in again.");
        return;
    }

    axios.delete(`http://localhost:8081/user/cancel-booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: { userId }
    })
    .then(res => {
        alert(res.data.message);
        setBookings(prev => prev.filter(booking => booking.id !== bookingId));
    })
    .catch(err => {
        console.error("Error canceling booking:", err);
        alert("Error canceling booking");
    });
};


  return (
    <div className='page'>
      <Nav />
      {isUser() && <UserNav />}
      <div className='content'>
          <h2>My Bookings</h2>

          {bookings.length === 0 ? (
              <p>No bookings found.</p>
          ) : (
              <ul className="booking-list">
                  {bookings.map(booking => (
                      <li key={booking.id} className="booking-item">
                          <p><strong>{booking.inflatableName}</strong></p>
                          <p>{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</p>
                          <button onClick={() => handleCancel(booking.id)} className="cancelButton">
                              Cancel Booking
                          </button>
                      </li>
                  ))}
              </ul>
          )}
        </div>
        <Footer />
    </div>
  );
}

export function UserProfile() {
  const [userData, setUserData] = useState({ firstName: '', lastName: '', phoneNumber: '', email: '' });
  const navigate = useNavigate();
  useEffect(() => {
    const userId = parseInt(localStorage.getItem("userId"), 10);

    if (isNaN(userId)) {
        console.error("Invalid userId in localStorage");
        return;
    }

    axios.get(`http://localhost:8081/user/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
        if (res.data.success === false) {
            console.error("Error:", res.data.message);
        } else {
            setUserData(res.data);
        }
    })
    .catch(err => console.error("Error fetching profile:", err));
}, []);


const handleUpdate = () => {
  const userId = localStorage.getItem('userId'); 

  if (!userId) {
      alert("Error: User ID is missing.");
      return;
  }

  axios.put('http://localhost:8081/user/update-profile', 
  {
      userId: parseInt(userId, 10),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
  }, 
  { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
  )
  .then(res => {
      console.log("Update successful:", res.data);
      alert(res.data.message);
  })
  .catch(err => {
      console.error("Error updating profile:", err);
      alert("Profile update failed.");
  });
};



  return (
      <div className="page">
        <Nav />
        {isUser() && <UserNav />}
        <div className='content'>
          <h2>My Account Information</h2>
          <div className='accountInfo'>
            <label>First Name:</label>
            <input type="text" value={userData.firstName} onChange={(e) => setUserData({ ...userData, firstName: e.target.value })} />

            <label>Last Name:</label>
            <input type="text" value={userData.lastName} onChange={(e) => setUserData({ ...userData, lastName: e.target.value })} />

            <label>Phone Number:</label>
            <input type="text" value={userData.phoneNumber} onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })} />

            <label>Email:</label>
            <input type="text" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
          </div>
          <button onClick={() => handleUpdate()} className="BlueButton AcountInfoButtons">Update Profile</button>
          <button onClick={() => navigate("/forgotpass")} className='BlueButton AcountInfoButtons'>Change Password</button>
        </div>
        <Footer />
      </div>
  );
}




export function App() {
  
  return <Home />
}

export default App;
