import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Admin, Instructor, Student } from '../../enums/enums';
import { NAVIGATE_TO_ABOUT, NAVIGATE_TO_ADMIN_PROFILE, NAVIGATE_TO_FAQ, NAVIGATE_TO_HOME, NAVIGATE_TO_LOGIN, NAVIGATE_TO_NEWS, NAVIGATE_TO_PRICING, NAVIGATE_TO_PROFILE, NAVIGATE_TO_REGISTER } from '../../constant/routeConstant';
import { LOGO } from '../../constant/imageConstant';
import CryptoJS from "crypto-js";
import { handleLogout } from '../../utils/utility';

export default function Navbar() {

  const [isMobile, setIsMobile] = useState(false);
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Remove event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isAdmin = uData?.role === Admin;
  const isInstructor = uData?.role === Instructor;
  const isStudent = uData?.role === Student;

  return (
    <div>

      {isAdmin && (
        <nav className="navbar navbar-expand-lg p-3 mb-5 navbar-dark custom-bg-color fixed-top">
          <div className="container-fluid" style={{ marginLeft: isMobile ? 0 : '15%', marginRight: isMobile ? 0 : '15%' }}>
            <a className="navbar-brand" href={NAVIGATE_TO_HOME}>
              <img src={LOGO} alt="" width="130" height="45" className="d-inline-block align-text-top" />
              <span className="navbar-brand-text" style={{ color: 'gray', fontSize: 12 }}> admin</span>
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item mt-1 text-center">
                  <a className="nav-link" href={NAVIGATE_TO_LOGIN} onClick={handleLogout}>
                    <h6 style={{ color: '#0056d2' }}>Logout</h6>
                  </a>
                </li>
                <div className="dropdown m-2 nav-item text-center">
                  <Link to={NAVIGATE_TO_ADMIN_PROFILE} style={{ color: '#0056d2', textDecoration: 'none', display: 'inline-block' }}>
                    <h6 style={{ display: 'inline', marginRight: '10px' }}>Hi, {uData.username.split(' ')[0]}</h6>
                    <img src='https://aui.atlassian.com/aui/8.7/docs/images/avatar-person.svg' style={{ height: '30px', width: '30px', display: 'inline' }} alt="User Avatar" />
                  </Link>
                </div>
              </ul>
            </div>
          </div>
        </nav>
      )}

      {isInstructor && (
        <nav className="navbar navbar-expand-lg p-3 mb-5 navbar-dark custom-bg-color fixed-top">
          <div className="container-fluid" style={{ marginLeft: isMobile ? 0 : '15%', marginRight: isMobile ? 0 : '15%' }}>
            <a className="navbar-brand" href={NAVIGATE_TO_HOME}>
              <img src={LOGO} alt="" width="130" height="45" className="d-inline-block align-text-top" />
              <span className="navbar-brand-text" style={{ color: 'gray', fontSize: 12 }}> instructor</span>
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">

                <li className="nav-item mt-1 text-center">
                  <a className="nav-link" href={NAVIGATE_TO_LOGIN} onClick={handleLogout}>
                    <h6 style={{ color: '#0056d2' }}>Logout</h6>
                  </a>
                </li>

                <div className="dropdown m-2 nav-item text-center">
                  <a style={{ color: '#0056d2', textDecoration: 'none', display: 'inline-block' }}>
                    <Link to={NAVIGATE_TO_ADMIN_PROFILE} style={{ color: '#0056d2', textDecoration: 'none', display: 'inline-block' }}>
                      <h6 style={{ display: 'inline', marginRight: '10px' }}>Hi, {uData.username.split(' ')[0]}</h6>
                      <img src='https://aui.atlassian.com/aui/8.7/docs/images/avatar-person.svg' style={{ height: '30px', width: '30px', display: 'inline' }} alt="User Avatar" />
                    </Link>
                  </a>
                </div>
              </ul>
            </div>
          </div>
        </nav>
      )}

      {isStudent && (
        <nav className="navbar navbar-expand-lg p-3 mb-5 navbar-dark custom-bg-color fixed-top">
          <div className="container-fluid" style={{ marginLeft: isMobile ? 0 : '15%', marginRight: isMobile ? 0 : '15%' }}>
            <a className="navbar-brand" href={NAVIGATE_TO_HOME}>
              <img src={LOGO} alt="" width="130" height="45" className="d-inline-block align-text-top" />
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">

                <li className="nav-item mt-1 text-center">
                  <a className="nav-link" href={NAVIGATE_TO_PRICING}>
                    <h6 style={{ color: '#404040', fontWeight: 400 }}>Pricing</h6>
                  </a>
                </li>

                <li className="nav-item mt-1 text-center">
                  <a className="nav-link" href={NAVIGATE_TO_ABOUT}>
                    <h6 style={{ color: '#404040', fontWeight: 400 }}>About Us</h6>
                  </a>
                </li>
                <li className="nav-item mt-1 text-center">
                  <a className="nav-link" href={NAVIGATE_TO_NEWS}>
                    <h6 style={{ color: '#404040', fontWeight: 400 }}>News</h6>
                  </a>
                </li>
                <li className="nav-item mt-1 text-center">
                  <a className="nav-link" href={NAVIGATE_TO_FAQ}>
                    <h6 style={{ color: '#404040', fontWeight: 400 }}>FAQ</h6>
                  </a>
                </li>
                <li className="nav-item mt-1 text-center">
                  <a className="nav-link" href={NAVIGATE_TO_LOGIN} onClick={handleLogout}>
                    <h6 style={{ color: '#0056d2' }}>Logout</h6>
                  </a>
                </li>
                <div className="dropdown m-2 nav-item text-center">
                  <a style={{ color: '#0056d2', textDecoration: 'none', display: 'inline-block' }}>
                    <Link to={NAVIGATE_TO_PROFILE} style={{ color: '#0056d2', textDecoration: 'none', display: 'inline-block' }}>
                      <h6 style={{ display: 'inline', marginRight: '10px' }}>Hi, {uData.username.split(' ')[0]}</h6>
                      <img src='https://aui.atlassian.com/aui/8.7/docs/images/avatar-person.svg' style={{ height: '30px', width: '30px', display: 'inline' }} alt="User Avatar" />
                    </Link>
                  </a>
                </div>
              </ul>
            </div>
          </div>
        </nav>
      )}

      {!isAdmin && !isInstructor && !isStudent && (
        <nav className="navbar navbar-expand-lg p-3 mb-5 navbar-dark custom-bg-color fixed-top">
          <div className="container-fluid" style={{ marginLeft: isMobile ? 0 : '15%', marginRight: isMobile ? 0 : '15%' }}>
            <a className="navbar-brand" href={NAVIGATE_TO_HOME}>
              <img src={LOGO} alt="" width="130" height="45" className="d-inline-block align-text-top" />
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">

                <li className="nav-item mt-1 text-center">
                  <a className="nav-link" href={NAVIGATE_TO_PRICING}>
                    <h6 style={{ color: '#404040', fontWeight: 400 }}>Pricing</h6>
                  </a>
                </li>

                <li className="nav-item mt-1 text-center">
                  <a className="nav-link" href={NAVIGATE_TO_ABOUT}>
                    <h6 style={{ color: '#404040', fontWeight: 400 }}>About Us</h6>
                  </a>
                </li>
                <li className="nav-item mt-1 text-center">
                  <a className="nav-link" href={NAVIGATE_TO_NEWS}>
                    <h6 style={{ color: '#404040', fontWeight: 400 }}>News</h6>
                  </a>
                </li>
                <li className="nav-item mt-1 text-center">
                  <a className="nav-link" href={NAVIGATE_TO_FAQ}>
                    <h6 style={{ color: '#404040', fontWeight: 400 }}>FAQ</h6>
                  </a>
                </li>
                {uData ? (
                  <li className="nav-item mt-1 text-center">
                    <a className="nav-link" href={NAVIGATE_TO_LOGIN} onClick={handleLogout}>
                      <h6 style={{ color: '#0056d2' }}>Logout</h6>
                    </a>
                  </li>
                ) : (
                  <li className="nav-item mt-1 text-center">
                    <a className="nav-link" href={NAVIGATE_TO_LOGIN}>
                      <h6 style={{ color: '#0056d2' }}>Login</h6>
                    </a>
                  </li>
                )}
                {uData ? (
                  <div className="dropdown m-2 nav-item text-center">
                    <a style={{ color: '#0056d2', textDecoration: 'none', display: 'inline-block' }}>
                      <h6 style={{ display: 'inline', marginRight: '10px' }}>Hi, {uData.username.split(' ')[0]}</h6>
                      <img src='https://aui.atlassian.com/aui/8.7/docs/images/avatar-person.svg' style={{ height: '30px', width: '30px', display: 'inline' }} alt="User Avatar" />
                    </a>
                  </div>
                ) : (
                  <div style={{ paddingLeft: '10px' }}>
                    <li className="nav-item text-center" style={{ paddingTop: '3px', border: '2px solid #0056d2', borderRadius: '5px', height: '45px' }}>
                      <a className="nav-link" href={NAVIGATE_TO_REGISTER} >
                        <h6 style={{ color: '#0056d2', fontWeight: 'bold' }}>Join for free</h6>
                      </a>
                    </li>
                  </div>
                )}
              </ul>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
