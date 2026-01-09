// InputManager: unified keyboard + simple swipe detection for touch.
// Purpose: expose a lightweight getDirection() method that returns
// one of: 'up', 'down', 'left', 'right' or null.

export default class InputManager {
  constructor(canvas){
    this.canvas = canvas;
    this.direction = null; // current requested direction

    // pointer swipe helpers
    this._startX = 0;
    this._startY = 0;

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);

    window.addEventListener('keydown', this._onKeyDown);
    // use pointer events on the canvas so it works with touch and mouse
    this.canvas.addEventListener('pointerdown', this._onPointerDown);
    this.canvas.addEventListener('pointerup', this._onPointerUp);
  }

  // return the current requested direction
  getDirection(){
    return this.direction;
  }

  // keyboard handler: arrow keys + WASD
  _onKeyDown(e){
    switch(e.key){
      case 'ArrowUp': case 'w': case 'W': this.direction = 'up'; break;
      case 'ArrowDown': case 's': case 'S': this.direction = 'down'; break;
      case 'ArrowLeft': case 'a': case 'A': this.direction = 'left'; break;
      case 'ArrowRight': case 'd': case 'D': this.direction = 'right'; break;
    }
  }

  _onPointerDown(e){
    // record start position for simple swipe detection
    this._startX = e.clientX;
    this._startY = e.clientY;
    // capture pointer to receive pointerup even if pointer leaves element
    e.target.setPointerCapture(e.pointerId);
  }

  _onPointerUp(e){
    const dx = e.clientX - this._startX;
    const dy = e.clientY - this._startY;

    // choose dominant axis
    if (Math.abs(dx) > Math.abs(dy)){
      if (dx > 20) this.direction = 'right';
      else if (dx < -20) this.direction = 'left';
    } else {
      if (dy > 20) this.direction = 'down';
      else if (dy < -20) this.direction = 'up';
    }
  }

  // optional: clean up listeners if game is destroyed
  dispose(){
    window.removeEventListener('keydown', this._onKeyDown);
    this.canvas.removeEventListener('pointerdown', this._onPointerDown);
    this.canvas.removeEventListener('pointerup', this._onPointerUp);
  }
}
