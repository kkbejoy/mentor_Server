const { session } = require("passport");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//Create a Stripe Subscrition for New Mentors
const createSubscribableProduct = async (
  productName,
  // planName,
  // interval,
  priceAmount
  // currency
) => {
  try {
    // Create a product (if it doesn't exist already)
    const product = await stripe.products.create({
      name: productName,
    });

    // Create a subscription plan for the product
    const price = await stripe.prices.create({
      product: product.id,
      nickname: "Monthly Fees",
      recurring: { interval: "month" },
      unit_amount: priceAmount * 100, // Amount in INR, conversionto rs
      currency: "inr",
    });

    console.log("Subscription Plan Created:");
    console.log("Product ID:", product.id);
    console.log("Price ID (Plan ID):", price.id);

    return price.id; // Return the Price ID (Plan ID)
  } catch (error) {
    console.error("Error creating subscription plan:", error.message);
    throw error;
  }
};

// //Create a subscription for  a Mentees
// const subscribeMenteeToProduct = async (priceId, email) => {
//   try {
//     // Create a new customer

//     // Retrieve the subscription plan details based on Price ID
//     const price = await stripe.prices.retrieve(priceId);

//     // Create a subscription for the customer with the selected plan
//     const subscription = await stripe.subscriptions.create({
//       customer: customer.id,
//       items: [{ price: price.id }],
//     });
//     console.log("Subsciption detalis", subscription);
//     return subscription;
//   } catch (error) {
//     console.error("Error subscribing user to plan:", error);
//     throw error;
//   }
// };

//Create Payment Checkout
const createCheckoutSession = async (
  subscriptionPriceId,
  MenteeStripeId,
  email,
  mentorId
) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: subscriptionPriceId,
          quantity: 4,
        },
      ],
      success_url: `${process.env.CLIENT_url}/mentees/payment/success/${mentorId}`,
      cancel_url: process.env.CLIENT_url + "/mentees/payment/failed",

      customer: MenteeStripeId,
      // customer_email: email,
    });

    return session;
  } catch (error) {
    console.error("Error creating Checkout Session:", error);
    throw error;
  }
};

//Create a new Stripe customer
const createStripeCustomer = async (name, email, referenceId) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        reference_id: referenceId,
      },
    });

    return customer;
  } catch (error) {
    throw error;
  }
};

//Get subsription id from check out id

const fetchSubsctiptionId = async (checkoutSessionId) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
    const subscriptuionId = session.subscription;
    return subscriptuionId;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  createSubscribableProduct,
  // subscribeMenteeToProduct,
  createCheckoutSession,
  createStripeCustomer,
  fetchSubsctiptionId,
};
