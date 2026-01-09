// events.js
// Small EventEmitter helper to decouple modules.

export class EventEmitter {
  constructor(){ this._map = new Map(); }
  on(name, fn){ if (!this._map.has(name)) this._map.set(name, []); this._map.get(name).push(fn); }
  off(name, fn){ if (!this._map.has(name)) return; const arr = this._map.get(name).filter(x=>x!==fn); this._map.set(name, arr); }
  emit(name, ...args){ if (!this._map.has(name)) return; this._map.get(name).forEach(fn=>fn(...args)); }
}

export default EventEmitter;
