import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { baseUrl_auth, API_GET_USERS_BY_USERID } from '../../constant/apiConstant';
import { decodeAuthToken } from '../../utils/utility';

export default function useUserAuthInfo() {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const authToken = Cookies.get('authToken');
        const decodedToken = decodeAuthToken(authToken);

        if (!decodedToken) {
          return;
        }

        const userId = decodedToken.userId;

        const response = await axios.get(`${baseUrl_auth}${API_GET_USERS_BY_USERID}/${userId}`, {
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
        });

        const user = response.data;
        setUserDetails(user);
      } catch (error) {
        console.error('Error fetching user details:', error.message);
      }
    };

    fetchUserDetails();
  }, []);

  return userDetails;
};

