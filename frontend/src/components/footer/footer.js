import React from 'react';
import { NAVIGATE_TO_ABOUT, NAVIGATE_TO_BLOG, NAVIGATE_TO_CONTACTS, NAVIGATE_TO_COURSES, NAVIGATE_TO_EVENTS, NAVIGATE_TO_FAQ, NAVIGATE_TO_FEEDBACK, NAVIGATE_TO_FORUM, NAVIGATE_TO_HELP, NAVIGATE_TO_HOME, NAVIGATE_TO_PRICING, NAVIGATE_TO_PRIVACY, NAVIGATE_TO_REGISTER, NAVIGATE_TO_TERMS } from '../../constant/routeConstant';

export default function Footer() {

    const currentYear = new Date().getFullYear();

    return (
        <div>
            <div style={{ backgroundColor: '#f7f7f7', bottom: '0', marginTop: '400px', width: '100%' }}>
                <div className="container" >
                    <footer className="py-5" >
                        <div className="row">
                            <div className="col-6 col-md-2 mb-3">
                                <h5 style={{ fontWeight: 500, fontSize: 20 }}>Courses</h5>
                                <ul className="nav flex-column custom-nav-links">
                                    <li className="nav-item mb-2"><a href={NAVIGATE_TO_HOME} className="nav-link p-0 ">Home</a></li>
                                    <li className="nav-item mb-2"><a href={NAVIGATE_TO_COURSES} className="nav-link p-0 ">Browse Courses</a></li>
                                    <li className="nav-item mb-2"><a href={NAVIGATE_TO_HELP} className="nav-link p-0 ">Help</a></li>
                                    <li className="nav-item mb-2"><a href={NAVIGATE_TO_FEEDBACK} className="nav-link p-0 ">Feedback</a></li>
                                    <li className="nav-item mb-2"><a href={NAVIGATE_TO_ABOUT} className="nav-link p-0 ">About Us</a></li>
                                </ul>
                            </div>

                            <div className="col-6 col-md-2 mb-3">
                                <h5 style={{ fontWeight: 500, fontSize: 20 }}>Community</h5>
                                <ul className="nav flex-column custom-nav-links">
                                    <li className="nav-item mb-2"><a href={NAVIGATE_TO_HOME} className="nav-link p-0 ">Home</a></li>
                                    <li className="nav-item mb-2"><a href={NAVIGATE_TO_FORUM} className="nav-link p-0 ">Forum</a></li>
                                    <li className="nav-item mb-2"><a href={NAVIGATE_TO_BLOG} className="nav-link p-0 ">Blog</a></li>
                                    <li className="nav-item mb-2"><a href={NAVIGATE_TO_EVENTS} className="nav-link p-0 ">Events</a></li>
                                    <li className="nav-item mb-2"><a href={NAVIGATE_TO_CONTACTS} className="nav-link p-0 ">Contact Us</a></li>
                                </ul>
                            </div>

                            <div className="col-6 col-md-2 mb-3">
                                <h5 style={{ fontWeight: 500, fontSize: 20 }}>More</h5>
                                <ul className="nav flex-column custom-nav-links">
                                    <li className="nav-item mb-2"><a href={NAVIGATE_TO_PRICING} className="nav-link p-0 ">Pricing</a></li>
                                    <li className="nav-item mb-2"><a href={NAVIGATE_TO_FAQ} className="nav-link p-0 ">FAQs</a></li>
                                    <li className="nav-item mb-2"><a href={NAVIGATE_TO_TERMS} className="nav-link p-0 ">Terms & Conditions</a></li>
                                    <li className="nav-item mb-2"><a href={NAVIGATE_TO_PRIVACY} className="nav-link p-0 ">Privacy Policy</a></li>
                                    <li className="nav-item mb-2"><a href={NAVIGATE_TO_REGISTER} className="nav-link p-0 ">Sign Up</a></li>
                                </ul>
                            </div>

                            <div className="col-md-5 offset-md-1 mb-3">
                                <form>
                                    <h5 style={{ fontWeight: 500, fontSize: 20 }}>Subscribe to our newsletter</h5>
                                    <h5 style={{ fontWeight: 400, fontSize: 15 }}>Get updates on new courses and promotions.</h5>
                                    <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                                        <label htmlFor="newsletter1" className="visually-hidden">Email address</label>
                                        <input id="newsletter1" type="text" className="form-control" placeholder="Email address" />
                                        <button className="btn" type="button">Subscribe</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div>
                            <hr style={{ color: 'black' }} />
                            <p className='text-end' style={{ color: 'black', fontSize: 12 }}>© {currentYear} Learnopia, Inc. All rights reserved.</p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    )
}
