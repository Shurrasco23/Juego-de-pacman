// hud.js
// Purpose: update score, lives and time UI elements.
import { HUD_SELECTORS } from '../constants.js';

export function updateHUD({score, lives, time} = {}){
  const scoreEl = document.querySelector(HUD_SELECTORS.points);
  const livesEl = document.querySelector(HUD_SELECTORS.lives);
  const timeEl = document.querySelector(HUD_SELECTORS.time);
  if (scoreEl && typeof score === 'number') scoreEl.textContent = 'Points: ' + score;
  if (livesEl && typeof lives === 'number') livesEl.textContent = 'Lives: ' + lives;
  if (timeEl && typeof time === 'number') timeEl.textContent = 'Time: ' + Math.floor(time) + 's';
}

export function resetHUD(){ updateHUD({score:0,lives:3,time:0}); }
