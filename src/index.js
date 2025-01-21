import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { SignIn, Booking, Inflatables } from "./App";
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
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);



