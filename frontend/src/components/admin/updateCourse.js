import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Button, Spinner, Textarea, Center } from "@chakra-ui/react";
import axios from "axios";
import { baseUrl_course, API_UPDATE_COURSE, API_GET_ALL_USERS, baseUrl_auth, API_GET_COURSE_BY_COURSEID } from "../../constant/apiConstant";
import { Alert, AlertIcon } from '@chakra-ui/react'
import { NAVIGATE_TO_ADMIN_PROFILE } from "../../constant/routeConstant";
import { useLocation } from 'react-router-dom';

export default function UpdateCourse() {
  const [instructors, setInstructors] = useState([]);
  const [courseData, setCourseData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const courseId = searchParams.get('id');

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const authToken = Cookies.get('authToken');
        const response = await axios.get(`${baseUrl_course}${API_GET_COURSE_BY_COURSEID}/${courseId}`, {
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
        });

        setCourseData(response.data);
        setIsPageLoading(false);
      } catch (error) {
        console.error('Error fetching course details:', error.message);
        console.log(error)
      }
    };

    const fetchInstructors = async () => {
      try {
        const authToken = Cookies.get('authToken');
        const response = await axios.get(`${baseUrl_auth}${API_GET_ALL_USERS}`, {
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
        });

        const filteredInstructors = response.data.filter(user => user.role === "Instructor");
        const formattedInstructors = filteredInstructors.map(instructor => ({
          value: instructor._id,
          label: instructor.username
        }));
        setInstructors(formattedInstructors);
      } catch (error) {
        console.error('Error fetching instructor details:', error.message);
      }
    };

    fetchCourseData();
    fetchInstructors();
  }, [courseId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const authToken = Cookies.get("authToken");
      const response = await axios.put(`${baseUrl_course}${API_UPDATE_COURSE}/${courseId}`, courseData, {
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
      });

      console.log("Course updated successfully:", response.data);
      window.scrollTo(0, 0);
      window.location.href = NAVIGATE_TO_ADMIN_PROFILE;
    } catch (error) {
      console.error("Error updating course:", error.response.data);
      setError(error.response.data);
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
            <h3 className="text-center" style={{ fontWeight: 400 }}>Update Courses</h3>
            {error &&
              <Alert status='error'>
                <AlertIcon />
                <h6 style={{ color: '#404040', fontWeight: 400 }}>Oops! {error}</h6>
              </Alert>
            }
            <form>

              <div className="form-group" style={{ marginBottom: "10px" }}>
                <label style={{ fontWeight: "bold", letterSpacing: "1px", fontSize: 12, marginBottom: "6px" }} >Title </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add Title"
                  name="title"
                  value={courseData.title || ''}
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

              <div className="form-group" style={{ marginBottom: "10px" }}>
                <label style={{ fontWeight: "bold", letterSpacing: "1px", fontSize: 12, marginBottom: "6px" }}>Description </label>
                <Textarea
                  type="text"
                  className="form-control"
                  placeholder="Add Description"
                  name="description"
                  value={courseData.description || ''}
                  onChange={handleInputChange}
                  style={{
                    border: "1px solid black",
                    borderRadius: "4px",
                    borderColor: "#0056d2",
                    fontSize: "16px",
                    padding: "10px",
                    height: "100px"
                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label style={{ fontWeight: "bold", letterSpacing: "1px", fontSize: 12, marginBottom: "6px" }}>Select Instructor</label>
                <select
                  className="form-control"
                  name="instructor"
                  value={courseData.instructor || ''}
                  onChange={handleInputChange}
                  style={{
                    border: "1px solid black",
                    borderRadius: "4px",
                    borderColor: "#0056d2",
                    fontSize: "16px",
                    padding: "10px",
                  }}
                >
                  <option value="">Select an Instructor</option>
                  {instructors.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: "10px" }}>
                <label style={{ fontWeight: "bold", letterSpacing: "1px", fontSize: 12, marginBottom: "6px" }}>Start Date</label>
                <input
                  type='datetime-local'
                  className="form-control"
                  placeholder='Select Date and Time'
                  name="startDate"
                  value={courseData.startDate ? new Date(courseData.startDate).toISOString().slice(0, 16) : ''}
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

              <div className="form-group" style={{ marginBottom: "10px" }}>
                <label style={{ fontWeight: "bold", letterSpacing: "1px", fontSize: 12, marginBottom: "6px" }}>End Date</label>
                <input
                  type='datetime-local'
                  className="form-control"
                  placeholder='Select Date and Time'
                  name="endDate"
                  value={courseData.endDate ? new Date(courseData.endDate).toISOString().slice(0, 16) : ''}
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

              <div className="form-group" style={{ marginBottom: "10px" }}>
                <label style={{ fontWeight: "bold", letterSpacing: "1px", fontSize: 12, marginBottom: "6px" }}>Price (LKR)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add Price"
                  name="price"
                  value={courseData.price || ''}
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
                <label style={{ fontWeight: "bold", letterSpacing: "1px", fontSize: 12, marginBottom: "6px" }}>Active</label>
                <select
                  className="form-control"
                  name="isActive"
                  value={courseData.isActive || ''}
                  onChange={handleInputChange}
                  style={{
                    border: "1px solid black",
                    borderRadius: "4px",
                    borderColor: "#0056d2",
                    fontSize: "16px",
                    padding: "10px",
                  }}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
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
                  onClick={handleUpdateCourse}
                >
                  {loading ? <Spinner size="sm" color="white" /> : "Update Course"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
