# How to Test Your PWA Locally

## Quick Start

1. **Build the production version:**
   ```bash
   npm run build
   ```

2. **Install a local server (if you don't have one):**
   ```bash
   npm install -g serve
   ```

3. **Serve the built app:**
   ```bash
   serve -s build
   ```
   
   Or using Python:
   ```bash
   python -m http.server 8080 --directory build
   ```

4. **Open in browser:**
   - Go to `http://localhost:3000` (if using serve)
   - Or `http://localhost:8080` (if using Python)

5. **Install the PWA:**
   - Look for the install button in your browser's address bar
   - Or use the browser menu to install

## Testing Offline Mode

1. Open Chrome DevTools (F12)
2. Go to the "Application" tab
3. Click "Service Workers" in the left sidebar
4. Check the "Offline" checkbox
5. Reload the page - it should still work!

## Testing on Mobile

1. Deploy your app to a hosting service (Netlify, Vercel, GitHub Pages, etc.)
2. Open the URL on your mobile device
3. Add to home screen:
   - **iOS Safari:** Tap Share > Add to Home Screen
   - **Android Chrome:** Tap Menu > Add to Home Screen

## Notes

- PWAs require HTTPS in production (local testing works with HTTP)
- Service workers only work over HTTPS or localhost
- Some features may work differently in development vs production

## Quick Deploy Options

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### GitHub Pages
1. Push your code to GitHub
2. In repository settings, enable GitHub Pages
3. Select the `build` folder as the source

Your PWA is ready to go! 🎉
