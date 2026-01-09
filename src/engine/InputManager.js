// InputManager skeleton
// Purpose: unify keyboard, pointer and touch input and expose a small API:
// - getDirection() -> 'up'|'down'|'left'|'right'|null
// - on(event, handler) -> optional event emitter for start/stop

// Minimal InputManager implementation for refactor skeleton.
// Provides keyboard and pointer swipe detection and a simple API: getDirection().
export default class InputManager {
	constructor(canvas){
		this.canvas = canvas;
		this.direction = null;

		this._startX = 0;
		this._startY = 0;

		this._onKeyDown = this._onKeyDown.bind(this);
		this._onPointerDown = this._onPointerDown.bind(this);
		this._onPointerUp = this._onPointerUp.bind(this);

		window.addEventListener('keydown', this._onKeyDown);
		if (this.canvas){
			this.canvas.addEventListener('pointerdown', this._onPointerDown);
			this.canvas.addEventListener('pointerup', this._onPointerUp);
		}
	}

	getDirection(){ return this.direction; }

	_onKeyDown(e){
		switch(e.key){
			case 'ArrowUp': case 'w': case 'W': this.direction = 'up'; break;
			case 'ArrowDown': case 's': case 'S': this.direction = 'down'; break;
			case 'ArrowLeft': case 'a': case 'A': this.direction = 'left'; break;
			case 'ArrowRight': case 'd': case 'D': this.direction = 'right'; break;
		}
	}

	_onPointerDown(e){
		this._startX = e.clientX; this._startY = e.clientY;
		try { e.target.setPointerCapture(e.pointerId); } catch(e){}
	}

	_onPointerUp(e){
		const dx = e.clientX - this._startX; const dy = e.clientY - this._startY;
		if (Math.abs(dx) > Math.abs(dy)){
			if (dx > 20) this.direction = 'right'; else if (dx < -20) this.direction = 'left';
		} else {
			if (dy > 20) this.direction = 'down'; else if (dy < -20) this.direction = 'up';
		}
	}

	dispose(){
		window.removeEventListener('keydown', this._onKeyDown);
		if (this.canvas){
			this.canvas.removeEventListener('pointerdown', this._onPointerDown);
			this.canvas.removeEventListener('pointerup', this._onPointerUp);
		}
	}
}
