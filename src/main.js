// Entry point (refactor skeleton)
// Purpose: this file should import Game and call Game.init(canvasEl).
// It's intentionally non-invasive: the actual calls are commented examples.

// Example usage: import Game and call init when DOM is ready.
import { bootGame } from './engine/Game.js';
import { setupNavigation } from './ui/navigation.js';

// Install navigation/menu hooks and defer starting the game until user clicks Play
setupNavigation();

// Export bootGame helper for programmatic start/tests
export { bootGame };

