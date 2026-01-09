function draw() {
    //Limpiar el lienzo
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //Dibujar el laberinto
    for (let y = 0; y < gameMap.length; y++) {
        for (let x = 0; x < gameMap[y].length; x++) {
            const tile = gameMap[y][x];

            if (tile.walkeable && tile.terrainSprite) {
                ctx.drawImage(
                    assets.spritesheet,
                    tile.terrainSprite.sx, 
                    tile.terrainSprite.sy, 
                    TILE_SIZE, TILE_SIZE,
                    x * TILE_SIZE, 
                    y * TILE_SIZE, 
                    TILE_SIZE, 
                    TILE_SIZE
                );
            } else {
                ctx.fillStyle = "#111144";
                ctx.fillRect(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

function loop(){
    draw();
    requestAnimationFrame(loop);
}

async function initGame() {
    //Variable definition
    const gameMap = [];
    const player = {
        x: 100, y:100,
        
    };

    
    assets.spritesheet.src = "Imagenes/pacman-juego.gif"

    await new Promise(resolve => assets.spritesheet.onload = resolve);

    const response = await fetch('mapa.txt');
    const text = await response.text();
    
    processMapData(text);

    // AQUÍ DEBERÍAN IR LOS LISTENERS DE INPUT DE JUGADOR

    loop();
}