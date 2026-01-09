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
    // Calcular posición actual en tiles
    const centerX = ghost.x + TILE_SIZE / 2;
    const centerY = ghost.y + TILE_SIZE / 2;
    const tileX = Math.floor(centerX / TILE_SIZE);
    const tileY = Math.floor(centerY / TILE_SIZE);
    
    // Centro del tile actual
    const tileCenterX = tileX * TILE_SIZE;
    const tileCenterY = tileY * TILE_SIZE;
    
    // Distancia al centro
    const distToCenterX = Math.abs(ghost.x - tileCenterX);
    const distToCenterY = Math.abs(ghost.y - tileCenterY);
    const snapThreshold = ghost.speed + 2;

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

    // Cambia de dirección solo cuando está cerca del centro del tile
    const nearCenter = distToCenterX <= snapThreshold && distToCenterY <= snapThreshold;
    
    if (nearCenter && (possibleDirs.length > 2 || Math.random() < 0.02)) {
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
            // Snap al centro antes de cambiar dirección
            ghost.x = tileCenterX;
            ghost.y = tileCenterY;
            ghost.direction = bestDir;
        } else {
            // Movimiento aleatorio inteligente: evitar retroceder y preferir seguir recto
            let dirsSinRetroceso = possibleDirs.filter(dir =>
                !(dir.x === -ghost.direction.x && dir.y === -ghost.direction.y)
            );
            let seguirRecto = possibleDirs.find(dir => dir.x === ghost.direction.x && dir.y === ghost.direction.y);
            if (seguirRecto && Math.random() < 0.7) {
                ghost.direction = seguirRecto;
            } else if (dirsSinRetroceso.length > 0) {
                // Snap al centro antes de cambiar dirección
                ghost.x = tileCenterX;
                ghost.y = tileCenterY;
                ghost.direction = dirsSinRetroceso[Math.floor(Math.random() * dirsSinRetroceso.length)];
            } else {
                ghost.x = tileCenterX;
                ghost.y = tileCenterY;
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
    } else {
        // Si no puede moverse, detener
        ghost.direction = { x: 0, y: 0 };
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

        if (pacmanLives <= 0) {
            // Save score to database
            const playerName = prompt("¡Juego terminado! Puntuación: " + gameScore + "\nIngresa tu nombre:", "Jugador");
            if (playerName && playerName.trim() !== "") {
                saveScoreToDatabase(playerName, gameScore);
            }
            
            // Reset game
            pacmanLives = 3;
            gameScore = 0;
            nivel = 0;
            gameTime = 0;
            reloadMapKeepScore();
            updateLivesUI();
        }
    }
}

function saveScoreToDatabase(playerName, score) {
    fetch('api/save_score.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            player_name: playerName,
            final_score: score
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('✓ Score saved successfully!', data);
            alert('¡Puntuación guardada!');
        } else {
            console.error('Error saving score:', data.error);
            alert('Error al guardar la puntuación');
        }
    })
    .catch(error => {
        console.error('Network error:', error);
        alert('Error de conexión al guardar');
    });
}
