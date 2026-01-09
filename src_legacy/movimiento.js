/* estructura basica para el movimiento de Pacman */
const pacman = {
    x: 32,
    y: 32,
    speed: 3,
    direction: { x: 0, y: 0 }, // Dirección actual
    nextDirection: { x: 0, y: 0 }, // Próxima dirección solicitada
    width: 20,  // Ancho del hitbox
    height: 20  // Alto del hitbox
}; /* Posision y velocidad inicial de Pacman, con direccion nula */

const keys = {};

// Direcciones disponibles
const DIRECTIONS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

/* Escuchar clicks en las flechas de control */
const fa = document.querySelector('.flecha-arriba');
if (fa) fa.addEventListener('click', (e) => { if (window.__refactor_active) return; pacman.nextDirection = DIRECTIONS.UP; });
const fb = document.querySelector('.flecha-abajo');
if (fb) fb.addEventListener('click', (e) => { if (window.__refactor_active) return; pacman.nextDirection = DIRECTIONS.DOWN; });
const fl = document.querySelector('.flecha-izquierda');
if (fl) fl.addEventListener('click', (e) => { if (window.__refactor_active) return; pacman.nextDirection = DIRECTIONS.LEFT; });
const fr = document.querySelector('.flecha-derecha');
if (fr) fr.addEventListener('click', (e) => { if (window.__refactor_active) return; pacman.nextDirection = DIRECTIONS.RIGHT; });

// Escuchar eventos de teclado 
document.addEventListener('keydown', (e) => {
    if (window.__refactor_active) return;
    switch (e.key) {
        case 'ArrowUp':
        case 'w':  
        case 'W':
            pacman.nextDirection = DIRECTIONS.UP;
            e.preventDefault();
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            pacman.nextDirection = DIRECTIONS.DOWN;
            e.preventDefault();
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            pacman.nextDirection = DIRECTIONS.LEFT;
            e.preventDefault();
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            pacman.nextDirection = DIRECTIONS.RIGHT;
            e.preventDefault();
            break;
    }
    // Compatibilidad AWSD y flechas para el movimiento
});

/* funcion para verificar si una posición es válida (dentro del laberinto) */

function isValidPosition(x, y) {
    // Usar el hitbox: verificar 4 esquinas del hitbox de Pacman
    const hitboxOffsetX = (TILE_SIZE - pacman.width) / 2;
    const hitboxOffsetY = (TILE_SIZE - pacman.height) / 2;
    
    // Esquinas del hitbox
    const corners = [
        { px: x + hitboxOffsetX, py: y + hitboxOffsetY }, // Arriba-izquierda
        { px: x + hitboxOffsetX + pacman.width, py: y + hitboxOffsetY }, // Arriba-derecha
        { px: x + hitboxOffsetX, py: y + hitboxOffsetY + pacman.height }, // Abajo-izquierda
        { px: x + hitboxOffsetX + pacman.width, py: y + hitboxOffsetY + pacman.height } // Abajo-derecha
    ];
    
    // Verificar todas las esquinas
    for (let corner of corners) {
        const tileX = Math.floor(corner.px / TILE_SIZE);
        const tileY = Math.floor(corner.py / TILE_SIZE);
        
        // Verificar que esté dentro del mapa
        if (tileX < 0 || tileY < 0 || tileY >= gameMap.length || tileX >= gameMap[0].length) {
            return false;
        }
        
        // Verificar que el tile sea caminable
        if (!gameMap[tileY][tileX].walkeable) {
            return false;
        }
    }
    
    return true;
}

/* funcion para mover a pacman */
function movePacman() {
    setInterval(() => { /* Mover a pacman continuamente */
        // Primero intentar mover en la dirección solicitada
        if (pacman.nextDirection.x !== 0 || pacman.nextDirection.y !== 0) {
            let newX = pacman.x + (pacman.nextDirection.x * pacman.speed);
            let newY = pacman.y + (pacman.nextDirection.y * pacman.speed);
            
            // Si la próxima dirección es válida, cambiar a ella
            if (isValidPosition(newX, newY)) {
                pacman.direction = pacman.nextDirection;
                pacman.x = newX;
                pacman.y = newY;
            }
        }
        
        // Si no podemos cambiar de dirección, intentar continuar en la dirección actual
        if (pacman.direction.x !== 0 || pacman.direction.y !== 0) {
            let newX = pacman.x + (pacman.direction.x * pacman.speed);
            let newY = pacman.y + (pacman.direction.y * pacman.speed);
            
            // Validar la nueva posición antes de mover
            if (isValidPosition(newX, newY)) {
                pacman.x = newX;
                pacman.y = newY;
            }
        }
    }, 30); /* Actualizar su posicion cada 30 ms */
}

