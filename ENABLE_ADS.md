# How to Enable AdSense Ads

After your AdSense account is approved, follow these steps to enable ad serving on your website:

## Steps

1. **Create Environment File**
   
   Create a new file named `.env.local` in the project root directory:
   ```
   c:\Users\nakul\.gemini\antigravity\playground\metallic-ride\.env.local
   ```

2. **Add Configuration**
   
   Add the following line to the `.env.local` file:
   ```
   NEXT_PUBLIC_ADS_ENABLED=true
   ```

3. **Restart Development Server**
   
   Stop the current dev server (Ctrl+C) and restart it:
   ```bash
   npm run dev
   ```

4. **Verify Ad Containers**
   
   Visit your site and confirm:
   - Empty ad containers are visible (dark background boxes)
   - No placeholder text like "ADVERTISEMENT" appears
   - Containers have proper dimensions:
     - Homepage: 300×250 (mobile), 728×90 (desktop)
     - State pages: 300×250 (mobile), 970×250 (desktop)

5. **Deploy to Production**
   
   For production deployment, add the environment variable to your hosting platform:
   - **Cloudflare Pages**: Add `NEXT_PUBLIC_ADS_ENABLED=true` in Settings → Environment Variables
   - **Vercel**: Add in Project Settings → Environment Variables
   - **Netlify**: Add in Site Settings → Build & Deploy → Environment Variables

## Important Notes

- The `.env.local` file is gitignored and won't be committed to your repository
- Ad containers will appear empty until AdSense starts serving ads
- The AdSense script in `app/layout.tsx` and `public/ads.txt` remain active regardless of this setting
