import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import CryptoJS from "crypto-js";
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_POST_ENROLLMENT, API_POST_NOTIFICATION, API_POST_PAYMENT, baseUrl_enrollment, baseUrl_notification, baseUrl_payment, origin } from '../../constant/apiConstant';
import { NAVIGATE_TO_INVALID_ROUTES } from '../../constant/routeConstant';
import { Container, VStack, Center, Spinner } from '@chakra-ui/react';
import { PAYMENT_SUCCESS_TEMPLATE } from '../../constant/commonConstant';
import { generateTransactionId } from '../../utils/utility';

export default function PaymentSuccess() {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('session_id');
    const encryptedData = searchParams.get('order');
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, process.env.REACT_APP_ENCRYPTION_SECRET).toString(CryptoJS.enc.Utf8);
    const orderData = JSON.parse(decryptedData);
    const encryptedUData = localStorage.getItem('uData');
    const decryptedUData = CryptoJS.AES.decrypt(encryptedUData, process.env.REACT_APP_ENCRYPTION_SECRET).toString(CryptoJS.enc.Utf8);
    const uData = JSON.parse(decryptedUData);
    const effectRan = useRef(false)
    const [isLoading, setIsLoading] = useState(true);
    const transactionId = generateTransactionId();

    useEffect(() => {
        if (sessionId && orderData) {
            if (effectRan.current === false && sessionId && orderData) {
                const saveOrderDetails = async () => {
                    try {
                        const authToken = Cookies.get('authToken');
                        const sendOrderData = {
                            amount: orderData.amount,
                            courseId: orderData.courseId,
                            success: true,
                            transactionId: transactionId,
                            userId: orderData.userId,
                            title: orderData.name
                        };
                        await axios.post(`${baseUrl_payment}${API_POST_PAYMENT}`, sendOrderData, {
                            headers: {
                                'Authorization': authToken,
                                'Content-Type': 'application/json',
                            },
                        });
                        const notificationData = {
                            email: uData.email,
                            username: uData.username,
                            userId: uData.userId,
                            subject: "Payment Successfully!",
                            content: {
                                "template_type": PAYMENT_SUCCESS_TEMPLATE,
                                "courseName": orderData.name,
                                "transactionId": transactionId,
                                "coursePrice": orderData.amount,
                                "courseLink": `${origin}/course?id=${orderData.courseId}`
                            }
                        };
                        // Parallel request to send notification
                        await axios.post(`${baseUrl_notification}${API_POST_NOTIFICATION}`, notificationData, {
                            headers: {
                                Authorization: authToken,
                                "Content-Type": "application/json",
                            },
                        });
                        // Enrollment POST API
                        const sendEnrollmentData = {
                            userId: uData.userId,
                            courseId: orderData.courseId
                        };
                        await axios.post(`${baseUrl_enrollment}${API_POST_ENROLLMENT}`, sendEnrollmentData, {
                            headers: {
                                'Authorization': authToken,
                                'Content-Type': 'application/json',
                            },
                        });
                        setIsLoading(false);
                        setTimeout(() => {
                            window.location.href = `/course?id=${orderData.courseId}`;
                        }, 2000);
                    } catch (error) {
                        console.error('Error saving order details:', error.message);
                    }
                };
                saveOrderDetails();
                return () => {
                    effectRan.current = true
                }
            }
        } else {
            window.location.href = NAVIGATE_TO_INVALID_ROUTES
        }
    }, []);

    return (
        <Center h="100vh">
            {isLoading ? (
                <VStack>
                    <Container maxW='550px' color='black' p={4}>
                        <div className="text-center" style={{ marginBottom: 8 }}>
                            <Spinner size="xl" style={{ color: '#0056d2' }} />
                        </div>
                        <h2 className='text-center' style={{ fontSize: '25px', fontWeight: 400 }}>Payment Success!</h2>
                        <h3 className='text-center' style={{ color: '#b1b1b1', fontSize: '15px', fontWeight: 400 }}>*Do not close or refresh this page*</h3>
                        <h3 className='text-center' style={{ color: '#b1b1b1', fontSize: '15px', fontWeight: 400 }}>You will be redirected to the course content page...</h3>
                    </Container>
                </VStack>
            ) : (
                <VStack>
                    <Container maxW='550px' color='black' p={4}>
                        <div className="text-center" style={{ marginBottom: 8 }}>
                            <div style={{ border: '3px solid #0056d2', borderRadius: '50%', width: '45px', height: '45px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fa fa-check" style={{ fontSize: '28px', color: '#0056d2' }}></i>
                            </div>
                        </div>
                        <h2 className='text-center' style={{ fontSize: '25px', fontWeight: 400 }}>Payment Success!</h2>
                        <h3 className='text-center' style={{ color: '#b1b1b1', fontSize: '15px', fontWeight: 400 }}>*Do not close or refresh this page*</h3>
                        <h3 className='text-center' style={{ color: '#b1b1b1', fontSize: '15px', fontWeight: 400 }}>You will be redirected to the course content page...</h3>
                    </Container>
                </VStack>

            )}
        </Center>
    )
}
