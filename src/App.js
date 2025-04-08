
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './App.css';
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, Navigate, Outlet, useParams } from "react-router-dom";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import 'antd/dist/reset.css';
import axios from 'axios';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

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

const localizer = momentLocalizer(moment);


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
      .then((res) => {
        if (res.data.success) {
          axios.post('http://localhost:8081/login', { email, password })
            .then((res) => {
              if (res.data.success) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userId", String(res.data.id));
                localStorage.setItem("email", res.data.email);
                localStorage.setItem("role", res.data.role);

                const intent = JSON.parse(localStorage.getItem("bookingIntent"));

                if (intent) {
                  localStorage.removeItem("bookingIntent");
                  axios.post(
                    "http://localhost:8081/book-inflatable",
                    {
                      inflatableId: intent.inflatableId,
                      startDate: intent.startDate,
                      endDate: intent.endDate
                    },
                    { headers: { Authorization: `Bearer ${res.data.token}` } }
                  )
                  .then(() => {
                    alert("Booking successful!");
                    navigate("/user/bookings");
                  })
                  .catch((err) => {
                    console.error("Booking error after signup:", err);
                    alert("Signup successful, but booking failed.");
                    navigate("/booking");
                  });
                } else {
                  navigate(res.data.role === "admin" ? "/admin/featured" : "/");
                }
              }
            });
        } else {
          setMessage(res.data.message || "Signup failed. Please try again.");
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("Error signing up.");
      });
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='loginInfo'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
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
    const intent = JSON.parse(localStorage.getItem("bookingIntent"));
    if (intent) {
      setSelectedDates([new Date(intent.startDate), new Date(intent.endDate)]);
      setSelectedInflatable(intent.inflatable);
    }
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      axios
        .post("http://localhost:8081/get-available-inflatables", {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        })
        .then((res) => {
          setAvailableInflatables(res.data);
        })
        .catch((err) =>
          console.error("Error fetching available inflatables:", err)
        );
    }
  }, [startDate, endDate]);

  const handleBooking = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please sign in to book an inflatable.");
      const bookingIntent = {
        inflatableId: selectedInflatable.id,
        startDate,
        endDate,
      };
      localStorage.setItem("bookingIntent", JSON.stringify(bookingIntent));
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
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
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
          <select
            onChange={(e) => setSelectedInflatable(JSON.parse(e.target.value))}
            value={selectedInflatable ? JSON.stringify(selectedInflatable) : ""}
          >
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

          const intent = JSON.parse(localStorage.getItem("bookingIntent"));

          if (intent) {
            localStorage.removeItem("bookingIntent");
            axios.post(
              "http://localhost:8081/book-inflatable",
              {
                inflatableId: intent.inflatableId,
                startDate: intent.startDate,
                endDate: intent.endDate
              },
              { headers: { Authorization: `Bearer ${res.data.token}` } }
            )
            .then(() => {
              alert("Booking successful!");
              navigate("/user/bookings");
            })
            .catch((err) => {
              console.error("Booking error after login:", err);
              alert("Login successful, but booking failed.");
              navigate("/booking");
            });
          } else {
            navigate(res.data.role === "admin" ? "/admin/featured" : "/");
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='loginInfo'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
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
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
          console.error("No authentication token found.");
          alert("Session expired. Please log in again.");
          window.location.href = "/signin";
          return;
      }

      axios.get(`http://localhost:8081/admin/get-bookings`, {
          headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
          console.log("Fetched bookings:", res.data);
          setBookings(res.data);
      })
      .catch(err => {
          console.error("Error getting bookings:", err);
      });
  }, []);

  const events = bookings.map(booking => {
    if (!booking.startDate || !booking.endDate) {
      console.error("Invalid booking data:", booking);
      return null;
    }
  
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    start.setDate(start.getDate() + 1);
    end.setDate(end.getDate() + 1);

  
    const fullName = `${booking.firstName || "No Name"} ${booking.lastName || ""}`.trim();
    const email = booking.userEmail || "No Email";
  
    return {
      id: booking.id,
      title: `${booking.inflatableName} (${fullName} - ${email})`,
      start,
      end,
      allDay: true,
      userId: booking.userId
    };
  }).filter(event => event !== null);
  

  const handleEventClick = (event) => {
      if (event.userId) {
          navigate(`/admin/user/${event.userId}`);
      } else {
          alert("No user associated with this booking.");
      }
  };

  return (
      <div className='page'>
          <Nav />
          {isAdmin() && <AdminNav />}
          <div className='content'>
              <div className="schedule-container">
                  <h2>Booking Schedule</h2>

                  <Calendar
                      localizer={localizer}
                      events={events}
                      startAccessor="start"
                      endAccessor="end"
                      style={{ height: 600 }}
                      onSelectEvent={handleEventClick}
                  />
              </div>
          </div>
          <div className='footer'>
              <Footer />
          </div>
      </div>
  );
}

export function AdminAccounts() { 
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "user"
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error("No authentication token found.");
        return;
    }

    axios.get('http://localhost:8081/admin/get-users', {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
        console.log("Users received from API:", res.data);
        setUsers(res.data);
    })
    .catch(err => {
        console.error("Error fetching users:", err);

        if (err.response && err.response.status === 403) {
            alert("Session expired. Please log in again.");
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = "/signin";
        }
    });
}, []);


  const handleRoleChange = (userId, newRole) => {
      axios.put('http://localhost:8081/admin/update-role', 
      { userId, newRole }, 
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => {
          alert(res.data.message);
          setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
      })
      .catch(err => console.error("Error updating role:", err));
  };

  const handleDeleteUser = (userId) => {
      if (!window.confirm("Are you sure you want to delete this user?")) return;

      axios.delete(`http://localhost:8081/admin/delete-user/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => {
          alert(res.data.message);
          setUsers(users.filter(user => user.id !== userId));
      })
      .catch(err => console.error("Error deleting user:", err));
  };

  const handleUserClick = (id) => {
    if (!id || isNaN(id)) {
        console.error("Invalid user ID:", id);
        return;
    }
    navigate(`/admin/user/${id}`);
};

const handleCreateUser = () => {
  const token = localStorage.getItem("token");

  axios.post("http://localhost:8081/admin/create-user", newUser, {
    headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
        alert("User created successfully!");
        window.location.reload();
    })
    .catch(error => {
        console.error("Error creating user:", error);
        alert("Failed to create user.");
  });

};

const filteredUsers = users.filter(user => {
  const search = searchTerm.toLowerCase();
  return (
    (user.firstName && user.firstName.toLowerCase().includes(search)) ||
    (user.lastName && user.lastName.toLowerCase().includes(search)) ||
    (user.email && user.email.toLowerCase().includes(search)) ||
    (user.phoneNumber && user.phoneNumber.includes(search))
  );
});

return (
  <div className='page'>
    <Nav />
    {isAdmin() && <AdminNav />}
    <div className='content'>
      <h2>Manage User Accounts</h2>
      <input
        type="text"
        placeholder="Search by Name, Email, or Phone..."
        className="searchInput"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />


      <button className="WhiteButton AdminAddUserBtn" onClick={() => setShowAddUserModal(true)}>Add User</button>

      {showAddUserModal && (
          <div className="modal">
              <div className="modal-content">
                  <h3>Create New User</h3>
                  <input 
                      type="text" 
                      placeholder="First Name" 
                      value={newUser.firstName} 
                      onChange={(e) => setNewUser({...newUser, firstName: e.target.value})} 
                  />
                  <input 
                      type="text" 
                      placeholder="Last Name" 
                      value={newUser.lastName} 
                      onChange={(e) => setNewUser({...newUser, lastName: e.target.value})} 
                  />
                  <input 
                      type="email" 
                      placeholder="Email" 
                      value={newUser.email} 
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
                  />
                  <input 
                      type="password" 
                      placeholder="Password" 
                      value={newUser.password} 
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})} 
                  />
                  <select 
                      value={newUser.role} 
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                  </select>
                  <button onClick={handleCreateUser}>Create</button>
                  <button onClick={() => setShowAddUserModal(false)}>Cancel</button>
              </div>
          </div>
      )}
      <table className="userTable">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr 
              key={user.id} 
              className="clickableRow"
              onClick={() => handleUserClick(user.id)}
              style={{ cursor: "pointer" }}
            >
              <td>{user.firstName || "N/A"}</td>
              <td>{user.lastName || "N/A"}</td>
              <td>{user.phoneNumber || "N/A"}</td>
              <td>{user.email}</td>
              <td onClick={(e) => e.stopPropagation()}> 
                  <select 
                      value={user.role} 
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                  >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                  </select>
              </td>
              <td>
                <button className="adminDeleteButton" onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.id); }}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className='footer'>
      <Footer />
    </div>
  </div>
);

}           

export function AdminUserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });
  const [rentals, setRentals] = useState([]);
  const [inflatables, setInflatables] = useState([]);
  const [selectedInflatable, setSelectedInflatable] = useState(null);
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const formatDate = (iso) => {
    const [year, month, day] = iso.slice(0, 10).split("-");
    return `${month}/${day}/${year}`;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No authentication token found.");
      alert("Session expired. Please log in again.");
      window.location.href = "/signin";
      return;
    }

    axios
      .get(`http://localhost:8081/admin/get-user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data) {
          setUser(res.data);
        } else {
          alert("User not found.");
        }
      })
      .catch((err) => console.error("Error fetching user:", err));

    axios
      .get(`http://localhost:8081/admin/user-rentals/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRentals(res.data))
      .catch((err) => console.error("Error getting rental history:", err));

    axios
      .get("http://localhost:8081/get-inflatables")
      .then((res) => setInflatables(res.data))
      .catch((err) => console.error("Error getting inflatables:", err));
  }, [userId]);

  const handleUpdateUser = () => {
    const token = localStorage.getItem("token");

    axios
      .put(
        `http://localhost:8081/admin/update-user`,
        {
          id: userId,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        alert(res.data.message);
      })
      .catch((err) => {
        console.error("Error updating user:", err);
        alert("Failed to update user.");
      });
  };

  const handleBooking = () => {
    if (!selectedInflatable || !selectedDates[0] || !selectedDates[1]) {
      alert("Please select an inflatable and a date range.");
      return;
    }

    axios
      .post(
        "http://localhost:8081/admin/book-inflatable",
        {
          userId,
          inflatableId: selectedInflatable.id,
          startDate: selectedDates[0],
          endDate: selectedDates[1],
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        alert("Booking successful!");
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error booking inflatable:", err);
        alert("Booking failed.");
      });
  };

  const updateRentalStatus = (rentalId, field, value) => {
    axios
      .put(
        "http://localhost:8081/admin/update-rental-status",
        { rentalId, field, value },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        setRentals((prevRentals) =>
          prevRentals.map((rental) =>
            rental.id === rentalId ? { ...rental, [field]: value } : rental
          )
        );
      })
      .catch((err) => console.error("Error updating rental status:", err));
  };

  const handleCancelBooking = (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    axios
      .delete(`http://localhost:8081/admin/cancel-booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        alert("Booking canceled successfully!");
        setRentals((prevRentals) =>
          prevRentals.filter((rental) => rental.id !== bookingId)
        );
      })
      .catch((err) => {
        console.error("Error canceling booking:", err);
        alert("Error canceling booking.");
      });
  };

  return (
    <div className="page">
      <Nav />
      {localStorage.getItem("role") === "admin" && <AdminNav />}
      <div className="content">
        <div className='userDetailPage'>
          <button onClick={() => navigate(-1)} className='WhiteButton backToAccountsBtn'>Back to Accounts</button>
          <h2>User Details</h2>
          <div className='userDetails'>
            <label>First Name:</label>
            <input
              type="text"
              value={user.firstName}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            />

            <label>Last Name:</label>
            <input
              type="text"
              value={user.lastName}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            />

            <label>Phone Number:</label>
            <input
              type="text"
              value={user.phoneNumber}
              onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
            />

            <label>Email (Read-only):</label>
            <input type="email" value={user.email} readOnly />

            <button onClick={handleUpdateUser} className="BlueButton">
              Save Changes
            </button>
          </div>

          <div className='rentalHistory'>
            <h2>Rental History</h2>
            {rentals.length > 0 ? (
              <table className="userTable">
                <thead>
                  <tr>
                    <th>Inflatable</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Paid</th>
                    <th>Documents Completed</th>
                    <th>Cancel Booking</th>
                  </tr>
                </thead>
                <tbody>
                  {rentals.map((rental) => (
                    <tr key={rental.id}>
                      <td>{rental.inflatableName}</td>
                      <td>{formatDate(rental.startDate)}</td>
                      <td>{formatDate(rental.endDate)}</td>
                      <td>
                        <select
                          value={rental.paid}
                          onChange={(e) =>
                            updateRentalStatus(rental.id, "paid", e.target.value)
                          }
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </td>
                      <td>
                        <select
                          value={rental.documentsCompleted}
                          onChange={(e) =>
                            updateRentalStatus(rental.id, "documentsCompleted", e.target.value)
                          }
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="adminDeleteButton"
                          onClick={() => handleCancelBooking(rental.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No rental history found.</p>
            )}
          </div>
          
          <div className='AdminUserBooking'>
            <h2>Book an Inflatable for This User</h2>

            <DatePicker selected={selectedDates[0]} onChange={(dates) => setSelectedDates(dates)} startDate={selectedDates[0]} endDate={selectedDates[1]} selectsRange inline />
            <select onChange={(e) => setSelectedInflatable(JSON.parse(e.target.value))}>
              <option value="">-- Choose Inflatable --</option>
              {inflatables.map((inflatable) => (
                <option key={inflatable.id} value={JSON.stringify(inflatable)}>
                  {inflatable.name} - ${inflatable.price}/day
                </option>
              ))}
            </select>

           
            <button onClick={handleBooking} className="BlueButton">Book Now</button>
          </div>
          
        </div>
      </div>
      <Footer />
    </div>
  );
}



//These are the User Pages

export function UserBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const formatDate = (iso) => {
    const [year, month, day] = iso.slice(0, 10).split("-");
    return `${month}/${day}/${year}`;
  };

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
        <table className="userTable">
          <thead>
            <tr>
              <th>Inflatable</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.inflatableName}</td>
                <td>{formatDate(booking.startDate)}</td>
                <td>{formatDate(booking.endDate)}</td>
                <td>
                  <button onClick={() => handleCancel(booking.id)} className="RedButton">
                    Cancel Booking
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
