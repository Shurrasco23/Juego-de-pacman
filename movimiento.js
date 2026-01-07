/* estructura basica para el movimiento de Pacman */
const pacman = {
    x: 32,
    y: 32,
    speed: 4,
    direction: null,
    width: 20,  // Ancho del hitbox
    height: 20  // Alto del hitbox
}; /* Posision y velocidad inicial de Pacman, con direccion nula */

const keys = {};

/* Escuchar clicks en las flechas de control */
document.querySelector('.flecha-arriba').addEventListener('click', () => {
    pacman.direction = 'up';
});

document.querySelector('.flecha-abajo').addEventListener('click', () => {
    pacman.direction = 'down';
});

document.querySelector('.flecha-izquierda').addEventListener('click', () => {
    pacman.direction = 'left';
});

document.querySelector('.flecha-derecha').addEventListener('click', () => {
    pacman.direction = 'right';
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
        let newX = pacman.x;
        let newY = pacman.y;
        
        if (pacman.direction === 'up') {
            newY -= pacman.speed;
        } else if (pacman.direction === 'down') {
            newY += pacman.speed;
        } else if (pacman.direction === 'left') {
            newX -= pacman.speed;
        } else if (pacman.direction === 'right') {
            newX += pacman.speed;
        }
        
        // Validar la nueva posición antes de mover
        if (isValidPosition(newX, newY)) {
            pacman.x = newX;
            pacman.y = newY;
        }
    }, 30); /* Actualizar su posicion cada 30 ms */
}

