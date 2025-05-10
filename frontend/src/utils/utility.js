import Cookies from 'js-cookie';
import { NAVIGATE_TO_LOGIN } from "../constant/routeConstant";

export const decodeAuthToken = (authToken) => {
  if (!authToken) {
    return null;
  }

  const base64Url = authToken.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(atob(base64));
};

export const truncateDescription = (description, maxLength) => {
  if (description.length <= maxLength) {
    return description;
  } else {
    return description.substring(0, maxLength) + "...";
  }
};

export const getFormattedDate = (dateString) => {

  const date = new Date(dateString);

  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];

  const month = months[date.getMonth()];
  const day = date.getDate();

  return `${month} ${day}`;
};

export const formatTransactionDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
  return date.toLocaleString('en-US', options);
};

export const generateTransactionId = () => {
  // Generate today's date in the format YYYYMMDD
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}${month}${day}`;

  // Generate four random digits
  const randomDigits = Math.floor(1000 + Math.random() * 9000);

  // Concatenate the components to form the transaction ID
  const transactionId = `#LNP${formattedDate}${randomDigits}`;

  return transactionId;
};

export const maskEmail = (email) => {
  const atIndex = email.indexOf('@');
  const firstThreeLetters = email.substring(0, 3);
  const domain = email.substring(atIndex + 1);
  return `${firstThreeLetters}**@${domain}`;
};

export const handleLogout = () => {
  // Remove the authToken from cookies
  Cookies.remove('authToken');
  localStorage.clear();
  window.location.href = NAVIGATE_TO_LOGIN;
};


