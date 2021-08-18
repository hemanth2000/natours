/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const updateUser = async (data, type) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMe',
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Details updated successfully!');
      location.reload();
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updatePassword = async (
  password,
  newPassword,
  newConfirmPassword
) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updatePassword',
      data: {
        password,
        newPassword,
        newConfirmPassword,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Password updated successfully!');
      location.reload();
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
