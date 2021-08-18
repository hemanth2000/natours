/* eslint-disable */

import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateUser, updatePassword } from './user';
import { bookTour } from './stripe';
import { signup } from './signup';

//DOM ELEMENTS

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const bookBtn = document.getElementById('book--tour');
const signInForm = document.querySelector('.form--signup');

// USER ACCOUNT UPDATES
const userData = document.querySelector('.form-user-data');
const userSettings = document.querySelector('.form-user-settings');
const fileUpload = document.getElementById('imgFile');

//DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //VALUES
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (signInForm) {
  signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    await signup(name, email, password, confirmPassword);

    document.getElementById('name').value = name;
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirmPassword').value = '';
  });
}

if (fileUpload) {
  fileUpload.accept = 'image/*';
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (userData) {
  userData.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateUser(form, 'data');
  });
}

if (userSettings) {
  userSettings.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--savepass').textContent = 'Updating...';
    const password = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const newConfirmPassword =
      document.getElementById('password-confirm').value;

    await updatePassword(password, newPassword, newConfirmPassword);
    document.querySelector('.btn--savepass').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', async (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    await bookTour(tourId);
    e.target.textContent = 'Book Tour!';
  });
}
