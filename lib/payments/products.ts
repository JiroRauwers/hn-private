import { polarClient } from "./index";

// Sponsorship package pricing configuration (prices in cents)
export const SPONSORSHIP_PACKAGES = {
	featured: {
		daily: { price: 999, interval: "day", intervalCount: 1 }, // $9.99/day
		weekly: { price: 5999, interval: "day", intervalCount: 7 }, // $59.99/week
		monthly: { price: 19999, interval: "month", intervalCount: 1 }, // $199.99/month
	},
	premium: {
		daily: { price: 499, interval: "day", intervalCount: 1 }, // $4.99/day
		weekly: { price: 2999, interval: "day", intervalCount: 7 }, // $29.99/week
		monthly: { price: 9999, interval: "month", intervalCount: 1 }, // $99.99/month
	},
	bump: {
		"1h": { price: 199, duration: 1 }, // $1.99/1 hour
		"3h": { price: 499, duration: 3 }, // $4.99/3 hours
	},
} as const;

export type SponsorshipType = "featured" | "premium" | "bump";
export type Duration = "daily" | "weekly" | "monthly" | "1h" | "3h";

// Product Price IDs mapping (to be filled after creating products in Polar dashboard)
// These IDs will be obtained from Polar dashboard after creating products
export const PRODUCT_PRICE_IDS: Record<
	SponsorshipType,
	Record<string, string>
> = {
	featured: {
		daily: process.env.POLAR_FEATURED_DAILY_PRICE_ID || "",
		weekly: process.env.POLAR_FEATURED_WEEKLY_PRICE_ID || "",
		monthly: process.env.POLAR_FEATURED_MONTHLY_PRICE_ID || "",
	},
	premium: {
		daily: process.env.POLAR_PREMIUM_DAILY_PRICE_ID || "",
		weekly: process.env.POLAR_PREMIUM_WEEKLY_PRICE_ID || "",
		monthly: process.env.POLAR_PREMIUM_MONTHLY_PRICE_ID || "",
	},
	bump: {
		"1h": process.env.POLAR_BUMP_1H_PRICE_ID || "",
		"3h": process.env.POLAR_BUMP_3H_PRICE_ID || "",
	},
};

// Helper function to get product price ID
export function getProductPriceId(
	type: SponsorshipType,
	duration: Duration,
): string {
	const priceId = PRODUCT_PRICE_IDS[type][duration];
	if (!priceId) {
		throw new Error(
			`Product price ID not found for ${type} - ${duration}. Please configure in Polar dashboard and add to environment variables.`,
		);
	}
	return priceId;
}

// Helper function to get price for a sponsorship package
export function getPriceForSponsorship(
	type: SponsorshipType,
	duration: Duration,
): number {
	if (type === "bump") {
		return SPONSORSHIP_PACKAGES.bump[duration as "1h" | "3h"].price;
	}
	return SPONSORSHIP_PACKAGES[type as "featured" | "premium"][
		duration as "daily" | "weekly" | "monthly"
	].price;
}

// Helper function to format sponsorship type for display
export function formatSponsorshipType(type: SponsorshipType): string {
	const formatted: Record<SponsorshipType, string> = {
		featured: "Featured Spot",
		premium: "Premium Listing",
		bump: "Bump",
	};
	return formatted[type];
}

// Helper function to format duration for display
export function formatDuration(duration: Duration): string {
	const formatted: Record<Duration, string> = {
		daily: "1 Day",
		weekly: "7 Days",
		monthly: "30 Days",
		"1h": "1 Hour",
		"3h": "3 Hours",
	};
	return formatted[duration];
}

/**
 * Initialize Polar products (reference only - products should be created via Polar dashboard)
 *
 * This function serves as documentation for the products that need to be created
 * in the Polar dashboard. Follow these steps:
 *
 * 1. Go to Polar dashboard → Products
 * 2. Create the following products:
 *
 * FEATURED SPOT PRODUCTS:
 * - Name: "Featured Spot - 1 Day"
 *   Description: "Top position on homepage for 24 hours"
 *   Price: $9.99 (one-time)
 *
 * - Name: "Featured Spot - 7 Days"
 *   Description: "Top position on homepage for 7 days"
 *   Price: $59.99 (one-time)
 *
 * - Name: "Featured Spot - 30 Days"
 *   Description: "Top position on homepage for 30 days"
 *   Price: $199.99 (one-time)
 *
 * PREMIUM LISTING PRODUCTS:
 * - Name: "Premium Listing - 1 Day"
 *   Description: "Enhanced server card with highlighted border for 24 hours"
 *   Price: $4.99 (one-time)
 *
 * - Name: "Premium Listing - 7 Days"
 *   Description: "Enhanced server card with highlighted border for 7 days"
 *   Price: $29.99 (one-time)
 *
 * - Name: "Premium Listing - 30 Days"
 *   Description: "Enhanced server card with highlighted border for 30 days"
 *   Price: $99.99 (one-time)
 *
 * BUMP PRODUCTS:
 * - Name: "Bump - 1 Hour"
 *   Description: "Move server to top of category for 1 hour"
 *   Price: $1.99 (one-time)
 *
 * - Name: "Bump - 3 Hours"
 *   Description: "Move server to top of category for 3 hours"
 *   Price: $4.99 (one-time)
 *
 * 3. After creating each product, copy the product price ID
 * 4. Add the price IDs to your .env.local file:
 *    POLAR_FEATURED_DAILY_PRICE_ID=...
 *    POLAR_FEATURED_WEEKLY_PRICE_ID=...
 *    POLAR_FEATURED_MONTHLY_PRICE_ID=...
 *    POLAR_PREMIUM_DAILY_PRICE_ID=...
 *    POLAR_PREMIUM_WEEKLY_PRICE_ID=...
 *    POLAR_PREMIUM_MONTHLY_PRICE_ID=...
 *    POLAR_BUMP_1H_PRICE_ID=...
 *    POLAR_BUMP_3H_PRICE_ID=...
 */
export async function initializePolarProducts() {
	console.log("Please create products manually in Polar dashboard.");
	console.log("See function documentation for product specifications.");
	throw new Error(
		"This function is for reference only. Create products via Polar dashboard.",
	);
}
