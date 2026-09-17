export async function captureFrame(video, reference, transform, includeOverlay) {
  const width = video.videoWidth, height = video.videoHeight;
  if (!width || !height) throw new Error('The camera is still starting.');
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height; const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, width, height);
  // Canvas uses the same object-fit: cover math as the preview, so the exported overlay aligns with screen framing.
  if (includeOverlay && reference) { const screenRatio = window.innerWidth / window.innerHeight, videoRatio = width / height; let drawW, drawH; if (videoRatio > screenRatio) { drawH = height; drawW = height * screenRatio; } else { drawW = width; drawH = width / screenRatio; } const aspect = reference.naturalWidth / reference.naturalHeight; let baseW = drawW * .82, baseH = baseW / aspect; if (baseH > drawH * .82) { baseH = drawH * .82; baseW = baseH * aspect; } ctx.save(); ctx.globalAlpha = transform.opacity; ctx.translate(width / 2 + (transform.x / window.innerWidth) * drawW, height / 2 + (transform.y / window.innerHeight) * drawH); ctx.rotate(transform.rotation * Math.PI / 180); ctx.scale(transform.scale, transform.scale); ctx.drawImage(reference, -baseW / 2, -baseH / 2, baseW, baseH); ctx.restore(); }
  return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', .94));
}
export async function shareOrDownload(blob, withOverlay) { const file = new File([blob], `tracecam-${Date.now()}${withOverlay ? '-overlay' : ''}.jpg`, { type: 'image/jpeg' }); if (navigator.share && navigator.canShare?.({ files: [file] })) { await navigator.share({ title: 'TraceCam capture', files: [file] }); return; } const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = file.name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
