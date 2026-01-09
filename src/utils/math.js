// math.js
// Small math helpers useful for game logic.

export function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
export function lerp(a,b,t){ return a + (b-a)*t; }

export default { clamp, lerp };
