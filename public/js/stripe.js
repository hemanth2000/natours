/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51IvPx7SHFHQCanp9fURUGlKADsX6sg4mhrl5ykhxur8OuGA1iQ3iEbJTTO7WRXceLzitVvYpDQ7pFTqcE8hvhKoy00Y0jZs19R'
  );

  try {
    //1) Get session from API
    const session = await axios(`/api/v1/booking/checkout-session/${tourId}`);

    console.log(session);
    //2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
