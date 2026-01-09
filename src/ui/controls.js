// controls.js
// Purpose: UI controls for touch (on-screen buttons / d-pad)

// Simple on-screen controls creator (creates 4 arrow buttons)
export function createControls(containerEl, callbacks = {}){
  if (!containerEl) return;
  const dirs = ['up','left','right','down'];
  dirs.forEach(d => {
    const btn = document.createElement('button');
    btn.className = 'ctrl-'+d; btn.textContent = d.toUpperCase();
    btn.addEventListener('touchstart', (e)=>{ e.preventDefault(); callbacks.onDirection && callbacks.onDirection(d); });
    btn.addEventListener('mousedown', ()=> callbacks.onDirection && callbacks.onDirection(d));
    containerEl.appendChild(btn);
  });
}

export function clearControls(containerEl){ if (!containerEl) return; containerEl.innerHTML = ''; }
