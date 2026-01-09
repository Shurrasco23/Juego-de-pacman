// instructions.js
// Simple instructions modal used by navigation.

export function showInstructions(){
  const existing = document.getElementById('instructions-overlay');
  if (existing) return existing;
  const overlay = document.createElement('div');
  overlay.id = 'instructions-overlay';
  Object.assign(overlay.style, {
    position: 'fixed', left:0, top:0, right:0, bottom:0,
    background:'rgba(0,0,0,0.85)', color:'#fff', zIndex:9998,
    display:'flex', alignItems:'center', justifyContent:'center', padding:'20px'
  });

  const box = document.createElement('div');
  box.style = 'max-width:600px;background:#111;padding:18px;border-radius:8px;text-align:left;';
  box.innerHTML = `
    <h2 style="margin-top:0;color:#ffd700">How to play</h2>
    <p>Use arrow keys or WASD, or the on-screen controls to move Pac‑Man.</p>
    <ul>
      <li>Collect dots to score points.</li>
      <li>Avoid ghosts (not implemented in this skeleton).</li>
      <li>Orientation: works better in portrait for totem setups.</li>
    </ul>
    <div style="text-align:right;margin-top:10px;"><button id="instructions-close">Close</button></div>
  `;
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  document.getElementById('instructions-close').addEventListener('click', ()=> overlay.remove());
  return overlay;
}

export default showInstructions;
