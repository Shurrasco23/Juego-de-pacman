/* estructura basica para el movimiento de Pacman */

const pacman = {
    x: 32,
    y: 32,
    speed: 4,
    direction: null
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
