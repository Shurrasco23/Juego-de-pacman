// Ghost.js skeleton
// Responsibilities:
// - state machine (scatter, chase, frightened, eaten)
// - pathfinding between nodes (intersections)
// - update(dt) and render(ctx)

// Minimal Ghost skeleton for refactor
export class Ghost {
  constructor(tileX, tileY, config={}){
    this.tileX = tileX; this.tileY = tileY; this.config = config;
    this.x = tileX; this.y = tileY; this.state = 'idle';
  }
  update(dt){
    // placeholder: simple random walk could be added later
  }
  render(ctx){
    if (!ctx) return;
    const tile = this.config.TILE_SIZE || 32;
    const assets = (typeof window !== 'undefined') ? window.__assets : null;
    if (assets && assets.ghostPink && assets.ghostPink.complete){
      try { ctx.drawImage(assets.ghostPink, this.x*tile, this.y*tile, tile, tile); return; } catch(e){}
    }
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x*tile+4, this.y*tile+4, tile-8, tile-8);
  }
}
