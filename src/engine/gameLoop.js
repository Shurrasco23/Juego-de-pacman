import { Game } from './game.js';
import { renderFrame } from './renderer.js';
import { updateGameState } from './update.js';
import { STATES } from './constants.js';

// Game loop timing
let lastFrameTime = 0;
const TARGET_FPS = 60;
const FRAME_TIME = 1000 / TARGET_FPS;  // Milliseconds per frame at 60fps
let accumulator = 0;

/**
 * Process player input from keyboard and buttons
 * Input listeners set Game.inputState directly
 * This function just logs for now (input is passive)
 */
function processInput() {
    // Input state is updated by event listeners in real-time
    // Game.inputState.up, down, left, right are already set
}

/**
 * Update game state (movement, collisions, etc)
 */
function updateGame() {
    // Call update logic from update.js
    updateGameState();
    // Update timer
    Game.gameTimer += FRAME_TIME / 1000;
}

/**
 * Main game loop - runs each frame
 */
function gameLoopStep(currentTime) {
    // Calculate delta time
    if (lastFrameTime === 0) {
        lastFrameTime = currentTime;
    }
    
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
    accumulator += deltaTime;
    
    // Process fixed timesteps
    while (accumulator >= FRAME_TIME) {
        processInput();
        updateGame();
        renderFrame();  // Call the imported renderFrame function
        accumulator -= FRAME_TIME;
    }
    
    // Continue loop
    requestAnimationFrame(gameLoopStep);
}

/**
 * Start the game loop
 * Called from setup.js after initialization
 */
export function startGameLoop() {
    console.log('Game loop started');
    Game.state = STATES.INGAME;
    lastFrameTime = 0;
    accumulator = 0;
    requestAnimationFrame(gameLoopStep);
}

/**
 * Stop the game loop
 * Called when game ends or pauses
 */
export function stopGameLoop() {
    console.log('Game loop stopped');
    lastFrameTime = 0;
    // Note: requestAnimationFrame will stop naturally since we don't call it again
}
