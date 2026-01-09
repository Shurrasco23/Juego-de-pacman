// navigation.js
// Purpose: migrate legacy `navegacion.js` menu wiring into the refactor

import { bootGame } from '../engine/Game.js';
import { showInstructions } from './instructions.js';

export function setupNavigation(){
  // Attach once DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const botonJugar = document.getElementById('boton_juego');
    const botonInstr = document.getElementById('boton_instrucciones');
    const menu = document.getElementById('menu');
    const juego = document.getElementById('Juego');

    if (botonJugar){
      botonJugar.addEventListener('click', async () => {
        if (menu) menu.style.display = 'none';
        if (juego) juego.style.display = 'block';
        try {
          await bootGame();
        } catch(e){ console.error('Failed to start game from navigation:', e); }
      });
    }

    if (botonInstr){
      botonInstr.addEventListener('click', () => {
        showInstructions();
      });
    }
  });
}

export default setupNavigation;
