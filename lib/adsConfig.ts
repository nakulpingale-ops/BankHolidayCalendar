/**
 * AdSense Configuration
 * 
 * To enable ads after AdSense approval:
 * 1. Create a .env.local file in the project root
 * 2. Add: NEXT_PUBLIC_ADS_ENABLED=true
 * 3. Restart the dev server
 */

export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';
