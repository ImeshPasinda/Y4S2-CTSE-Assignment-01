import React, { useState, useEffect } from 'react';
import { Button, SkeletonCircle, SkeletonText, Badge, Card, Heading, CardBody, Stack, Skeleton } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons'
import { NAVIGATE_TO_INVALID_ROUTES, NAVIGATE_TO_PROFILE } from '../../constant/routeConstant';
import { API_GET_ALL_PAYMENTS_BY_USERID, baseUrl_payment } from '../../constant/apiConstant';
import useUserAuthInfo from '../authentication/useUserAuthInfo';
import axios from 'axios';
import CryptoJS from "crypto-js";
import Cookies from 'js-cookie';
import { formatTransactionDate, maskEmail } from '../../utils/utility';

export default function Payment() {

    const [paymentDetails, setPaymentDetails] = useState([]);
    const [isPaymentsLoading, setIsPaymentsLoading] = useState(true);
    const userDetails = useUserAuthInfo();
    const encryptedUData = localStorage.getItem('uData');
    const decryptedUData = CryptoJS.AES.decrypt(encryptedUData, process.env.REACT_APP_ENCRYPTION_SECRET).toString(CryptoJS.enc.Utf8);
    const uData = JSON.parse(decryptedUData);

    useEffect(() => {
        const fetchPaymentDetailsByUserId = async () => {
            try {
                const authToken = Cookies.get('authToken');
                const response = await axios.get(`${baseUrl_payment}${API_GET_ALL_PAYMENTS_BY_USERID}/${uData.userId}`, {
                    headers: {
                        'Authorization': authToken,
                        'Content-Type': 'application/json',
                    },
                });
                setPaymentDetails(response.data);
                setIsPaymentsLoading(false)
            } catch (error) {
                console.error('Error fetching payments details:', error.message);
            }
        };

        fetchPaymentDetailsByUserId();
    }, []);

    // Sort payment details by transaction date in descending order
    const sortedPaymentDetails = paymentDetails.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));

    // Define the number of latest payments to show
    const p = 5;

    return (
        <div>
            <div className="container" style={{ paddingTop: '75px' }}>
                <div className="row">
                    <div className="col-md-4 p-5">
                        <div className="card-profile">
                            <div className="card-profile-body">
                                {userDetails ? (
                                    <>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                            <img src='https://aui.atlassian.com/aui/8.7/docs/images/avatar-person.svg' style={{ height: '100px', width: '100px', display: 'inline', marginBottom: '20px' }} alt="User Avatar" />
                                            <h5>{userDetails.username}<CheckCircleIcon w={4} h={4} color="#0056d2" marginLeft={0.5} marginBottom={1} /></h5>
                                            <Badge ml='1' colorScheme='green'>
                                                {userDetails.role}
                                            </Badge>
                                            <p style={{ marginTop: '15px' }}>{maskEmail(userDetails.email)}</p>
                                        </div>
                                        <div className="course-details">
                                        </div>
                                        <a href={NAVIGATE_TO_PROFILE}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                <Button bg='#0056d2' color='white' variant='solid' borderRadius='4px' size='lg'>
                                                    <span style={{ paddingRight: '8px' }}>
                                                        <i className="fa fa-arrow-left" style={{ fontSize: '18px' }} ></i>
                                                    </span>Back
                                                </Button>
                                            </div>
                                        </a>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px' }}>
                                            <SkeletonCircle size='20' />
                                        </div>
                                        <SkeletonText mt='4' noOfLines={4} spacing='4' />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8 p-5">
                        <h2 style={{ marginBottom: '25px' }}>your payment history<i className="fa fa-arrow-right" style={{ fontSize: '25px', paddingLeft: '10px', color: '#0056d2' }}></i></h2>
                        {isPaymentsLoading ? (
                            <Stack>
                                <Skeleton height='20px' />
                                <Skeleton height='20px' />
                                <Skeleton height='20px' />
                            </Stack>
                        ) : (
                            sortedPaymentDetails.slice(0, p).map((payment, index) => (
                                <Card
                                    key={index}
                                    direction={{ base: 'column', sm: 'row' }}
                                    overflow='hidden'
                                    position='relative'
                                    marginBottom='20px'
                                    borderRadius='20px'
                                    boxShadow='0 0 0 1px #c7c7c7'
                                    _hover={{ boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)' }}
                                >
                                    <Stack>
                                        <CardBody>
                                            <Heading size='md'>LKR {payment.amount}</Heading>
                                            <h6 style={{ color: 'gray', fontWeight: 400, fontSize: 15, marginRight: '100px' }}>{payment.transactionId} - {payment.title}</h6>
                                            <h6 style={{ color: 'gray', fontWeight: 400, fontSize: 15 }}>{formatTransactionDate(payment.transactionDate)}<i className="fa-brands fa-cc-stripe" style={{ fontSize: '13px', color: '#0056d2', marginLeft: '15px' }}></i> | •••• Stripe</h6>
                                            <Badge colorScheme={payment.success ? 'green' : 'red'}>{payment.success ? 'Success' : 'Failed'}</Badge>
                                        </CardBody>
                                    </Stack>
                                    <a href={NAVIGATE_TO_INVALID_ROUTES}>
                                        <Button
                                            className="btn rounded-circle shadow-lg"
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50px'
                                            }}
                                            position="absolute"
                                            top="50px"
                                            right="50px"
                                        >
                                            <i className="fa fa-arrow-right" style={{ fontSize: '25px' }}></i>
                                        </Button>
                                    </a>
                                </Card>
                            ))
                        )}
                        <div className="buttons" style={{ paddingTop: '30px' }}>
                            <Button bg='#0056d2' color='white' variant='solid' borderRadius='4px' size='lg' style={{ marginRight: '10px', marginTop: '10px' }}>
                                Show {sortedPaymentDetails.length} more
                            </Button>
                            <Button bg='white' color='#0056d2' borderColor='#0056d2' variant='outline' borderRadius='4px' size='lg' style={{ marginRight: '10px', marginTop: '10px' }}>
                                View all<i className="fa fa-arrow-right" style={{ fontSize: '20px', paddingLeft: '10px' }}></i>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};