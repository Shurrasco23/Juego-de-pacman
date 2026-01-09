// Renderer skeleton
// Responsibilities:
// - draw static map layer to an offscreen canvas and blit to main canvas
// - draw dynamic entities (player, ghosts)
// - expose `renderStaticToCache(map)` and `render(ctx)` methods

/* Example usage (comment):
import Renderer from './engine/Renderer.js';
const r = new Renderer(canvas, config);
r.renderStaticToCache(Game.map);
*/

// Minimal Renderer implementation: caches a static layer to an offscreen canvas
// and provides a render(ctx) method to draw the cached layer and dynamic entities.
export default class Renderer {
	constructor(canvas, config = {}){
		this.canvas = canvas;
		this.config = config;
		this.cache = null; // offscreen canvas
	}

	// create an offscreen canvas and draw the static map into it
	renderStaticToCache(map, assetManager){
		if (!this.canvas) return;
		const cols = map[0].length;
		const rows = map.length;
		const tile = this.config.TILE_SIZE || 32;
		const dpr = this.config.dpr || 1;
		const off = document.createElement('canvas');
		off.width = Math.floor(cols * tile * dpr); off.height = Math.floor(rows * tile * dpr);
		const ctx = off.getContext('2d');
		// scale the offscreen context so we can draw using CSS-pixel units
		ctx.scale(dpr, dpr);
		// draw tiles
		for (let y=0;y<rows;y++){
			for (let x=0;x<cols;x++){
				const t = map[y][x];
				if (t.walkeable && t.terrainSprite && assetManager && assetManager.spritesheet){
					// source tile size (in pixels) may differ from destination game tile
					const srcTile = this.config.SPRITESHEET_TILE_PX || this.config.spriteTilePx || 32;
					ctx.drawImage(
						assetManager.spritesheet,
						t.terrainSprite.sx, t.terrainSprite.sy, srcTile, srcTile,
						x*tile, y*tile, tile, tile
					);
				} else {
					ctx.fillStyle = '#111144'; ctx.fillRect(x*tile, y*tile, tile, tile);
				}
			}
		}
		this.cache = off;
	}

	// blit the cached static layer and allow caller to draw entities afterwards
	render(ctx){
		if (!ctx) return;
		const dpr = this.config.dpr || 1;
		// clear the logical canvas area (CSS pixels)
		try {
			ctx.clearRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr);
		} catch (e) { /* ignore */ }
		if (this.cache){
			// draw cached physical-sized offscreen onto logical canvas
			const w = this.cache.width / dpr;
			const h = this.cache.height / dpr;
			ctx.drawImage(this.cache, 0, 0, this.cache.width, this.cache.height, 0, 0, w, h);
		}
	}
}
