import React, { useState, useEffect } from 'react';
import { Button, Center, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import CryptoJS from "crypto-js";
import Cookies from 'js-cookie';
import {
    Box,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'
import { useLocation } from 'react-router-dom';
import ReactPlayer from 'react-player'
import { NAVIGATE_TO_INVALID_ROUTES } from '../../constant/routeConstant';
import { API_GET_ALL_COURSE_CONTENT_BY_COURSEID, API_GET_COURSE_BY_COURSEID, API_GET_ENROLLMENT_BY_USERID, baseUrl_course, baseUrl_course_content, baseUrl_enrollment } from '../../constant/apiConstant';
import { COURSE_LESSON_COUNTDOWN_TIME } from '../../constant/timeConstant';

export default function Course() {

    const [timeLeft, setTimeLeft] = useState(null);
    const [timerStarted, setTimerStarted] = useState(false);
    const [buttonText, setButtonText] = useState('Start Learning');
    const [remainingTimeOnPause, setRemainingTimeOnPause] = useState(0);
    const [contentDetails, setCourseContentDetails] = useState([]);
    const [courseDetails, setCourseDetails] = useState([]);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const courseId = searchParams.get('id');
    const encryptedUData = localStorage.getItem('uData');
    const decryptedUData = CryptoJS.AES.decrypt(encryptedUData, process.env.REACT_APP_ENCRYPTION_SECRET).toString(CryptoJS.enc.Utf8);
    const uData = JSON.parse(decryptedUData);
    const timeduration = COURSE_LESSON_COUNTDOWN_TIME; //time duration (seconds)

    const [isPageLoading, setIsPageLoading] = useState(true);

    useEffect(() => {
        const fetchEnrollmentData = async () => {
            try {
                if (courseId && uData.userId) {
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
                        fetchCourseContentDetails(courseId);
                        console.log('{Course} Enrolled User...');
                    } else {
                        console.log('Invalid courseId:', courseId);
                        window.location.href = NAVIGATE_TO_INVALID_ROUTES;
                    }
                } else {
                    window.location.href = NAVIGATE_TO_INVALID_ROUTES;
                }
            } catch (error) {
                console.error('Error fetching enrollment data:', error);
            }
        };

        fetchEnrollmentData();

    }, [courseId, uData.userId]);



    const fetchCourseContentDetails = async (courseId) => {
        try {
            const authToken = Cookies.get('authToken');

            const responseContent = await axios.get(`${baseUrl_course_content}${API_GET_ALL_COURSE_CONTENT_BY_COURSEID}/${courseId}`, {
                headers: {
                    'Authorization': authToken,
                    'Content-Type': 'application/json',
                },
            });

            const responseCourse = await axios.get(`${baseUrl_course}${API_GET_COURSE_BY_COURSEID}/${courseId}`, {
                headers: {
                    'Authorization': authToken,
                    'Content-Type': 'application/json',
                },
            });

            setCourseContentDetails(responseContent.data);
            setCourseDetails(responseCourse.data);
            setIsPageLoading(false);
        } catch (error) {
            console.error('Error fetching content details:', error.message);
            window.location.href = NAVIGATE_TO_INVALID_ROUTES
        }
    };

    useEffect(() => {
        let interval;
        if (timerStarted && (timeLeft === null || timeLeft > 0)) {
            interval = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        } else if (!timerStarted || timeLeft <= 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timerStarted, timeLeft]);

    const handleAddToTimerClick = () => {
        if (!timerStarted) {
            if (remainingTimeOnPause > 0) {
                setTimeLeft(remainingTimeOnPause);
                setRemainingTimeOnPause(0);
            } else {
                setTimeLeft(timeduration);
            }
            setTimerStarted(true);
            setButtonText('Stop');
        } else {
            setRemainingTimeOnPause(timeLeft);
            setTimeLeft(null);
            setTimerStarted(false);
            setButtonText('Resume');
        }
    };

    //countdown
    const renderTimer = () => {
        if (timerStarted) {
            const hours = Math.floor((timeLeft || 0) / 3600);
            const remainingMinutes = Math.floor(((timeLeft || 0) % 3600) / 60);
            const remainingSeconds = (timeLeft || 0) % 60;
            const remainingTimeString = `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
            if (remainingTimeString === '00:00:00') {
                setTimerStarted(false);
                setButtonText('Start Again');
                console.log("Timer finished!");
            }
            return remainingTimeString;
        } else if (remainingTimeOnPause > 0) {
            const hours = Math.floor((remainingTimeOnPause || 0) / 3600);
            const remainingMinutes = Math.floor(((remainingTimeOnPause || 0) % 3600) / 60);
            const remainingSeconds = (remainingTimeOnPause || 0) % 60;
            const remainingTimeString = `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
            return remainingTimeString;
        } else {
            return '00:00:00';
        }
    };

    return (
        <div>
            {isPageLoading ? (
                <Center h="100vh"> <Spinner size="xl" style={{ color: '#0056d2' }} /></Center>
            ) : (
                <div className="course-page">
                    <div className="jumbotron img-coursebanner">
                        <div style={{ paddingTop: '150px' }}>
                            <div className="container p-3">
                                <div className="row">
                                    <div className="col-md-6 text-left" style={{ color: 'white' }}>
                                        <img src="https://static.wixstatic.com/media/618c8c_892142b22fac46ddb55c42121375e5e0~mv2.png" alt="Logo" />
                                        <h1>{courseDetails.title}</h1>
                                        <p>Don't wait any longer! Begin your exciting journey with {contentDetails.length} captivating lessons in this course.</p>
                                    </div>
                                    <div className="col-md-6 d-flex justify-content-end align-items-center">
                                        <div className="card-countdown" style={{ backgroundColor: 'white', width: '400px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.5)' }}>
                                            <div className="card-countdown-body">
                                                <h5>Time Remaining <i className="fa fa-clock" style={{ fontSize: '15px', paddingLeft: '2px', color: '#0056d2' }}></i></h5>
                                                <h5 className="timer-text" style={{ fontSize: '40px', fontWeight: '400px' }} isDisabled={!timerStarted}>
                                                    {renderTimer()}
                                                </h5>
                                                <p className="card-text">You have <span style={{ padding: '2px 4px', borderRadius: '4px', fontWeight: 'bold' }}>{timeduration}</span> seconds remaining in this lesson.</p>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    <Button
                                                        bg={buttonText === 'Stop' ? 'white' : '#0056d2'}
                                                        color={buttonText === 'Stop' ? '#0056d2' : 'white'}
                                                        borderColor={buttonText === 'Stop' ? '#0056d2' : 'white'}
                                                        variant='outline'
                                                        borderRadius='4px'
                                                        size='lg'
                                                        onClick={handleAddToTimerClick}
                                                        style={{ display: 'flex', alignItems: 'center' }}
                                                    >
                                                        {(buttonText === 'Start Learning' || buttonText === 'Resume' || buttonText === 'Start Again') && (
                                                            <span style={{ paddingRight: '8px' }}>
                                                                <i className="fa fa-play" style={{ fontSize: '18px' }} ></i>
                                                            </span>
                                                        )}
                                                        {buttonText === 'Stop' && (
                                                            <span style={{ paddingRight: '8px' }}>
                                                                <i className="fa fa-stop" style={{ fontSize: '18px' }}></i>
                                                            </span>
                                                        )}
                                                        <span>{buttonText}</span>
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
                                <h2>Let's Start<i className="fa fa-arrow-right" style={{ fontSize: '25px', paddingLeft: '10px', color: '#0056d2' }}></i></h2>
                                <br />
                                <Accordion>
                                    {contentDetails && contentDetails.length > 0 ? (
                                        <Accordion>
                                            {contentDetails.map((lesson, index) => (
                                                <AccordionItem key={index} isDisabled={!timerStarted}>
                                                    <h2>
                                                        <AccordionButton isDisabled={!timerStarted}>
                                                            <Box as='span' flex='1' textAlign='left'>
                                                                {`Lesson ${index + 1} -  ${lesson.title} - [ ${lesson.type}]`}
                                                            </Box>
                                                            <AccordionIcon />
                                                        </AccordionButton>
                                                    </h2>
                                                    <AccordionPanel pb={4}>
                                                        <ReactPlayer url={lesson.contentUrl} />
                                                    </AccordionPanel>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    ) : (
                                        <p>Sorry, No content available</p>
                                    )}
                                </Accordion>
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