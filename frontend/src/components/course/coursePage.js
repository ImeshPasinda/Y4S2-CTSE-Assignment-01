import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import CryptoJS from "crypto-js";
import { Button, Center, Spinner } from '@chakra-ui/react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { baseUrl_payment, API_POST_HANDLE_PAYMENT, API_GET_COURSE_BY_COURSEID, baseUrl_course, API_GET_ALL_USERS, baseUrl_auth, baseUrl_enrollment, API_GET_ENROLLMENT_BY_USERID } from '../../constant/apiConstant';
import { NAVIGATE_TO_INVALID_ROUTES } from '../../constant/routeConstant';
import { COURSE_PAGE_BANNER_LOGO, LOGO } from '../../constant/imageConstant';
import { getFormattedDate } from '../../utils/utility';
import useUserAuthInfo from '../authentication/useUserAuthInfo';
import { PAGE_SPINNER_LOADING } from '../../constant/timeConstant';
import { Admin, Instructor } from '../../enums/enums';

export default function CoursePage() {

    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [courseDetails, setCourseDetails] = useState([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const courseId = searchParams.get('id');
    const userDetails = useUserAuthInfo();
    const encryptedUData = localStorage.getItem('uData');

    let uData = '';

    if (encryptedUData) {
        const decryptedUData = CryptoJS.AES.decrypt(encryptedUData, process.env.REACT_APP_ENCRYPTION_SECRET).toString(CryptoJS.enc.Utf8);
        uData = JSON.parse(decryptedUData);
    }

    // Check if user is logged in
    useEffect(() => {
        setIsLoggedIn(!!uData.userId);
    }, []);

    useEffect(() => {
        async function fetchEnrollmentData() {
            try {
                if (courseId) {
                    const authToken = Cookies.get('authToken');
                    const enrollmentResponse = await axios.get(`${baseUrl_enrollment}${API_GET_ENROLLMENT_BY_USERID}/${uData.userId}`, {
                        headers: {
                            'Authorization': authToken,
                            'Content-Type': 'application/json',
                        },
                    });

                    const enrollmentData = enrollmentResponse.data.enrollment;

                    // Check if the courseId is in enrollmentData
                    if (enrollmentData.courses.includes(courseId)) {
                        console.log('{CoursePage} Enrolled User...');
                        setIsEnrolled(true)
                    } else {
                        console.log('Not Enrolled...:');
                        setIsEnrolled(false)
                    }
                } else {
                    console.error("Can't find courseId")
                }
            } catch (error) {
                console.error('Error fetching enrollment data:', error.response.statusText);
            }
        }

        fetchEnrollmentData();

    }, [courseId]);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const authToken = Cookies.get('authToken');

                const response = await axios.get(`${baseUrl_course}${API_GET_COURSE_BY_COURSEID}/${courseId}`, {
                    headers: {
                        'Authorization': authToken,
                        'Content-Type': 'application/json',
                    },
                });
                const instructorResponse = await axios.get(`${baseUrl_auth}${API_GET_ALL_USERS}/${response.data.instructor}`, {
                    headers: {
                        'Authorization': authToken,
                        'Content-Type': 'application/json',
                    },
                });
                const instructorName = instructorResponse.data.username;
                setCourseDetails({ ...response.data, instructorName });
                setIsPageLoading(false)
            } catch (error) {
                console.error('Error fetching course details:', error.message);
                window.location.href = NAVIGATE_TO_INVALID_ROUTES
            }
        };

        fetchCourseDetails();
    }, []);

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
            const authToken = Cookies.get('authToken');
            const requestData = {
                name: courseDetails.title,
                email: userDetails.email,
                amount: courseDetails.price,
                imageUrl: LOGO,
                courseId: courseDetails._id,
                userId: userDetails._id
            };
            console.log(requestData)
            const response = await axios.post(`${baseUrl_payment}${API_POST_HANDLE_PAYMENT}`, requestData, {
                headers: {
                    'Authorization': authToken,
                    'Content-Type': 'application/json',
                },
            });
            const session = response.data;

            const result = await stripe.redirectToCheckout({
                sessionId: session.id
            });

            if (result.error) {
                console.error(result.error.message);
                setIsCheckingOut(false);
            }
        } catch (error) {
            console.error(error);
            setIsCheckingOut(false);
        }
    };

    return (
        <div className="course-page">
            {isPageLoading ? (
                <Center h="100vh"> <Spinner size="xl" style={{ color: '#0056d2' }} /></Center>
            ) : (
                <div>
                    <div className="jumbotron img-coursebanner">
                        <div style={{ paddingTop: '150px' }}>
                            <div className="container p-3">
                                <div className="row">
                                    <div className="col-md-6 text-left" style={{ color: 'white' }}>
                                        <img src={COURSE_PAGE_BANNER_LOGO} alt="Logo" />
                                        <h1>{courseDetails.title}</h1>
                                        <p>{courseDetails.instructorName}</p>
                                    </div>
                                    <div className="col-md-6 d-flex justify-content-end align-items-center">
                                        <div className="card-course" style={{ backgroundColor: 'white', width: '500px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.5)' }}>
                                            <div className="card-course-body">
                                                <h5 className="card-title">Fall Priority Deadline: {getFormattedDate(courseDetails.endDate)}</h5>
                                                <p className="card-text text-muted">Start your application or request more info.</p>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    {isLoggedIn ? ( // Render different buttons based on user login status
                                                        !(uData.role === Admin || uData.role === Instructor) && ( // Check if user is neither an admin nor an instructor
                                                            isEnrolled ? (
                                                                <Link to={`/course?id=${courseDetails._id}`}>
                                                                    <Button
                                                                        bg='#0056d2'
                                                                        color='white'
                                                                        variant='solid'
                                                                        borderRadius='4px'
                                                                        width="100%"
                                                                        size='lg'
                                                                        minWidth='flex'
                                                                    >
                                                                        {isCheckingOut ? <Spinner size="sm" color="white" /> : `Go to Lessons`} <i className="fa fa-arrow-right" style={{ fontSize: '20px', paddingLeft: '10px' }}></i>
                                                                    </Button>
                                                                </Link>
                                                            ) : (
                                                                <Button
                                                                    bg='#0056d2'
                                                                    color='white'
                                                                    variant='solid'
                                                                    borderRadius='4px'
                                                                    width="100%"
                                                                    size='lg'
                                                                    onClick={handleCheckout}
                                                                    disabled={isCheckingOut}
                                                                >
                                                                    {isCheckingOut ? <Spinner size="sm" color="white" /> : `Enroll Now LKR ${courseDetails.price}`}
                                                                </Button>
                                                            )
                                                        )
                                                    ) : (
                                                        <Button
                                                            bg='#0056d2'
                                                            color='white'
                                                            variant='solid'
                                                            borderRadius='4px'
                                                            width="100%"
                                                            size='lg'
                                                            onClick={() => {
                                                                // Redirect to login page when not logged in
                                                                window.location.href = '/login';
                                                            }}
                                                        >
                                                            Please Log In to Enroll
                                                        </Button>
                                                    )}
                                                    <Button bg='white' color='#0056d2' borderColor='#0056d2' variant='outline' borderRadius='4px' size='lg'>
                                                        Try Learnopia for Business
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container" style={{ marginTop: '50px' }}>
                        <div className="row">
                            <div className="col-md-8 p-5">
                                <h2>{courseDetails.title}</h2>
                                <br />
                                <p style={{ color: 'gray' }}>{courseDetails.description}</p>
                            </div>

                            <div className="col-md-4 p-5">
                                <div className="card-compelling">
                                    <div className="card-compelling-body">
                                        <h5>This Course Includes</h5>
                                        <p className="card-text">Equip yourself with in-demand skills and gain a competitive edge in the job market with this comprehensive course.</p>
                                        <div className="course-details">
                                            <h6>Course Details</h6>
                                            <ul>
                                                <li>54 hours on-demand video</li>
                                                <li>Assignments</li>
                                                <li>222 articles</li>
                                                <li>147 downloadable resources</li>
                                                <li>Access on mobile and TV</li>
                                                <li>Full lifetime access</li>
                                                <li>Certificate of completion</li>
                                            </ul>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <Button bg='white' color='#0056d2' borderColor='#0056d2' variant='outline' borderRadius='4px' size='lg'>
                                                More Details
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}