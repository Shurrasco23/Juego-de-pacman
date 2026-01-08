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
                pacman.nextDirection = DIRECTIONS.UP;
                event.preventDefault();
                break;
            case 'ArrowDown':
                pacman.nextDirection = DIRECTIONS.DOWN;
                event.preventDefault();
                break;
            case 'ArrowLeft':
                pacman.nextDirection = DIRECTIONS.LEFT;
                event.preventDefault();
                break;
            case 'ArrowRight':
                pacman.nextDirection = DIRECTIONS.RIGHT;
                event.preventDefault();
                break;
        }
    });
}