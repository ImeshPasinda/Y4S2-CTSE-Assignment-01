import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Alert, AlertIcon, Button, Spinner, FormControl, Input, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import { baseUrl_auth, API_POST_REGISTER, baseUrl_notification, API_POST_NOTIFICATION } from '../../constant/apiConstant';
import { NAVIGATE_TO_LOGIN } from '../../constant/routeConstant';
import { CREATED, REGISTER_SUCCESS_TEMPLATE } from '../../constant/commonConstant';
import { Instructor, Student } from '../../enums/enums';
import { EMAIL_PATTERN } from '../../constant/commonConstant';

export default function Register() {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(Student);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [userNameTouched, setuserNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);

  const authToken = Cookies.get('authToken');

  const isUserNameError = !username && userNameTouched;
  const isEmailError = !email && emailTouched;
  const isPasswordError = !password && passwordTouched;

  const handleRegister = async () => {
    try {
      if (!username || !email || !password) {
        setuserNameTouched(true)
        setEmailTouched(true);
        setPasswordTouched(true);
        return;
      }

      if (!EMAIL_PATTERN.test(email)) {
        setIsInvalidEmail(true);
        return;
      } else {
        setIsInvalidEmail(false);
      }
      setIsRegistering(true);
      const response = await axios.post(`${baseUrl_auth}${API_POST_REGISTER}`, {
        username,
        role,
        email,
        password,
      });
      if (response.status === CREATED) {
        // Registration successful, now send notification
        const notificationData = {
          email: email,
          username: username,
          userId: null,
          subject: "Register Successfully!",
          "content": {
            "template_type": REGISTER_SUCCESS_TEMPLATE
          }
        };
        // Parallel request to send notification
        const notificationResponse = await axios.post(`${baseUrl_notification}${API_POST_NOTIFICATION}`, notificationData, {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        });
        // Check if notification sending was successful
        if (notificationResponse.status === CREATED) {
          window.location.href = NAVIGATE_TO_LOGIN;
        } else {
          setError("Error sending notification");
        }
      }
    } catch (error) {
      console.error('Registration error:', error.response.data.message);
      setError(error.response.data.message);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center" style={{ marginTop: '100px', paddingLeft: '40px', paddingRight: '40px' }}>
      <div className="col-md-3">
        <h3 className="text-center" style={{ fontWeight: 400 }}>Sign up</h3>
        <h5 className="text-center" style={{ fontWeight: 350, fontSize: 20 }}>Learn on your own time from top universities and businesses.</h5>
        <form>
          {error &&
            <Alert status='error'>
              <AlertIcon />
              <h6 style={{ color: '#404040', fontWeight: 400 }}>Oops! {error}. It seems there's a hiccup in your register. Please give it another shot.</h6>
            </Alert>
          }
          <div className="form-group" style={{ marginBottom: '15px', marginTop: '15px' }}>
            <FormLabel style={{ fontWeight: 'bold', letterSpacing: '1px', fontSize: 12, marginBottom: '6px' }}>USERNAME</FormLabel>
            <FormControl isInvalid={isUserNameError}>
              <Input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                borderColor='#0056d2'
                height="45px"
                onBlur={() => setuserNameTouched(true)}
                onChange={(e) => setUsername(e.target.value)}
              />
              {isUserNameError && (
                <FormErrorMessage>Username is required.</FormErrorMessage>
              )}
            </FormControl>
          </div>
          <div className="form-group" style={{ marginBottom: '15px', marginTop: '15px' }}>
            <label style={{ fontWeight: 'bold', letterSpacing: '1px', fontSize: 12, marginBottom: '6px' }}>STUDENT/INSTRUCTOR</label>
            <select
              className="form-control"
              placeholder="Student or Instructor"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ border: '1px solid black', borderRadius: '4px', borderColor: '#0056d2', fontSize: '16px', padding: '10px' }}
            > <option value={Student}>{Student}</option>
              <option value={Instructor}>{Instructor}</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <FormLabel style={{ fontWeight: 'bold', letterSpacing: '1px', fontSize: 12, marginBottom: '6px' }}>EMAIL</FormLabel>
            <FormControl isInvalid={isEmailError || isInvalidEmail}>
              <Input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                borderColor='#0056d2'
                height="45px"
                onBlur={() => setEmailTouched(true)}
                onChange={(e) => setEmail(e.target.value)}
              />
              {isEmailError && (
                <FormErrorMessage>Email is required.</FormErrorMessage>
              )}
              {isInvalidEmail && (
                <FormErrorMessage>Invalid email.</FormErrorMessage>
              )}
            </FormControl>
          </div>
          <div className="form-group" style={{ marginBottom: '10px' }}>
            <FormLabel style={{ fontWeight: 'bold', letterSpacing: '1px', fontSize: 12, marginBottom: '6px' }}>PASSWORD</FormLabel>
            <FormControl isInvalid={isPasswordError}>
              <Input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                borderColor='#0056d2'
                height="45px"
                onBlur={() => setPasswordTouched(true)}
                onChange={(e) => setPassword(e.target.value)}
              />
              {isPasswordError && (
                <FormErrorMessage>Password is required.</FormErrorMessage>
              )}
            </FormControl>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Button bg='#0056d2' color='white' variant='solid' borderRadius='4px' size='lg' type="button"
              className="btn btn-primary mt-3"
              onClick={handleRegister}
              disabled={isRegistering}
            >
              {isRegistering ? <Spinner size="sm" color="white" /> : 'Join for Free'}
            </Button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <hr style={{ flex: '1', margin: '0' }} />
              <span style={{ color: 'gray' }}>or</span>
              <hr style={{ flex: '1', margin: '0' }} />
            </div>

            <Button bg='white' color='black' borderColor='black' variant='outline' borderRadius='4px' size='lg' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', maxWidth: '100%' }}>
              <img src="https://img.icons8.com/?size=256&id=V5cGWnc9R4xj&format=png" alt="Google Logo" style={{ marginRight: '8px', height: '30px', width: '30px' }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: 'auto', marginRight: 'auto' }}>Continue with Google</span>
            </Button>

            <Button bg='white' color='black' borderColor='black' variant='outline' borderRadius='4px' size='lg' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', maxWidth: '100%' }}>
              <img src="https://img.icons8.com/?size=256&id=13912&format=png" alt="Facebook Logo" style={{ marginRight: '8px', height: '30px', width: '30px' }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: 'auto', marginRight: 'auto' }}>Continue with Facebook</span>
            </Button>

            <Button bg='white' color='black' borderColor='black' variant='outline' borderRadius='4px' size='lg' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', maxWidth: '100%' }}>
              <img src="https://img.icons8.com/?size=256&id=30840&format=png" alt="Apple Logo" style={{ marginRight: '8px', height: '30px', width: '30px' }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: 'auto', marginRight: 'auto' }}>Continue with Apple</span>
            </Button>

          </div>
          <h5 className="text-center" style={{ fontWeight: 350, fontSize: 15, marginTop: '20px' }}>
            Already on Learnopia? <a href={NAVIGATE_TO_LOGIN} style={{ color: '#0056d2', textDecoration: 'underline' }}>Login</a>
          </h5>
        </form>
      </div>
    </div>
  );
};
