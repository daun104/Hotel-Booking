const paymentService = require('../services/payment.service');

/**
 * POST /api/v1/payments/create-checkout-session
 */
async function createCheckoutSession(req, res) {
  try {
    const result = await paymentService.createCheckoutSession({
      bookingId: req.body.bookingId,
      user: req.user, // auth middleware attaches { id, role }
      successUrl: req.body.successUrl,
      cancelUrl: req.body.cancelUrl,
    });
    return res.json(result);
  } catch (err) {
    console.error('❌ Error in createCheckoutSession:', err.message);
    const status = err.status || 500;
    return res.status(status).json({ error: err.message });
  }
}

/**
 * POST /api/v1/payments/webhook
 * NOTE: app.js registers this route with express.raw so req.body is the raw payload (Buffer/string)
 */
async function stripeWebhook(req, res) {
  try {
    const rawBody = req.body; // express.raw provides raw body here (Buffer)
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      console.warn('⚠️ Stripe webhook missing signature header');
      return res.status(400).send('Missing Stripe signature');
    }

    console.log('🔔 Stripe webhook received. Signature present.');

    const result = await paymentService.handleWebhook({ rawBody, signature });

    // Stripe requires a 200 response quickly, even if we just ack
    return res.status(200).json({ received: true, result });
  } catch (err) {
    console.error('❌ Error in stripeWebhook:', err.message);
    const status = err.status || 500;
    // Stripe expects plain text error message
    return res.status(status).send(`Webhook Error: ${err.message}`);
  }
}

module.exports = {
  createCheckoutSession,
  stripeWebhook,
};
