// services/stripeService.js
const { stripe, stripeConfig } = require('../config/stripe');
const { User } = require('../models');

class StripeService {
  
  // Create a new Stripe customer
  async createCustomer(user) {
    try {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user._id.toString(),
          environment: process.env.NODE_ENV
        }
      });
      
      // Update user with Stripe customer ID
      user.stripeCustomerId = customer.id;
      await user.save();
      
      return customer;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw new Error('Failed to create customer');
    }
  }
  
  // Create checkout session for subscription
  async createCheckoutSession(user, priceId = null) {
    try {
      // Ensure user has a Stripe customer ID
      if (!user.stripeCustomerId) {
        await this.createCustomer(user);
      }
      
      const price = priceId || stripeConfig.products.annual.priceId;
      
      const sessionConfig = {
        customer: user.stripeCustomerId,
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [
          {
            price: price,
            quantity: 1,
          },
        ],
        success_url: stripeConfig.successUrl,
        cancel_url: stripeConfig.cancelUrl,
        subscription_data: {
          trial_period_days: stripeConfig.trialPeriodDays,
          metadata: {
            userId: user._id.toString(),
            userEmail: user.email
          }
        },
        customer_update: {
          address: 'auto',
          name: 'auto'
        },
        metadata: {
          userId: user._id.toString(),
          userEmail: user.email
        }
      };
      
      // If user already has an active subscription, don't add trial
      if (user.subscriptionStatus === 'active') {
        delete sessionConfig.subscription_data.trial_period_days;
      }
      
      const session = await stripe.checkout.sessions.create(sessionConfig);
      
      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw new Error('Failed to create checkout session');
    }
  }
  
  // Create customer portal session
  async createPortalSession(user) {
    try {
      if (!user.stripeCustomerId) {
        throw new Error('User does not have a Stripe customer ID');
      }
      
      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: stripeConfig.returnUrl,
      });
      
      return session;
    } catch (error) {
      console.error('Error creating portal session:', error);
      throw new Error('Failed to create customer portal session');
    }
  }
  
  // Get subscription details
  async getSubscription(subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Error retrieving subscription:', error);
      throw new Error('Failed to retrieve subscription');
    }
  }
  
  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      });
      
      return subscription;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }
  
  // Reactivate subscription
  async reactivateSubscription(subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false
      });
      
      return subscription;
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw new Error('Failed to reactivate subscription');
    }
  }
  
  // Update subscription
  async updateSubscription(subscriptionId, params) {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, params);
      return subscription;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw new Error('Failed to update subscription');
    }
  }
  
  // Get customer's payment methods
  async getPaymentMethods(customerId) {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });
      
      return paymentMethods;
    } catch (error) {
      console.error('Error retrieving payment methods:', error);
      throw new Error('Failed to retrieve payment methods');
    }
  }
  
  // Get customer's invoices
  async getInvoices(customerId, limit = 10) {
    try {
      const invoices = await stripe.invoices.list({
        customer: customerId,
        limit: limit
      });
      
      return invoices;
    } catch (error) {
      console.error('Error retrieving invoices:', error);
      throw new Error('Failed to retrieve invoices');
    }
  }
  
  // Handle webhook events
  async handleWebhookEvent(event) {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event.data.object);
          break;
          
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object);
          break;
          
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object);
          break;
          
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;
          
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
          
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
          
        case 'customer.subscription.trial_will_end':
          await this.handleTrialWillEnd(event.data.object);
          break;
          
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Error handling webhook event:', error);
      throw error;
    }
  }
  
  // Handle successful checkout
  async handleCheckoutCompleted(session) {
    try {
      const userId = session.metadata.userId;
      const user = await User.findById(userId);
      
      if (!user) {
        console.error('User not found for checkout session:', userId);
        return;
      }
      
      // Get the subscription
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      
      // Update user subscription status
      user.stripeSubscriptionId = subscription.id;
      user.subscriptionStatus = subscription.status;
      user.subscriptionExpiry = new Date(subscription.current_period_end * 1000);
      
      await user.save();
      
      console.log(`Subscription created for user ${user.email}: ${subscription.id}`);
    } catch (error) {
      console.error('Error handling checkout completed:', error);
    }
  }
  
  // Handle subscription creation
  async handleSubscriptionCreated(subscription) {
    try {
      const userId = subscription.metadata.userId;
      const user = await User.findById(userId);
      
      if (!user) {
        console.error('User not found for subscription:', userId);
        return;
      }
      
      user.stripeSubscriptionId = subscription.id;
      user.subscriptionStatus = subscription.status;
      user.subscriptionExpiry = new Date(subscription.current_period_end * 1000);
      
      await user.save();
    } catch (error) {
      console.error('Error handling subscription created:', error);
    }
  }
  
  // Handle subscription updates
  async handleSubscriptionUpdated(subscription) {
    try {
      const userId = subscription.metadata.userId;
      const user = await User.findById(userId);
      
      if (!user) {
        console.error('User not found for subscription update:', userId);
        return;
      }
      
      user.subscriptionStatus = subscription.status;
      user.subscriptionExpiry = new Date(subscription.current_period_end * 1000);
      
      // Handle cancellation
      if (subscription.cancel_at_period_end) {
        user.subscriptionStatus = 'cancelled';
      }
      
      await user.save();
      
      console.log(`Subscription updated for user ${user.email}: ${subscription.status}`);
    } catch (error) {
      console.error('Error handling subscription updated:', error);
    }
  }
  
  // Handle subscription deletion
  async handleSubscriptionDeleted(subscription) {
    try {
      const userId = subscription.metadata.userId;
      const user = await User.findById(userId);
      
      if (!user) {
        console.error('User not found for subscription deletion:', userId);
        return;
      }
      
      user.subscriptionStatus = 'expired';
      user.subscriptionExpiry = new Date();
      
      await user.save();
      
      console.log(`Subscription deleted for user ${user.email}`);
    } catch (error) {
      console.error('Error handling subscription deleted:', error);
    }
  }
  
  // Handle successful payment
  async handlePaymentSucceeded(invoice) {
    try {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
      const userId = subscription.metadata.userId;
      const user = await User.findById(userId);
      
      if (!user) {
        console.error('User not found for payment:', userId);
        return;
      }
      
      // Update subscription expiry date
      user.subscriptionExpiry = new Date(subscription.current_period_end * 1000);
      user.subscriptionStatus = 'active';
      
      await user.save();
      
      console.log(`Payment succeeded for user ${user.email}: $${invoice.amount_paid / 100}`);
    } catch (error) {
      console.error('Error handling payment succeeded:', error);
    }
  }
  
  // Handle failed payment
  async handlePaymentFailed(invoice) {
    try {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
      const userId = subscription.metadata.userId;
      const user = await User.findById(userId);
      
      if (!user) {
        console.error('User not found for failed payment:', userId);
        return;
      }
      
      // You might want to send an email notification here
      console.log(`Payment failed for user ${user.email}: $${invoice.amount_due / 100}`);
      
      // Don't immediately cancel - Stripe has retry logic
      // Only update status if subscription becomes past_due or unpaid
      if (subscription.status === 'past_due' || subscription.status === 'unpaid') {
        user.subscriptionStatus = subscription.status;
        await user.save();
      }
    } catch (error) {
      console.error('Error handling payment failed:', error);
    }
  }
  
  // Handle trial ending soon
  async handleTrialWillEnd(subscription) {
    try {
      const userId = subscription.metadata.userId;
      const user = await User.findById(userId);
      
      if (!user) {
        console.error('User not found for trial ending:', userId);
        return;
      }
      
      // Send email notification about trial ending
      console.log(`Trial ending soon for user ${user.email}`);
      // TODO: Implement email notification
    } catch (error) {
      console.error('Error handling trial will end:', error);
    }
  }
  
  // Get pricing information
  async getPricing() {
    try {
      return {
        annual: {
          priceId: stripeConfig.products.annual.priceId,
          amount: stripeConfig.products.annual.amount,
          currency: stripeConfig.products.annual.currency,
          interval: stripeConfig.products.annual.interval,
          displayAmount: '$12.00',
          description: 'Annual powerlifting tracker subscription'
        }
      };
    } catch (error) {
      console.error('Error getting pricing:', error);
      throw new Error('Failed to get pricing');
    }
  }
  
  // Verify webhook signature
  verifyWebhookSignature(payload, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        stripeConfig.webhookEndpointSecret
      );
      return event;
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      throw new Error('Invalid webhook signature');
    }
  }
}

module.exports = new StripeService();