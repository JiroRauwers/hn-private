# Polar Sponsorship System Setup Guide

This guide explains how to configure the Polar payment integration for server sponsorships.

## Overview

The sponsorship system allows server owners to purchase promotional placements:
- **Featured Spot**: Top 3 positions on homepage ($9.99-$199.99)
- **Premium Listing**: Enhanced server card everywhere ($4.99-$99.99)
- **Bump**: Temporary top placement ($1.99-$4.99)

## Prerequisites

1. Polar account (sign up at https://polar.sh)
2. Database with sponsorships table migrated
3. Polar SDK installed (already configured in this project)

## Step 1: Database Migration

Update the sponsorship type enum in your database:

```bash
# The schema has been updated to use 'featured', 'premium', 'bump'
# Run your migration tool to update the database
npm run db:push
# or
npx drizzle-kit push
```

## Step 2: Create Products in Polar Dashboard

### A. Access Polar Dashboard
1. Go to https://polar.sh/dashboard
2. Navigate to **Products** section

### B. Create Featured Spot Products

Create 3 products for Featured Spot:

**Product 1: Featured Spot - 1 Day**
- Name: `Featured Spot - 1 Day`
- Description: `Top position on homepage for 24 hours`
- Price: `$9.99` (one-time payment)
- Type: One-time purchase

**Product 2: Featured Spot - 7 Days**
- Name: `Featured Spot - 7 Days`
- Description: `Top position on homepage for 7 days`
- Price: `$59.99` (one-time payment)
- Type: One-time purchase

**Product 3: Featured Spot - 30 Days**
- Name: `Featured Spot - 30 Days`
- Description: `Top position on homepage for 30 days`
- Price: `$199.99` (one-time payment)
- Type: One-time purchase

### C. Create Premium Listing Products

Create 3 products for Premium Listing:

**Product 1: Premium Listing - 1 Day**
- Name: `Premium Listing - 1 Day`
- Description: `Enhanced server card with highlighted border for 24 hours`
- Price: `$4.99` (one-time payment)

**Product 2: Premium Listing - 7 Days**
- Name: `Premium Listing - 7 Days`
- Description: `Enhanced server card with highlighted border for 7 days`
- Price: `$29.99` (one-time payment)

**Product 3: Premium Listing - 30 Days**
- Name: `Premium Listing - 30 Days`
- Description: `Enhanced server card with highlighted border for 30 days`
- Price: `$99.99` (one-time payment)

### D. Create Bump Products

Create 2 products for Bump:

**Product 1: Bump - 1 Hour**
- Name: `Bump - 1 Hour`
- Description: `Move server to top of category for 1 hour`
- Price: `$1.99` (one-time payment)

**Product 2: Bump - 3 Hours**
- Name: `Bump - 3 Hours`
- Description: `Move server to top of category for 3 hours`
- Price: `$4.99` (one-time payment)

### E. Copy Product Price IDs

After creating each product:
1. Click on the product
2. Copy the **Product Price ID** (starts with `prcp_...`)
3. Save these IDs for the next step

## Step 3: Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# Polar Access Token (from Polar Dashboard → Settings → API Keys)
POLAR_ACCESS_TOKEN=polar_oat_your-access-token

# Polar Webhook Secret (we'll set this up in Step 4)
POLAR_WEBHOOK_SECRET=polar_wh_your-webhook-secret

# Success URL (update domain for production)
POLAR_SUCCESS_URL=https://yourdomain.com/dashboard/sponsorships/success?checkout_id={CHECKOUT_ID}

# Product Price IDs (from Step 2)
POLAR_FEATURED_DAILY_PRICE_ID=prcp_xxx
POLAR_FEATURED_WEEKLY_PRICE_ID=prcp_xxx
POLAR_FEATURED_MONTHLY_PRICE_ID=prcp_xxx

POLAR_PREMIUM_DAILY_PRICE_ID=prcp_xxx
POLAR_PREMIUM_WEEKLY_PRICE_ID=prcp_xxx
POLAR_PREMIUM_MONTHLY_PRICE_ID=prcp_xxx

POLAR_BUMP_1H_PRICE_ID=prcp_xxx
POLAR_BUMP_3H_PRICE_ID=prcp_xxx

# Cron Secret (generate with: openssl rand -base64 32)
CRON_SECRET=your-cron-secret
```

## Step 4: Set Up Webhooks

### A. Deploy Your Application
First, deploy your application to get a public URL.

### B. Configure Webhook in Polar
1. Go to Polar Dashboard → **Settings** → **Webhooks**
2. Click **Add Endpoint**
3. Enter webhook URL: `https://yourdomain.com/api/webhooks/polar`
4. Select events:
   - `checkout.created`
   - `checkout.updated`
   - `order.created`
5. Click **Create**
6. Copy the **Webhook Secret** (starts with `polar_wh_...`)
7. Add it to your `.env.local` as `POLAR_WEBHOOK_SECRET`

### C. Test Webhook (Local Development)
For local testing, use ngrok:

```bash
# Start ngrok
ngrok http 3000

# Use the ngrok URL for webhook:
# https://your-ngrok-url.ngrok.io/api/webhooks/polar
```

## Step 5: Set Up Cron Job

Configure automatic expiration checking:

### For Vercel:
Create `vercel.json` in project root:

```json
{
  "crons": [{
    "path": "/api/cron/expire-sponsorships",
    "schedule": "0 * * * *"
  }]
}
```

### For Other Platforms:
Set up a cron job to call:
- URL: `https://yourdomain.com/api/cron/expire-sponsorships`
- Schedule: Every hour
- Header: `Authorization: Bearer YOUR_CRON_SECRET`

## Step 6: Switch to Production Mode

Update `lib/payments/index.ts`:

```typescript
export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: "production", // Change from "sandbox"
});
```

## Testing

### Local Testing Checklist

1. **Database**
   - [ ] Schema migrated successfully
   - [ ] Can query sponsorships table

2. **Environment Variables**
   - [ ] All Polar variables set
   - [ ] Product price IDs configured
   - [ ] CRON_SECRET generated

3. **Sponsorship Purchase Flow**
   - [ ] Navigate to `/dashboard/servers/[id]/promote`
   - [ ] Click on a sponsorship package
   - [ ] Redirected to Polar checkout
   - [ ] Complete test payment
   - [ ] Redirected back to success page
   - [ ] Sponsorship shows as active

4. **Webhook Testing**
   - [ ] ngrok running (for local)
   - [ ] Webhook endpoint configured in Polar
   - [ ] Webhook successfully receives events
   - [ ] Sponsorship status updates correctly

5. **Display Testing**
   - [ ] Featured servers show on homepage
   - [ ] Sponsored servers have visual indicators
   - [ ] Server cards show correct badges

6. **Admin Testing**
   - [ ] Can view all sponsorships at `/admin/sponsorships`
   - [ ] Can see active sponsorships
   - [ ] Stats display correctly

## Troubleshooting

### Issue: Checkout creation fails
**Solution**: Check that all product price IDs are correctly configured in `.env.local`

### Issue: Webhook not receiving events
**Solution**:
1. Verify webhook URL is publicly accessible
2. Check webhook secret matches in Polar and `.env.local`
3. Look at webhook logs in Polar dashboard

### Issue: Sponsorship not showing as active
**Solution**:
1. Check database - sponsorship should have `paymentStatus = 'succeeded'`
2. Verify `startsAt` is in the past and `endsAt` is in the future
3. Check webhook successfully processed the payment

### Issue: Product price ID not found error
**Solution**: Ensure all 8 product price IDs are configured in environment variables

## Revenue Potential

Based on the pricing model:

- **Conservative** (20 servers/month): ~$2,000/month
- **Moderate** (50 servers/month): ~$6,000/month
- **Optimistic** (100 servers/month): ~$15,000/month

## Support

For Polar-specific issues:
- Documentation: https://docs.polar.sh
- Support: support@polar.sh

For implementation issues:
- Check webhook logs in Polar dashboard
- Review application logs for errors
- Test in sandbox mode first
