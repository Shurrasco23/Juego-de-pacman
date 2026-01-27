import { Game, DIRECTION } from './game.js';

/**
 * Setup all input listeners
 * Called once at game startup from setup.js
 */
export function setupInput() {
    setupJoystickInput();
    setupKeyboardInput();
}

/**
 * Setup joystick input
 * Uses angle-based direction detection with 90-degree trigger cones
 * Directions triggered at: RIGHT (0°±45°), UP (90°±45°), LEFT (180°±45°), DOWN (270°±45°)
 */
function setupJoystickInput() {
    const joystickContainer = document.getElementById('joystickContainer');
    const joystickStick = document.getElementById('joystickStick');
    
    if (!joystickContainer) {
        console.warn('joystickContainer not found for joystick input');
        return;
    }
    
    let isJoystickActive = false;
    
    joystickContainer.addEventListener('touchstart', (event) => handleJoystickStart(event, joystickContainer));
    joystickContainer.addEventListener('touchmove', (event) => handleJoystickMove(event, joystickContainer, joystickStick));
    joystickContainer.addEventListener('touchend', (event) => handleJoystickEnd(event, joystickStick));
    
    joystickContainer.addEventListener('mousedown', (event) => handleJoystickStart(event, joystickContainer));
    joystickContainer.addEventListener('mousemove', (event) => handleJoystickMove(event, joystickContainer, joystickStick));
    joystickContainer.addEventListener('mouseup', (event) => handleJoystickEnd(event, joystickStick));
}

/**
 * Handle joystick activation
 */
function handleJoystickStart(event, container) {
    event.preventDefault();
}

/**
 * Handle joystick movement
 * Calculate angle and map to direction using 90-degree cones
 */
function handleJoystickMove(event, container, stick) {
    event.preventDefault();
    
    // Get joystick container position and size
    const rect = container.getBoundingClientRect();
    const containerCenterX = rect.left + rect.width / 2;
    const containerCenterY = rect.top + rect.height / 2;
    
    // Get touch or mouse position
    let posX, posY;
    if (event.touches) {
        posX = event.touches[0].clientX;
        posY = event.touches[0].clientY;
    } else {
        posX = event.clientX;
        posY = event.clientY;
    }
    
    // Calculate angle from center (in degrees)
    const deltaX = posX - containerCenterX;
    const deltaY = posY - containerCenterY;
    const angleRadians = Math.atan2(deltaY, deltaX);
    let angleDegrees = (angleRadians * 180) / Math.PI;
    
    // Convert to 0-360 range
    if (angleDegrees < 0) {
        angleDegrees = 360 + angleDegrees;
    }
    
    // Reset all directions
    Game.inputState.up = false;
    Game.inputState.down = false;
    Game.inputState.left = false;
    Game.inputState.right = false;
    
    // Map angle to direction using 90-degree trigger cones
    // RIGHT: 0° ± 45° (angles < 45° or > 315°)
    if (angleDegrees < 45 || angleDegrees > 315) {
        Game.inputState.right = true;
        updateJoystickVisual(stick, 'RIGHT');
    }
    // DOWN: 90° ± 45° (angles 45° to 135°)
    else if (angleDegrees >= 45 && angleDegrees < 135) {
        Game.inputState.down = true;
        updateJoystickVisual(stick, 'DOWN');
    }
    // LEFT: 180° ± 45° (angles 135° to 225°)
    else if (angleDegrees >= 135 && angleDegrees < 225) {
        Game.inputState.left = true;
        updateJoystickVisual(stick, 'LEFT');
    }
    // UP: 270° ± 45° (angles 225° to 315°)
    else if (angleDegrees >= 225 && angleDegrees < 315) {
        Game.inputState.up = true;
        updateJoystickVisual(stick, 'UP');
    }
}

/**
 * Handle joystick release
 */
function handleJoystickEnd(event, stick) {
    event.preventDefault();
    
    // Reset all directions
    Game.inputState.up = false;
    Game.inputState.down = false;
    Game.inputState.left = false;
    Game.inputState.right = false;
    
    // Reset joystick visual to neutral state
    updateJoystickVisual(stick, 'NONE');
}

/**
 * Update joystick visual feedback
 * Changes sprite state based on direction (5 states total: NONE, UP, DOWN, LEFT, RIGHT)
 */
function updateJoystickVisual(stick, direction) {
    if (!stick) return;
    
    // Remove all direction classes
    stick.classList.remove('joystick-up', 'joystick-down', 'joystick-left', 'joystick-right');
    
    // Add direction class to trigger appropriate sprite
    if (direction === 'UP') {
        stick.classList.add('joystick-up');
    } else if (direction === 'DOWN') {
        stick.classList.add('joystick-down');
    } else if (direction === 'LEFT') {
        stick.classList.add('joystick-left');
    } else if (direction === 'RIGHT') {
        stick.classList.add('joystick-right');
    }
    // If NONE, no class is added (neutral state)
}

/**
 * Handle keyboard arrow key input
 */
function setupKeyboardInput() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

/**
 * Set direction on key press
 */
function handleKeyDown(event) {
    switch(event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            Game.inputState.up = true;
            event.preventDefault();
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            Game.inputState.down = true;
            event.preventDefault();
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            Game.inputState.left = true;
            event.preventDefault();
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            Game.inputState.right = true;
            event.preventDefault();
            break;
    }
}

/**
 * Clear direction on key release
 */
function handleKeyUp(event) {
    switch(event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            Game.inputState.up = false;
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            Game.inputState.down = false;
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            Game.inputState.left = false;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            Game.inputState.right = false;
            break;
    }
}

