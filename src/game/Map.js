// Map.js
// Purpose: pure parsing utilities for map text files and map-related helpers.

import { ITEM_TYPE, SPRITESHEET_TILE_PX } from '../constants.js';

// Pure map parser: converts text to a structured map and computes sprite offsets.
export function parseMapText(text, spriteCoords, tileSize){
  const lines = text.trim().split('\n');
  const rows = lines.length; const cols = lines[0].length;
  const boolMap = lines.map(line => line.split('').map(c => c === '1'));
  const map = [];
  for (let y=0;y<rows;y++){
    const row = [];
    for (let x=0;x<cols;x++){
      const isPath = boolMap[y][x];
      const tile = { walkeable: isPath, terrainSprite: null, item: ITEM_TYPE.NONE };
      if (isPath){
        let v = 0;
        if ((y>0 && boolMap[y-1][x])|| y===0) v+=1;
        if ((x>0 && boolMap[y][x-1])|| x===0) v+=2;
        if ((x<cols-1 && boolMap[y][x+1])|| x===cols-1) v+=4;
        if ((y<rows-1 && boolMap[y+1][x])|| y===rows-1) v+=8;
        const coords = (spriteCoords && spriteCoords[v]) ? spriteCoords[v] : {x:0,y:0};
        // source rectangle in the spritesheet uses SPRITESHEET_TILE_PX
        tile.terrainSprite = { sx: coords.x * SPRITESHEET_TILE_PX, sy: coords.y * SPRITESHEET_TILE_PX };
        // generate a DOT on walkable tiles except pacman's default spawn (1,1)
        if (!(x===1 && y===1)) tile.item = ITEM_TYPE.DOT;
      }
      row.push(tile);
    }
    map.push(row);
  }
  return { map, rows, cols };

}

// Additional helpers could be added: findSpawnPoints(map), buildIntersectionGraph(map)
