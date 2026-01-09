//definir fantasma
const ghost = {
    x: TILE_SIZE * 5,
    y: TILE_SIZE * 5,
    direction: { x: 1, y: 0 },
    speed: 1
};

let pacmanLives = 3; //vidas de pacman
let cantakedamage = true; // invulnerabilidad despues de un hit

//Cargar la imagen del fantasma
const fantasmaImg = new Image();
fantasmaImg.src = "Imagenes/Fantasma-rosa.gif";

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
        // Distancia Manhattan entre fantasma y Pacman
        const pacmanTileX = Math.floor((pacman.x + TILE_SIZE / 2) / TILE_SIZE);
        const pacmanTileY = Math.floor((pacman.y + TILE_SIZE / 2) / TILE_SIZE);
        const distToPacman = Math.abs(tileX - pacmanTileX) + Math.abs(tileY - pacmanTileY);

        // Si está cerca, persigue a Pacman
        if (distToPacman <= 5) {
            let bestDir = possibleDirs[0];
            let minDist = Infinity;
            for (const dir of possibleDirs) {
                const px = tileX + dir.x;
                const py = tileY + dir.y;
                const dist = Math.abs(px - pacmanTileX) + Math.abs(py - pacmanTileY);
                if (dist < minDist) {
                    minDist = dist;
                    bestDir = dir;
                }
            }
            ghost.direction = bestDir;
        } 
        // esta lejos de pacman

        else {
            // Movimiento aleatorio inteligente: evitar retroceder y preferir seguir recto
            let dirsSinRetroceso = possibleDirs.filter(dir =>
                !(dir.x === -ghost.direction.x && dir.y === -ghost.direction.y)
            );
            // En caso de poder seguir recto, preferir esa direccion
            let seguirRecto = possibleDirs.find(dir => dir.x === ghost.direction.x && dir.y === ghost.direction.y);
            if (seguirRecto && Math.random() < 0.7) {
                ghost.direction = seguirRecto;
            } else if (dirsSinRetroceso.length > 0) {
                ghost.direction = dirsSinRetroceso[Math.floor(Math.random() * dirsSinRetroceso.length)];
            } else {
                ghost.direction = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
            }
        }
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

// Colision fantasma-pacman
function checkGhostCollision() {
    const pacmanTileX = Math.floor((pacman.x + TILE_SIZE / 2) / TILE_SIZE);
    const pacmanTileY = Math.floor((pacman.y + TILE_SIZE / 2) / TILE_SIZE);
    const ghostTileX = Math.floor((ghost.x + TILE_SIZE / 2) / TILE_SIZE);
    const ghostTileY = Math.floor((ghost.y + TILE_SIZE / 2) / TILE_SIZE);

    if (pacmanTileX === ghostTileX && pacmanTileY === ghostTileY && cantakedamage) {
        
        alert ("Perdiste una vida");
        pacmanLives = pacmanLives - 1;
        cantakedamage = false; // Pacman es invulnerable tras el golpe
        setTimeout(() => {
            cantakedamage = true; // Vuelve a ser vulnerable después de 2 segundos
        }, 2000);

        updateLivesUI();
        if (pacmanLives <= 0) {
            alert("¡Juego terminado!");
            pacmanLives = 3;
            gameScore = 0;
            reloadMapKeepScore();
            updateLivesUI();

            // Resetear posición de Pacman y fantasma
            pacman.x = TILE_SIZE * 1;
            pacman.y = TILE_SIZE * 1;
            ghost.x = TILE_SIZE * 5;
            ghost.y = TILE_SIZE * 5;

            //resetear velocidad del fantasma 
            ghost.speed = 1;
        }
    }
}

