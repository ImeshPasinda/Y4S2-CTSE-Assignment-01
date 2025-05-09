import React, { useState, useEffect } from "react";
import { baseUrl_course, API_GET_ALL_COURSES, API_DELETE_COURSE_BY_COURSEID } from "../../constant/apiConstant";
import Cookies from "js-cookie";
import axios from "axios";
import CryptoJS from "crypto-js";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { truncateDescription } from "../../utils/utility";
import { Admin, Instructor } from "../../enums/enums";

export default function CoursesTable() {
  const [courses, setCourses] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const encryptedUData = localStorage.getItem('uData');
  const decryptedUData = CryptoJS.AES.decrypt(encryptedUData, process.env.REACT_APP_ENCRYPTION_SECRET).toString(CryptoJS.enc.Utf8);
  const uData = JSON.parse(decryptedUData);

  const isInstructor = uData?.role === Instructor;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const authToken = Cookies.get("authToken");
      const response = await axios.get(`${baseUrl_course}${API_GET_ALL_COURSES}`, {
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
      });

      setCourses(response.data);
      setIsPageLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      const authToken = Cookies.get('authToken');
      setCourses(prevCourses => prevCourses.map(course => ({
        ...course,
        isLoadingDelete: course._id === courseId ? true : course.isLoadingDelete,
      })));

      await axios.delete(`${baseUrl_course}${API_DELETE_COURSE_BY_COURSEID}/${courseId}`, {
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json',
        },
      });

      setCourses(courses.filter(course => course._id !== courseId));
    } catch (error) {
      console.error('Error delete course :', error.message);
    } finally {
      setCourses(prevCourses => prevCourses.map(course => ({
        ...course,
        isLoadingDelete: false,
      })));
    }
  };

  const handleEditClick = (courseId) => {
    window.location.href = `/updatecourse?id=${courseId}`;
  };

  return (
    <div>
      {isPageLoading ? (
        <Center h="100vh"> <Spinner size="xl" style={{ color: '#0056d2' }} /></Center>
      ) : (
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Description</Th>
                <Th>Start date</Th>
                <Th>End date</Th>
                <Th>Price</Th>
                <Th>Active</Th>
                <Th>Edit</Th>
                <Th>Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {courses.map((course) => (
                <Tr key={course._id}>
                  <Td>{course.title}</Td>
                  <Td>{truncateDescription(course.description, 50)}</Td>
                  <Td>{new Date(course.startDate).toLocaleDateString()}</Td>
                  <Td>{new Date(course.endDate).toLocaleDateString()}</Td>
                  <Td>{course.price}</Td>
                  <Td>{course.isActive ? "Yes" : "No"}</Td>
                  <Td>
                    <IconButton
                      variant="outline"
                      color="#0056d2"
                      aria-label="Edit"
                      fontSize="20px"
                      size="sm"
                      icon={<EditIcon />}
                      isDisabled={isInstructor}
                      onClick={() => handleEditClick(course._id)}
                    />
                  </Td>
                  <Td>
                    <IconButton
                      variant="outline"
                      color="#0056d2"
                      aria-label="Delete"
                      fontSize="20px"
                      size="sm"
                      icon={<DeleteIcon />}
                      onClick={() => deleteCourse(course._id)}
                      isLoading={course.isLoadingDelete}
                      isDisabled={isInstructor}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};
