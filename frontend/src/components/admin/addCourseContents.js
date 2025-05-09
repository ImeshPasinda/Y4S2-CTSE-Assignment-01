import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Button, Spinner, Center } from "@chakra-ui/react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { baseUrl_course_content, baseUrl_course, API_GET_ALL_COURSES, API_POST_COURSE_CONTENT } from "../../constant/apiConstant";
import {
  Alert,
  AlertIcon
} from '@chakra-ui/react'
import { NAVIGATE_TO_ADMIN_PROFILE } from "../../constant/routeConstant";

export default function AddCourseContents() {

  const [courses, setcourse] = useState([]);
  const [contentData, setContentData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const encryptedUData = localStorage.getItem('uData');
  const decryptedUData = CryptoJS.AES.decrypt(encryptedUData, process.env.REACT_APP_ENCRYPTION_SECRET).toString(CryptoJS.enc.Utf8);
  const uData = JSON.parse(decryptedUData);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const authToken = Cookies.get('authToken');
        const response = await axios.get(`${baseUrl_course}${API_GET_ALL_COURSES}`, {
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
        });

        // Filter course with realted "Instructor"
        const filteredCourse = response.data.filter(course => course.instructor === uData.userId);

        // Extract _id and title of courses
        const formattedCourses = filteredCourse.map(course => ({
          value: course._id,
          label: course.title
        }));
        setcourse(formattedCourses);
        setIsPageLoading(false);
      } catch (error) {
        console.error('Error fetching course details:', error.message);
      }
    };

    fetchCourses();
  }, []);

  const handleAddContent = async (e) => {
    console.log(contentData)
    e.preventDefault();
    setLoading(true);
    try {
      const authToken = Cookies.get("authToken");
      const response = await axios.post(`${baseUrl_course_content}${API_POST_COURSE_CONTENT}`, contentData, {
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
      });
      console.log("Course content added successfully:", response.data);
      window.scrollTo(0, 0);
      window.location.href = NAVIGATE_TO_ADMIN_PROFILE;
      setContentData({
        title: "",
        contentUrl: ""
      });
    } catch (error) {
      console.error("Error adding course content:", error.response.data);
      setError(error.response.data.message);
      window.scrollTo(0, 0);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isPageLoading ? (
        <Center h="100vh"> <Spinner size="xl" style={{ color: '#0056d2' }} /></Center>
      ) : (
        <div className="container-fluid d-flex align-items-center justify-content-center" style={{ marginTop: '100px', paddingLeft: '40px', paddingRight: '40px' }}>
          <div className="col-md-3" >
            <h3 className="text-center" style={{ fontWeight: 400 }}>Add Course Content</h3>
            {error &&
              <Alert status='error'>
                <AlertIcon />
                <h6 style={{ color: '#404040', fontWeight: 400 }}>Oops! {error}</h6>
              </Alert>
            }
            <form>

              <div className="form-group" style={{ marginBottom: "10px" }}>
                <label style={{ fontWeight: "bold", letterSpacing: "1px", fontSize: 12, marginBottom: "6px" }} >Course</label>

                <select
                  className="form-control"
                  name="courseId"
                  placeholder="select course"
                  value={contentData.courseId}
                  onChange={handleInputChange}
                  style={{
                    border: "1px solid black",
                    borderRadius: "4px",
                    borderColor: "#0056d2",
                    fontSize: "16px",
                    padding: "10px",
                  }}
                >
                  <option value="">Select a Course</option>
                  {courses.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: "10px" }}>
                <label style={{ fontWeight: "bold", letterSpacing: "1px", fontSize: 12, marginBottom: "6px" }}>Title </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add Title"
                  name="title"
                  value={contentData.title}
                  onChange={handleInputChange}
                  style={{
                    border: "1px solid black",
                    borderRadius: "4px",
                    borderColor: "#0056d2",
                    fontSize: "16px",
                    padding: "10px",
                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label style={{ fontWeight: "bold", letterSpacing: "1px", fontSize: 12, marginBottom: "6px" }}>Type</label>
                <select
                  className="form-control"
                  name="type"
                  value={contentData.type}
                  onChange={handleInputChange}
                  style={{
                    border: "1px solid black",
                    borderRadius: "4px",
                    borderColor: "#0056d2",
                    fontSize: "16px",
                    padding: "10px",
                  }}
                >
                  <option value="">Select Type</option>
                  <option value="Lecture">Lecture</option>
                  <option value="Video">Video</option>
                  <option value="Quize">Quize</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: "10px" }}>
                <label style={{ fontWeight: "bold", letterSpacing: "1px", fontSize: 12, marginBottom: "6px" }}>Content Url</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add Content Url"
                  name="contentUrl"
                  value={contentData.contentUrl}
                  onChange={handleInputChange}
                  style={{
                    border: "1px solid black",
                    borderRadius: "4px",
                    borderColor: "#0056d2",
                    fontSize: "16px",
                    padding: "10px",
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Button
                  bg='#0056d2'
                  color='white'
                  variant='solid'
                  borderRadius='4px'
                  size='lg'
                  type="button"
                  className="btn btn-primary mt-3"
                  onClick={handleAddContent}
                >
                  {loading ? <Spinner size="sm" color="white" /> : "Add Course Content"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
