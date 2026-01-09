//definir fantasma
const ghost = {
    x: TILE_SIZE * 5,
    y: TILE_SIZE * 5,
    direction: { x: 1, y: 0 },
    speed: 1
};

let pacmanLives = 3; //vidas de pacman
let cantakedamage = true;

function updateLivesUI() {
    document.getElementsByClassName("vidas")[0].textContent = `Vidas: ${pacmanLives}`;
}

function moveGhost() {
    // Detectar intersección (puede moverse en más de una dirección)
    const tileX = Math.floor((ghost.x + TILE_SIZE / 2) / TILE_SIZE);
    const tileY = Math.floor((ghost.y + TILE_SIZE / 2) / TILE_SIZE);

    let possibleDirs = [];
    const dirs = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
    ];

    for (const dir of dirs) {
        const nx = tileX + dir.x;
        const ny = tileY + dir.y;
        if (
            ny >= 0 && ny < gameMap.length &&
            nx >= 0 && nx < gameMap[0].length &&
            gameMap[ny][nx].walkeable
        ) {
            possibleDirs.push(dir);
        }
    }

    // Cambia de dirección solo en intersecciones
    if (possibleDirs.length > 2 || Math.random() < 0.01) {
        // Opcional: perseguir a Pacman si está cerca
        let bestDir = possibleDirs[0];
        let minDist = Infinity;
        for (const dir of possibleDirs) {
            const px = tileX + dir.x;
            const py = tileY + dir.y;
            const dist = Math.abs(px - Math.floor((pacman.x + TILE_SIZE / 2) / TILE_SIZE)) +
                         Math.abs(py - Math.floor((pacman.y + TILE_SIZE / 2) / TILE_SIZE));
            if (dist < minDist) {
                minDist = dist;
                bestDir = dir;
            }

        }
        ghost.direction = bestDir;
    }

    // Mover el fantasma
    const newX = ghost.x + ghost.direction.x * ghost.speed;
    const newY = ghost.y + ghost.direction.y * ghost.speed;
    const nextTileX = Math.floor((newX + TILE_SIZE / 2) / TILE_SIZE);
    const nextTileY = Math.floor((newY + TILE_SIZE / 2) / TILE_SIZE);

    if (
        nextTileY >= 0 && nextTileY < gameMap.length &&
        nextTileX >= 0 && nextTileX < gameMap[0].length &&
        gameMap[nextTileY][nextTileX].walkeable
    ) {
        ghost.x = newX;
        ghost.y = newY;
    }
}

function checkGhostCollision() {
    const pacmanTileX = Math.floor((pacman.x + TILE_SIZE / 2) / TILE_SIZE);
    const pacmanTileY = Math.floor((pacman.y + TILE_SIZE / 2) / TILE_SIZE);
    const ghostTileX = Math.floor((ghost.x + TILE_SIZE / 2) / TILE_SIZE);
    const ghostTileY = Math.floor((ghost.y + TILE_SIZE / 2) / TILE_SIZE);

    if (pacmanTileX === ghostTileX && pacmanTileY === ghostTileY && cantakedamage) {
        
        pacmanLives = pacmanLives - 1;
        cantakedamage = false; // Pacman es invulnerable tras el golpe
        setTimeout(() => {
            cantakedamage = true; // Vuelve a ser vulnerable después de 2 segundos
        }, 2000);

        updateLivesUI();
        if (pacmanLives <= 0) {
            alert("¡Game Over!");
            pacmanLives = 3;
            gameScore = 0;
            reloadMapKeepScore();
            updateLivesUI();

            // Resetear posición de Pacman y fantasma
            pacman.x = TILE_SIZE * 1;
            pacman.y = TILE_SIZE * 1;
            ghost.x = TILE_SIZE * 5;
            ghost.y = TILE_SIZE * 5;
        }
    }
}

