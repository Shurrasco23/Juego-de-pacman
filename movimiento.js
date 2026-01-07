/* estructura basica para el movimiento de Pacman */

const pacman = {
    x: 32,
    y: 32,
    speed: 4,
    direction: null
}; /* Posision y velocidad inicial de Pacman, con direccion nula */

const keys = {};

/* Escuchar eventos de teclado */

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        pacman.direction = 'up';
    } else if (event.key === 'ArrowDown') {
        pacman.direction = 'down';
    } else if (event.key === 'ArrowLeft') {
        pacman.direction = 'left';
    } else if (event.key === 'ArrowRight') {
        pacman.direction = 'right';
    }
});

/* funcion para mover a pacman */

function movePacman() {
    setInterval(() => { /* Mover a pacman continuamente */
        if (pacman.direction === 'up') {
            pacman.y -= pacman.speed;
        } else if (pacman.direction === 'down') {
            pacman.y += pacman.speed;
        } else if (pacman.direction === 'left') {
            pacman.x -= pacman.speed;
        } else if (pacman.direction === 'right') {
            pacman.x += pacman.speed;
        }
        
        const PacmanElement = document.getElementById('pacman');
        PacmanElement.style.left = pacman.x + 'px';
        PacmanElement.style.top = pacman.y + 'px';
    }, 30); /* Actualizar su posicion cada 30 ms */
}
