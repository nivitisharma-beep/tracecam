import { useCallback, useRef, useState } from 'react';
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const center = ps => ({ x: (ps[0].x + ps[1].x) / 2, y: (ps[0].y + ps[1].y) / 2 });
const distance = ps => Math.hypot(ps[1].x - ps[0].x, ps[1].y - ps[0].y);
const angle = ps => Math.atan2(ps[1].y - ps[0].y, ps[1].x - ps[0].x) * 180 / Math.PI;
export const initialTransform = () => ({ x: 0, y: 0, scale: 1, rotation: 0, opacity: .5 });

export function useReferenceTransform(locked) {
  const [transform, setTransform] = useState(initialTransform); const pointers = useRef(new Map()); const gesture = useRef(null);
  const reset = useCallback(() => setTransform(initialTransform()), []);
  const onPointerDown = useCallback(e => { if (locked) return; e.currentTarget.setPointerCapture?.(e.pointerId); pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); const ps = [...pointers.current.values()]; gesture.current = ps.length === 1 ? { type: 'drag', point: ps[0], base: transform } : { type: 'pinch', point: center(ps), distance: distance(ps), angle: angle(ps), base: transform }; }, [locked, transform]);
  const onPointerMove = useCallback(e => { if (locked || !pointers.current.has(e.pointerId) || !gesture.current) return; pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); const ps = [...pointers.current.values()]; const g = gesture.current;
    if (ps.length === 1 && g.type === 'drag') setTransform(t => ({ ...t, x: g.base.x + ps[0].x - g.point.x, y: g.base.y + ps[0].y - g.point.y }));
    if (ps.length >= 2) { if (g.type !== 'pinch') gesture.current = { type: 'pinch', point: center(ps), distance: distance(ps), angle: angle(ps), base: transform }; else { const now = center(ps); setTransform(t => ({ ...t, x: g.base.x + now.x - g.point.x, y: g.base.y + now.y - g.point.y, scale: clamp(g.base.scale * distance(ps) / g.distance, .2, 4), rotation: g.base.rotation + angle(ps) - g.angle })); } }
  }, [locked, transform]);
  const end = useCallback(e => { pointers.current.delete(e.pointerId); const ps = [...pointers.current.values()]; gesture.current = ps.length ? { type: 'drag', point: ps[0], base: transform } : null; }, [transform]);
  return { transform, setTransform, reset, gestureProps: { onPointerDown, onPointerMove, onPointerUp: end, onPointerCancel: end } };
}
