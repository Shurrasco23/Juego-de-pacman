const DIR = {
    NONE: {x: 0, y: 0},
    UP: {x: 0, y: -1},
    DOWN: {x: 0, y: 1},
    LEFT: {x: -1, y: 0},
    RIGHT: {x: 1, y: 0}
}

let currentDirection = DIR.NONE;
let nextDirection = DIR.NONE;

function InitInputListeners() {
    document.addEventListener('keydown', (event) => {
        switch(event.key) {
            case 'ArrowUp':
                nextDirection = DIR.UP;
                break;
            case 'ArrowDown':
                nextDirection = DIR.DOWN;
                break;
            case 'ArrowLeft':
                nextDirection = DIR.LEFT;
                break;
            case 'ArrowRight':
                nextDirection = DIR.RIGHT;
                break;
        }
    });
}