import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Button, SimpleGrid, Card, CardBody, CardFooter, Image, Stack, Heading, Text, Spinner } from '@chakra-ui/react'
import { API_GET_ALL_COURSES, API_GET_USERS_BY_USERID, baseUrl_auth, baseUrl_course } from '../../constant/apiConstant';
import { COURSE_CARD_IMAGE, COURSE_CARD_LOGO } from '../../constant/imageConstant';
import { Link } from 'react-router-dom';
import { NAVIGATE_TO_REGISTER } from '../../constant/routeConstant';
import { PAGE_SPINNER_LOADING } from '../../constant/timeConstant';
import LoadingSpinner from '../spinner/spinner';

export default function Home() {

  const [courseDetails, setCourseDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setIsPageLoading(false);
  //   }, PAGE_SPINNER_LOADING);

  //   return () => clearTimeout(timeout);
  // }, []);

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

        // Fetch instructor details for each course
        const coursesWithInstructors = await Promise.all(
          response.data.map(async course => {
            const instructorResponse = await axios.get(`${baseUrl_auth}${API_GET_USERS_BY_USERID}/${course.instructor}`, {
              headers: {
                'Authorization': authToken,
                'Content-Type': 'application/json',
              },
            });
            const instructorName = instructorResponse.data.username;
            return { ...course, instructorName };
          })
        );
        setCourseDetails(coursesWithInstructors);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course details:', error.response.data);
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, []);

  return (
    <div>
      {/* <div className='overlay' style={{ display: isPageLoading ? 'block' : 'none' }}>
        {isPageLoading && <LoadingSpinner />}
      </div> */}
      <div className='home-container'>
        <div className='content'>
          <div className='text'>
            <h1 style={{ fontSize: '75px', fontWeight: 'bold' }}>Learn without limits</h1>
            <p>Start, switch, or advance your career with more than 6,900 courses, Professional Certificates, and degrees from world-className universities and companies.</p>
            <div className="buttons">
              <Link to={NAVIGATE_TO_REGISTER}>
                <Button bg='#0056d2' color='white' variant='solid' borderRadius='4px' size='lg' style={{ marginRight: '10px', marginTop: '10px' }}>
                  Join for free
                </Button>
              </Link>
              <Button bg='white' color='#0056d2' borderColor='#0056d2' variant='outline' borderRadius='4px' size='lg' style={{ marginRight: '10px', marginTop: '10px' }}>
                Try Learnopia for Business
              </Button>
            </div>
          </div>
          <div className='image'>
            <img src='https://static.wixstatic.com/media/618c8c_4644a26692024536b501e2df9de73a69~mv2.png' alt='Your Image' width='500' />
          </div>
        </div>
      </div>
      <div className='heading-container' style={{ paddingBottom: '40px' }}>
        <h3>Degree Programs</h3>
        <h1 style={{ color: '#0056d2' }}>Get a head start on a degree today</h1>
        <h4 style={{ color: '#404040', fontWeight: 400 }}>With these programs, you can build valuable skills, earn career credentials, and make progress toward a degree before you even enroll.</h4>
      </div>
      <div className='card-container' >
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100px' }}>
            <Spinner size="xl" color="blue.500" />
          </div>
        ) : (
          <SimpleGrid
            columns="repeat(auto-fill, minmax(250px, 1fr))"
            spacing={8}
            templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
          >
            {courseDetails.map(course => (
              <div key={course.id}>
                <Card
                  maxW="sm"
                  borderRadius="20px"
                  boxShadow="0 0 0 1px #c7c7c7"
                  _hover={{ boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)" }}
                >
                  <CardBody>
                    <Image
                      src={COURSE_CARD_IMAGE}
                      alt={course.name}
                      borderRadius="lg"
                    />
                    <Stack mt="6" spacing="3">
                      <div className="card-body d-flex align-items-center">
                        <img
                          src={COURSE_CARD_LOGO}
                          className="card-logo-top img-with-border"
                          alt="..."
                        />
                        <h6 style={{ color: "gray", fontWeight: 400, fontSize: 15, marginLeft: "10px" }}>
                          {course.instructorName}
                        </h6>
                      </div>
                      <Heading size="md">{course.title}</Heading>
                      <Text noOfLines={3} overflow="hidden" textOverflow="ellipsis" color='grey'>
                        {course.description}
                      </Text>
                    </Stack>
                  </CardBody>
                  <CardFooter>
                    <div className="col text-start">
                      <h6 style={{ color: "#0056d2", fontWeight: 400, fontSize: 15 }}>
                        <i className="fa fa-graduation-cap" aria-hidden="true"></i> IT
                      </h6>
                      <h6 style={{ color: "gray", fontWeight: 400, fontSize: 15 }}>Degree</h6>
                    </div>
                    <div className="col text-end">
                      <a href={`/coursepage?id=${course._id}`}>
                        <button
                          className="btn rounded-circle shadow-lg"
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "60px",
                          }}
                        >
                          <i className="fa fa-arrow-right" style={{ fontSize: "25px" }}></i>
                        </button>
                      </a>
                    </div>
                  </CardFooter>
                </Card>
              </div>
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

  );
}

