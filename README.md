# TraceCam

TraceCam is a client-only, mobile-first PWA that lets you align a live rear-camera scene against an uploaded reference image. Drag, pinch, rotate, adjust opacity, lock it in place, and capture the camera frame—with the overlay included only when selected.

## Run locally

```bash
npm install
npm run dev -- --host
```

Open the URL Vite prints. Camera access requires a secure context: `localhost` works on the PC, but an iPhone needs HTTPS. For iPhone testing from Windows, deploy the production build (`npm run build`) to a free HTTPS host such as GitHub Pages, Netlify, or Cloudflare Pages, then open that HTTPS address in Safari. A tunnel that provides HTTPS is also suitable for temporary testing.

## iPhone use

1. In Safari, open the HTTPS deployment and tap **Add Reference Image**.
2. Allow camera access when asked. TraceCam prefers the rear camera, but the browser can select another camera if needed.
3. Use **Share → Add to Home Screen** to install it. Camera permission remains controlled by Safari/iOS settings.

The app uses Web Share for the saved photo where iOS supports file sharing; otherwise it downloads the JPG. Web camera behavior is controlled by iOS/Safari: it requires HTTPS, cannot change device-level camera settings, and backgrounding the app may pause the video stream.

## Native later

For a native iOS version, move the React UI into Capacitor (or rewrite in SwiftUI), replace browser `getUserMedia` and canvas capture with AVFoundation, add camera/photo-library permission strings, and distribute through an Apple Developer account.
