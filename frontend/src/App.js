import React, { useState, useEffect } from 'react';
import bootstrap from "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import Cookies from 'js-cookie';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Home from './components/home/home';
import Footer from './components/footer/footer';
import Login from './components/authentication/login';
import Register from './components/authentication/register';
import CoursePage from './components/course/coursePage';
import AddCourse from "./components/admin/addCourse";
import { Admin, Instructor, Student } from "./enums/enums.js";
import { NAVIGATE_TO_ADMIN_PROFILE, NAVIGATE_TO_ADD_COURSE, NAVIGATE_TO_UPDATE_CONTENT, NAVIGATE_TO_COURSE, NAVIGATE_TO_COURSE_PAGE, NAVIGATE_TO_INVALID_ROUTES, NAVIGATE_TO_LOGIN, NAVIGATE_TO_PAYMENTS, NAVIGATE_TO_PROFILE, NAVIGATE_TO_REGISTER, NAVIGATE_TO_ADD_COURSE_CONTENTS, NAVIGATE_TO_SUCCESS_PAYMENT, NAVIGATE_TO_UPDATE_COURSE, NAVIGATE_TO_HOME } from "./constant/routeConstant.js";
import Error from "./components/404/error";
import CryptoJS from "crypto-js";
import Course from "./components/course/course";
import Profile from "./components/profile/profile";
import Payment from "./components/payment/payment";
import AddCourseContents from "./components/admin/addCourseContents";
import Dashboard from "./components/admin/dashboard.js";
import PaymentSuccess from "./components/payment/paymentSuccess.js";
import UpdateCourse from './components/admin/updateCourse.js';
import UpdateContent from './components/admin/updateContent.js';
import { handleLogout } from './utils/utility.js';

export default function App() {

  const authToken = Cookies.get('authToken');
  const [uData, setUData] = useState(null);

  useEffect(() => {
    // Check if uData exists in local storage
    if (localStorage.getItem('uData')) {
      const encryptedUData = localStorage.getItem('uData');
      const decryptedUData = CryptoJS.AES.decrypt(encryptedUData, process.env.REACT_APP_ENCRYPTION_SECRET).toString(CryptoJS.enc.Utf8);
      const userData = JSON.parse(decryptedUData);
      setUData(userData);
    }
  }, []);

  const isLoggedIn = authToken && authToken !== 'undefined';
  const isAdmin = uData?.role === Admin;
  const isInstructor = uData?.role === Instructor;
  const isStudent = uData?.role === Student;

  useEffect(() => {
    //Check session expired and user logout
    if (!authToken && localStorage.getItem('uData')) {
      handleLogout()
    }
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>

        {/* Open Routes */}
        <Route path={NAVIGATE_TO_HOME} element={<Home />} />
        <Route
          path={NAVIGATE_TO_LOGIN}
          element={!isLoggedIn ? <Login /> : <Home />}
        />
        <Route
          path={NAVIGATE_TO_REGISTER}
          element={!isLoggedIn ? <Register /> : <Home />}
        />
        <Route path={NAVIGATE_TO_COURSE_PAGE} element={<CoursePage />} />
        <Route path={NAVIGATE_TO_INVALID_ROUTES} element={<Error />} />

        {/* Authorized Routes */}
        <Route
          path={NAVIGATE_TO_COURSE}
          element={isLoggedIn && isStudent ? <Course /> : <Error />}
        />
        <Route
          path={NAVIGATE_TO_ADMIN_PROFILE}
          element={isLoggedIn && (isAdmin || isInstructor) ? <Dashboard /> : <Error />}
        />
        <Route
          path={NAVIGATE_TO_ADD_COURSE}
          element={isLoggedIn && (isAdmin) ? <AddCourse /> : <Error />}
        />
        <Route
          path={NAVIGATE_TO_UPDATE_COURSE}
          element={isLoggedIn && (isAdmin) ? <UpdateCourse /> : <Error />}
        />
        <Route
          path={NAVIGATE_TO_UPDATE_CONTENT}
          element={isLoggedIn && (isInstructor) ? <UpdateContent /> : <Error />}
        />
        <Route
          path={NAVIGATE_TO_ADD_COURSE_CONTENTS}
          element={isLoggedIn && (isAdmin) || (isInstructor) ? <AddCourseContents /> : <Error />}
        />
        <Route
          path={NAVIGATE_TO_PROFILE}
          element={isLoggedIn && isStudent ? <Profile /> : <Error />}
        />
        <Route
          path={NAVIGATE_TO_SUCCESS_PAYMENT}
          element={isLoggedIn && isStudent ? <PaymentSuccess /> : <Error />}
        />
        <Route
          path={NAVIGATE_TO_PAYMENTS}
          element={isLoggedIn && isStudent ? <Payment /> : <Error />}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

