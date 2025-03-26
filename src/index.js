import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { SignIn, Booking, Inflatables, About, App, AdminFeaturedProducts, SignUp, 
  ForgotPassword, ResetPassword, ProtectedAdminRoute, AdminInflatables, AdminAccounts, AdminSchedule, ProtectedUserRoute, UserBookings, UserProfile, AdminUserDetails } from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/inflatables" element={<Inflatables />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/about" element={<About />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgotpass" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/admin/*" element={<ProtectedAdminRoute />}>
        <Route path="featured" element={<AdminFeaturedProducts />} />
        <Route path="inflatables" element={<AdminInflatables />} />
        <Route path="schedule" element={<AdminSchedule />} />
        <Route path="accounts" element={<AdminAccounts />} />
        <Route path="user/:userId" element={<AdminUserDetails />} />
      </Route>
      <Route path="/user/*" element={<ProtectedUserRoute />}>
        <Route path="bookings" element={<UserBookings />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>
    </Routes>
  </BrowserRouter>,

);



