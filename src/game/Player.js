// Player.js skeleton
// Responsibilities:
// - tile-aligned movement
// - requestDirection / applyDirection
// - update(dt) and render(ctx)

// Minimal Player class for refactor skeleton
export class Player {
  constructor(tileX, tileY, config={}){
    this.tileX = tileX; this.tileY = tileY; this.config = config || {};
    this.TILE = this.config.TILE_SIZE || 32;
    // pixel coordinates (top-left of tile)
    this.x = this.tileX * this.TILE;
    this.y = this.tileY * this.TILE;
    this.requested = null; // requested direction string
    this.moving = false;
    this.dir = null; // {dx,dy}
    this.speed = (this.TILE * 5); // pixels per second (tunable)
  }

  // dt in seconds, input is InputManager, game provides map for collision checks
  update(dt, input, game){
    const dir = input && input.getDirection ? input.getDirection() : null;
    if (dir) this.requested = dir;

    const map = game && game.map ? game.map : null;

    // helper to convert direction string to vector
    const vec = (d) => {
      switch(d){
        case 'up': return {dx:0,dy:-1};
        case 'down': return {dx:0,dy:1};
        case 'left': return {dx:-1,dy:0};
        case 'right': return {dx:1,dy:0};
      }
      return null;
    };

    // if not currently moving, try to start moving in requested direction
    if (!this.moving && this.requested){
      const v = vec(this.requested);
      if (v && map){
        const nx = this.tileX + v.dx;
        const ny = this.tileY + v.dy;
        const within = ny>=0 && ny<map.length && nx>=0 && nx<map[0].length;
        const walkable = within && map[ny][nx] && map[ny][nx].walkeable;
        if (walkable){
          this.moving = true; this.dir = v; this.requested = null;
          // target tile center in pixels
          this.targetTileX = nx; this.targetTileY = ny;
        } else {
          // cannot move into wall: clear requested to avoid repeated attempts
          this.requested = null;
        }
      }
    }

    // if moving, advance pixel position toward target tile
    if (this.moving && this.dir){
      const move = this.speed * dt;
      this.x += this.dir.dx * move;
      this.y += this.dir.dy * move;
      // compute target pixel coords
      const tx = this.targetTileX * this.TILE;
      const ty = this.targetTileY * this.TILE;
      // check if we've reached or passed the target (using dot product)
      const reachedX = (this.dir.dx >= 0) ? this.x >= tx : this.x <= tx;
      const reachedY = (this.dir.dy >= 0) ? this.y >= ty : this.y <= ty;
      if ((this.dir.dx===0 || reachedX) && (this.dir.dy===0 || reachedY)){
        // snap to target
        this.x = tx; this.y = ty;
        this.tileX = this.targetTileX; this.tileY = this.targetTileY;
        this.moving = false; this.dir = null;
      }
    } else {
      // ensure pixel coords match tile if idle
      this.x = this.tileX * this.TILE; this.y = this.tileY * this.TILE;
    }
  }

  render(ctx){
    if (!ctx) return;
    const tile = this.TILE;
    // try to use loaded pacman GIF if available
    const assets = (typeof window !== 'undefined') ? window.__assets : null;
    if (assets && assets.pacman && assets.pacman.complete){
      try {
        ctx.drawImage(assets.pacman, this.x, this.y, tile, tile);
        return;
      } catch(e){ /* fallback to primitive */ }
    }
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(this.x + tile/2, this.y + tile/2, tile*0.4, 0, Math.PI*2);
    ctx.fill();
  }
}
