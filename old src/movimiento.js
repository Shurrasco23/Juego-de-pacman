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
document.querySelector('.flecha-arriba').addEventListener('click', () => {
    pacman.nextDirection = DIRECTIONS.UP;
});

document.querySelector('.flecha-abajo').addEventListener('click', () => {
    pacman.nextDirection = DIRECTIONS.DOWN;
});

document.querySelector('.flecha-izquierda').addEventListener('click', () => {
    pacman.nextDirection = DIRECTIONS.LEFT;
});

document.querySelector('.flecha-derecha').addEventListener('click', () => {
    pacman.nextDirection = DIRECTIONS.RIGHT;
});

// Escuchar eventos de teclado 
document.addEventListener('keydown', (e) => {
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

/* funcion para mover a pacman */
function movePacman() {
    setInterval(() => { /* Mover a pacman continuamente */
        
        // Calcular la posición del centro de Pacman
        const centerX = pacman.x + TILE_SIZE / 2;
        const centerY = pacman.y + TILE_SIZE / 2;
        
        // Calcular el tile actual
        const currentTileX = Math.floor(centerX / TILE_SIZE);
        const currentTileY = Math.floor(centerY / TILE_SIZE);
        
        // Calcular el centro exacto del tile actual
        const tileCenterX = currentTileX * TILE_SIZE;
        const tileCenterY = currentTileY * TILE_SIZE;
        
        // Distancia al centro del tile (en pixeles)
        const distToCenterX = Math.abs(pacman.x - tileCenterX);
        const distToCenterY = Math.abs(pacman.y - tileCenterY);
        
        // Umbral para considerar que estamos "cerca del centro"
        const snapThreshold = pacman.speed + 2;
        
        // Primero intentar mover en la dirección solicitada
        if (pacman.nextDirection.x !== 0 || pacman.nextDirection.y !== 0) {
            // Verificar si estamos cerca del centro del tile
            const nearCenterX = distToCenterX <= snapThreshold;
            const nearCenterY = distToCenterY <= snapThreshold;
            
            // Determinar si debemos verificar el cambio de dirección
            let canTurn = false;
            
            if (pacman.nextDirection.x !== 0 && nearCenterY) {
                // Quiere moverse horizontalmente, debe estar centrado verticalmente
                canTurn = true;
            } else if (pacman.nextDirection.y !== 0 && nearCenterX) {
                // Quiere moverse verticalmente, debe estar centrado horizontalmente
                canTurn = true;
            }
            
            if (canTurn) {
                // Verificar si el tile destino es caminable ANTES de intentar moverse
                const nextTileX = currentTileX + pacman.nextDirection.x;
                const nextTileY = currentTileY + pacman.nextDirection.y;
                
                // Verificar que el tile destino existe y es caminable
                const isNextTileValid = nextTileY >= 0 && nextTileY < gameMap.length &&
                                       nextTileX >= 0 && nextTileX < gameMap[0].length &&
                                       gameMap[nextTileY][nextTileX].walkeable;
                
                if (isNextTileValid) {
                    // Snap al centro del tile en el eje perpendicular
                    if (pacman.nextDirection.x !== 0) {
                        pacman.y = tileCenterY; // Centrar verticalmente
                    } else {
                        pacman.x = tileCenterX; // Centrar horizontalmente
                    }
                    
                    pacman.direction = pacman.nextDirection;
                } else {
                    // Dirección inválida, limpiar nextDirection
                    pacman.nextDirection = { x: 0, y: 0 };
                }
            }
        }
        
        // Continuar moviendo en la dirección actual (siempre)
        if (pacman.direction.x !== 0 || pacman.direction.y !== 0) {
            let newX = pacman.x + (pacman.direction.x * pacman.speed);
            let newY = pacman.y + (pacman.direction.y * pacman.speed);
            
            // Validar la nueva posición antes de mover
            if (isValidPosition(newX, newY)) {
                pacman.x = newX;
                pacman.y = newY;
            } else {
                // Si chocamos con una pared, detener el movimiento
                pacman.direction = { x: 0, y: 0 };
            }
        }
    }, 30); /* Actualizar su posicion cada 30 ms */
}

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