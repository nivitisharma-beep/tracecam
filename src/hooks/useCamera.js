import { useCallback, useEffect, useRef, useState } from 'react';

export function useCamera() {
  const videoRef = useRef(null); const streamRef = useRef(null);
  const [status, setStatus] = useState('idle'); const [error, setError] = useState('');
  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) { setError('Camera access is not supported in this browser. Use Safari on a secure (HTTPS) site.'); setStatus('error'); return false; }
    setStatus('starting'); setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      setStatus('ready'); return true;
    } catch (e) { setStatus('error'); setError(e.name === 'NotAllowedError' ? 'Camera permission was denied. Allow Camera access in Safari Settings, then try again.' : 'Could not open the camera. Check that no other app is using it.'); return false; }
  }, []);
  const stop = useCallback(() => { streamRef.current?.getTracks().forEach(track => track.stop()); streamRef.current = null; setStatus('idle'); }, []);
  useEffect(() => stop, [stop]);
  return { videoRef, status, error, start, stop };
}
