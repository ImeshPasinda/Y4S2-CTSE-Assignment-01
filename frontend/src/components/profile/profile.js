import React, { useState, useEffect } from 'react';
import { Button, SkeletonCircle, SkeletonText, Text, Badge, SimpleGrid, Card, CardHeader, Heading, CardBody, CardFooter, Stack, Skeleton } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons'
import useUserAuthInfo from '../authentication/useUserAuthInfo';
import Cookies from 'js-cookie';
import CryptoJS from "crypto-js";
import axios from 'axios';
import { NAVIGATE_TO_PAYMENTS } from '../../constant/routeConstant';
import { API_GET_ALL_COURSES, API_GET_ENROLLMENT_BY_USERID, baseUrl_course, baseUrl_enrollment } from '../../constant/apiConstant';
import { maskEmail } from '../../utils/utility';

export default function Profile() {

  const [courseDetails, setCourseDetails] = useState([]);
  const [isCoursesLoading, setIsCoursesLoading] = useState(true);
  const userDetails = useUserAuthInfo();
  const encryptedUData = localStorage.getItem('uData');
  const decryptedUData = CryptoJS.AES.decrypt(encryptedUData, process.env.REACT_APP_ENCRYPTION_SECRET).toString(CryptoJS.enc.Utf8);
  const uData = JSON.parse(decryptedUData);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const authToken = Cookies.get('authToken');

        const response = await axios.get(`${baseUrl_course}${API_GET_ALL_COURSES}`, {
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
        });

        const enrollmentResponse = await axios.get(`${baseUrl_enrollment}${API_GET_ENROLLMENT_BY_USERID}/${uData.userId}`, {
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
        });

        const enrollmentData = enrollmentResponse.data.enrollment;

        // Assuming response.data is an array of course details
        const fetchedCourseDetails = response.data;

        // Filter course details based on the user's enrolled courses
        const enrolledCourses = enrollmentData.courses;
        const filteredCourses = fetchedCourseDetails.filter(course => enrolledCourses.includes(course._id));

        // Set the filtered course details into the state
        setCourseDetails(filteredCourses);
        setIsCoursesLoading(false);
      } catch (error) {
        console.error('Error fetching course details:', error.message);
        setIsCoursesLoading(false);
      }
    };

    fetchCourseDetails();
  }, []);

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
                    <a href={NAVIGATE_TO_PAYMENTS}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Button bg='#0056d2' color='white' variant='solid' borderRadius='4px' size='lg'>
                          Payments<span style={{ paddingLeft: '8px' }}>
                            <i className="fa fa-arrow-right" style={{ fontSize: '18px' }} ></i>
                          </span>
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
            <h2 style={{ marginBottom: '25px' }}>your courses<i className="fa fa-arrow-right" style={{ fontSize: '25px', paddingLeft: '10px', color: '#0056d2' }}></i></h2>
            {isCoursesLoading ? (
              <Stack>
                <Skeleton height='20px' />
                <Skeleton height='20px' />
                <Skeleton height='20px' />
              </Stack>
            ) : (
              <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                {courseDetails.map((course, index) => (
                  <Card key={index}
                    maxW='sm'
                    borderRadius='20px'
                    boxShadow='0 0 0 1px #c7c7c7'
                    _hover={{ boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)' }}
                    padding='1px'>
                    <CardHeader>
                      <Heading size='md'>{course.title}</Heading>
                    </CardHeader>
                    <CardBody>
                      <Text noOfLines={3} overflow="hidden" textOverflow="ellipsis">
                        {course.description}
                      </Text>
                    </CardBody>
                    <CardFooter>
                      <a href={`/course?id=${course._id}`}>
                        <Button>Continue</Button>
                      </a>
                    </CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            )}
            <div className="buttons" style={{ paddingTop: '30px' }}>
              <Button bg='#0056d2' color='white' variant='solid' borderRadius='4px' size='lg' style={{ marginRight: '10px', marginTop: '10px' }}>
                Show {courseDetails?.length} more
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
