import { useEffect, useRef, useState } from 'react';
import { useCamera } from './hooks/useCamera';
import { useReferenceTransform } from './hooks/useReferenceTransform';
import { captureFrame, shareOrDownload } from './lib/capture';
import { IconButton, OpacityControl, Shutter } from './components/Controls';

export default function App() {
  const inputRef = useRef(null), imageRef = useRef(null); const [referenceUrl, setReferenceUrl] = useState(''); const [locked, setLocked] = useState(false); const [includeOverlay, setIncludeOverlay] = useState(false); const [notice, setNotice] = useState(''); const [busy, setBusy] = useState(false);
  const camera = useCamera(); const ref = useReferenceTransform(locked);
  useEffect(() => () => { if (referenceUrl) URL.revokeObjectURL(referenceUrl); }, [referenceUrl]);
  const chooseImage = () => inputRef.current?.click();
  const onFile = async e => { const file = e.target.files?.[0]; if (!file) return; if (referenceUrl) URL.revokeObjectURL(referenceUrl); setReferenceUrl(URL.createObjectURL(file)); ref.reset(); setLocked(false); setNotice(''); await camera.start(); e.target.value = ''; };
  const capture = async () => { try { setBusy(true); const blob = await captureFrame(camera.videoRef.current, imageRef.current, ref.transform, includeOverlay); await shareOrDownload(blob, includeOverlay); setNotice('Photo ready to save or share.'); } catch (e) { setNotice(e.message || 'Could not capture photo.'); } finally { setBusy(false); } };
  if (!referenceUrl) return <main className="landing"><div className="brand-mark">⌁</div><p className="eyebrow">TRACE THE MOMENT</p><h1>TraceCam</h1><p className="intro">Line up a real-world scene with any reference image, then capture it.</p><button className="primary" onClick={chooseImage}>Add Reference Image</button><p className="privacy">Your photos stay on this device.</p><input ref={inputRef} className="sr-only" type="file" accept="image/*" onChange={onFile} /></main>;
  return <main className="camera-app"><video ref={camera.videoRef} className="camera" autoPlay muted playsInline />
    {camera.status === 'starting' && <div className="status"><span className="spinner" /> Opening camera…</div>}
    {camera.status === 'error' && <div className="permission"><div className="permission-icon">!</div><h2>Camera unavailable</h2><p>{camera.error}</p><button className="primary" onClick={camera.start}>Try Again</button><button className="text-button" onClick={chooseImage}>Choose another image</button></div>}
    <div className="overlay-stage" {...ref.gestureProps} style={{ touchAction: locked ? 'auto' : 'none' }}>
      <img ref={imageRef} className="reference" src={referenceUrl} draggable="false" alt="Reference alignment overlay" style={{ opacity: ref.transform.opacity, transform: `translate(calc(-50% + ${ref.transform.x}px), calc(-50% + ${ref.transform.y}px)) rotate(${ref.transform.rotation}deg) scale(${ref.transform.scale})` }} />
    </div>
    <header className="top-controls"><IconButton label="Replace reference image" onClick={chooseImage}>↻</IconButton><div className="top-title">TraceCam</div><IconButton label={locked ? 'Unlock reference image' : 'Lock reference image'} active={locked} onClick={() => setLocked(v => !v)}>{locked ? '▣' : '▢'}</IconButton></header>
    <section className="lower-controls"><div className="utility-row"><OpacityControl value={ref.transform.opacity} onChange={opacity => ref.setTransform(t => ({ ...t, opacity }))} /><IconButton label="Reset reference image" onClick={ref.reset}>↺</IconButton></div><label className="include"><input type="checkbox" checked={includeOverlay} onChange={e => setIncludeOverlay(e.target.checked)} /> Save with overlay</label><div className="shutter-row"><span> {locked ? 'Locked' : 'Drag · pinch · rotate'} </span><Shutter onClick={capture} busy={busy || camera.status !== 'ready'} /><span>{busy ? 'Saving…' : 'Capture'}</span></div></section>
    {notice && <div className="toast">{notice}</div>}<input ref={inputRef} className="sr-only" type="file" accept="image/*" onChange={onFile} />
  </main>;
}
