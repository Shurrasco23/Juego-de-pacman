const pacman = {
    x: 32,
    y: 32,
    speed: 2,
    running: false
};

function movePacman() {
    document.addEventListener('keydown', (event) => {
        switch(event.key) {
            case 'ArrowUp':
                pacman.y -= pacman.speed;
                break;
            case 'ArrowDown':
                pacman.y += pacman.speed;
                break;
            case 'ArrowLeft':
                pacman.x -= pacman.speed;
                break;
            case 'ArrowRight':
                pacman.x += pacman.speed;
                break;
        }
        
        running = true;
        updatePacmanPosition();
    });
}

function updatePacmanPosition() {
    const PacmanElement = document.getElementById('pacman');
    PacmanElement.style.left = pacman.x + 'px';
    PacmanElement.style.top = pacman.y + 'px';
}

