//Frontend Url
export const origin = 'http://localhost:3000';

//baseUrl's
export const baseUrl_auth = 'http://authenticate-alb-1441365872.us-east-1.elb.amazonaws.com';
export const baseUrl_course = 'http://course-alb-935752098.us-east-1.elb.amazonaws.com';
export const baseUrl_payment = 'http://payment-alb-659637058.us-east-1.elb.amazonaws.com';
export const baseUrl_course_content = 'http://content-alb-1318745521.us-east-1.elb.amazonaws.com';
export const baseUrl_notification = 'http://localhost:8020';
export const baseUrl_enrollment = 'http://enrollment-alb-163822510.us-east-1.elb.amazonaws.com';

//POST API's
export const API_POST_LOGIN = '/api/auth/login';
export const API_POST_REGISTER = '/api/auth/register';
export const API_POST_HANDLE_PAYMENT = '/api/payment/paymentrequest';
export const API_POST_PAYMENT = '/api/payment/checkout';
export const API_POST_COURSE = '/api/course/'
export const API_POST_COURSE_CONTENT = '/api/content/'
export const API_POST_NOTIFICATION = '/api/notification/'
export const API_POST_ENROLLMENT = '/api/enrollment/'

//GET API's
export const API_GET_USERS_BY_USERID = '/api/auth/users';
export const API_GET_COURSE_BY_COURSEID = '/api/course';
export const API_GET_COURSE_CONTENT_BY_CONTENTID = '/api/content/v2';
export const API_GET_ALL_COURSES = '/api/course/'
export const API_GET_ALL_COURSE_CONTENT = '/api/content/'
export const API_GET_ALL_USERS = '/api/auth/users'
export const API_GET_ALL_COURSE_CONTENT_BY_COURSEID = '/api/content/v1'
export const API_GET_ALL_PAYMENTS_BY_USERID = '/api/payment'
export const API_GET_ENROLLMENT_BY_USERID = '/api/enrollment'

//DELETE API's
export const API_DELETE_COURSE_BY_COURSEID = '/api/course';
export const API_DELETE_COURSE_CONTENT_BY_CONTENTID = '/api/content';

//UPDATE API's
export const API_UPDATE_COURSE = '/api/course'
export const API_UPDATE_CONTENT = '/api/content'