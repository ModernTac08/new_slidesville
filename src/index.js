import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { SignIn, Booking, Inflatables, About, App } from "./App";
import { 
  BrowserRouter, 
  Routes, 
  Route
} from "react-router-dom";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/inflatables" element={<Inflatables />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);



