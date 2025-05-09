import React, { useState, useEffect } from "react";
import { baseUrl_course_content, API_GET_ALL_COURSE_CONTENT, API_DELETE_COURSE_CONTENT_BY_CONTENTID } from "../../constant/apiConstant";
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
import { Admin, Instructor } from "../../enums/enums";

export default function CourseContentsTable() {
  const [courseContent, setCourseContent] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const encryptedUData = localStorage.getItem('uData');
  const decryptedUData = CryptoJS.AES.decrypt(encryptedUData, process.env.REACT_APP_ENCRYPTION_SECRET).toString(CryptoJS.enc.Utf8);
  const uData = JSON.parse(decryptedUData);

  const isAdmin = uData?.role === Admin;

  useEffect(() => {
    fetchCourseContent();
  }, []);

  const fetchCourseContent = async () => {
    try {
      const authToken = Cookies.get("authToken");
      const response = await axios.get(`${baseUrl_course_content}${API_GET_ALL_COURSE_CONTENT}`, {
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
      });

      setCourseContent(response.data);
      setIsPageLoading(false);
    } catch (error) {
      console.error("Error fetching course content:", error);
    }
  };

  const deleteCourseContent = async (contentId) => {
    try {
      const authToken = Cookies.get('authToken');
      setCourseContent(prevCourseContent => prevCourseContent.map(content => ({
        ...content,
        isLoadingDelete: content._id === contentId ? true : content.isLoadingDelete,
      })));

      await axios.delete(`${baseUrl_course_content}${API_DELETE_COURSE_CONTENT_BY_CONTENTID}/${contentId}`, {
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json',
        },
      });

      setCourseContent(courseContent.filter(content => content._id !== contentId));
    } catch (error) {
      console.error('Error delete course content :', error.message);
    } finally {
      setCourseContent(prevCourseContent => prevCourseContent.map(content => ({
        ...content,
        isLoadingDelete: false,
      })));
    }
  };

  const handleEditClick = (contentId) => {
    window.location.href = `/updatecontent?id=${contentId}`;
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
                <Th>Course ID</Th>
                <Th>Title</Th>
                <Th>Type</Th>
                <Th>Content Url</Th>
                <Th>Edit</Th>
                <Th>Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {courseContent.map((content) => (
                <Tr key={content._id}>
                  <Td>{content.courseId}</Td>
                  <Td>{content.title}</Td>
                  <Td>{content.type}</Td>
                  <Td>{content.contentUrl}</Td>
                  <Td>
                    <IconButton
                      variant="outline"
                      color="#0056d2"
                      aria-label="Edit"
                      fontSize="20px"
                      size="sm"
                      icon={<EditIcon />}
                      isDisabled={isAdmin}
                      onClick={() => handleEditClick(content._id)}
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
                      onClick={() => deleteCourseContent(content._id)}
                      isLoading={content.isLoadingDelete}
                      isDisabled={isAdmin}
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
