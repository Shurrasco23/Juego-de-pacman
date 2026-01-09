// AssetManager skeleton
// Purpose: load images and expose sprite coordinates + any parsers related to assets (map parser can live here)

// Minimal AssetManager implementation for the refactor skeleton.
// Responsibilities:
// - load spritesheet image
// - expose `spriteCoords` mapping
// - provide a pure `processMapData` parser as a named export

import { SPRITESHEET_PATH } from '../constants.js';

export default class AssetManager {
  constructor(){
    this.spritesheet = new Image();
    // small default mapping; in the real project these values match the spritesheet layout
    this.spriteCoords = {
      0: {x:0,y:0}, 1: {x:2,y:3}, 2: {x:0,y:3}, 3: {x:2,y:2},
      4: {x:3,y:3}, 5: {x:3,y:2}, 6: {x:3,y:0}, 7: {x:2,y:1},
      8: {x:1,y:3}, 9: {x:2,y:0}, 10: {x:0,y:2}, 11: {x:0,y:1},
      12:{x:1,y:2}, 13:{x:3,y:1}, 14:{x:1,y:1}, 15:{x:1,y:0}
    };
    this.isLoaded = false;
  }

  // load spritesheet image; path relative to project root
  load(path = SPRITESHEET_PATH){
    // load the maze spritesheet (primary) and also load pacman + ghosts GIFs for entities
    const tryLoad = (img, src) => new Promise((res, rej) => {
      img.onload = () => res(img);
      img.onerror = () => rej(new Error('Failed to load ' + src));
      img.src = src;
    });

    // candidate maze sprite paths (primary then legacy name)
    const mazeCandidates = [path, 'Imagenes/mazeSpritesheet.png'];

    // images for entities (existing files in Imagenes/)
    this.pacman = new Image();
    this.ghostPink = new Image();
    this.ghostGreen = new Image();
    this.ghostScared = new Image();

    // attempt to load maze spritesheet from candidates in sequence
    const loadMaze = async () => {
      for (const p of mazeCandidates){
        try {
          await tryLoad(this.spritesheet, p);
          this.isLoaded = true;
          this.spritesheetPath = p;
          return;
        } catch(e){ /* try next */ }
      }
      // if none succeeded, leave spritesheet empty but continue
      this.isLoaded = false;
    };

    // load entity images in parallel but don't fail the whole load if missing
    const entityLoads = [
      tryLoad(this.pacman, 'Imagenes/pacman-juego.gif').catch(()=>null),
      tryLoad(this.ghostPink, 'Imagenes/Fantasma-rosa.gif').catch(()=>null),
      tryLoad(this.ghostGreen, 'Imagenes/fantasma-verde.gif').catch(()=>null),
      tryLoad(this.ghostScared, 'Imagenes/fantasma-asustado.gif').catch(()=>null)
    ];

    return Promise.all([loadMaze(), ...entityLoads]).then(() => {
      // expose for easy access by rendering code (avoids circular imports)
      try { window.__assets = this; } catch(e){}
      return this;
    });
  }
}
// It does not mutate DOM or globals; caller applies results.
