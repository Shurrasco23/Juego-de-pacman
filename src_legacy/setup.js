const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 32;

const ITEM_TYPE = {
    NONE: 0,
    DOT: 1, // Puntito
    POWER: 2 // Cereza
}

const assets = {
    spritesheet: new Image(),
    
    spriteCoords: {
        0:  {x: 0, y: 0}, // No caminable
        1:  {x: 2, y: 3}, // Norte
        2:  {x: 0, y: 3}, // Oeste
        3:  {x: 2, y: 2}, // Norte-Oeste
        4:  {x: 3, y: 3}, // Este
        5:  {x: 3, y: 2}, // Norte-Este
        6:  {x: 3, y: 0}, // Oeste-Este
        7:  {x: 2, y: 1}, // Norte-Oeste-Este
        8:  {x: 1, y: 3}, // Sur
        9:  {x: 2, y: 0}, // Norte-Sur
        10: {x: 0, y: 2}, // Oeste-Sur
        11: {x: 0, y: 1}, // Norte-Oeste-Sur
        12: {x: 1, y: 2}, // Este-Sur
        13: {x: 3, y: 1}, // Norte-Este-Sur
        14: {x: 1, y: 1}, // Oeste-Este-Sur
        15: {x: 1, y: 0}  // Norte-Oeste-Este-Sur
    },

    // IMPORTANTE REDEFINIR ESTO PARA LA FUTURA SPRITESHEET DE ITEMS
    items: {
        [ITEM_TYPE.DOT]: {x: 0, y: 2},
        [ITEM_TYPE.POWER]: {x: 1, y: 2},
    }
}

let gameMap = [];

// Variable para controlar el tiempo del juego
let gameTime = 0;

// Variable para los puntos
let gameScore = 0;

function processMapData(text) {
    const lines = text.trim().split("\n");
    const rows = lines.length;
    const cols = lines[0].length;

    //Ajustamos el canvas al tamaño del mapa
    canvas.width = cols * TILE_SIZE;
    canvas.height = rows * TILE_SIZE;
    
    //Reiniciamos por si acaso
    gameMap = [];

    //Esta linea divide cada linea en un string aparte, y cada string en carácteres separados
    //Luego asigna el valor de cada caracter al valor de la expresión ¿c (carácter) === '1'?
    const boolMap = lines.map(line => line.split('').map(c => c === '1'));

    for (let y = 0; y < rows; y++){
        let rowData = [];
        for (let x = 0; x < cols; x++){
            const isPath = boolMap[y][x];

            let tile = {
                
                //¿Es caminable?
                walkeable: isPath,
                //Textura del suelo
                terrainSprite: null, //Se define posteriormente
                //Logica del juego
                item: ITEM_TYPE.NONE,
                itemSprite: null
            };

            if (isPath) {
                //Calcular la llave de su sprite
                const bitmask = calculateBitmask(boolMap, x, y, cols, rows);
                
                const coords = assets.spriteCoords[bitmask] || {x: 0, y: 0};

                tile.terrainSprite = {
                    sx: coords.x * TILE_SIZE,
                    sy: coords.y * TILE_SIZE
                };

                // Generar pelotitas en todos los tiles caminables (excepto la posición inicial de Pacman)
                if (!(x === 1 && y === 1)) {
                    tile.item = ITEM_TYPE.DOT;
                }
            }
            rowData.push(tile);
        }
        gameMap.push(rowData);
    }
}

function calculateBitmask(boolMap, x, y, cols, rows){
    let value = 0;
    // Suma binaria de vecinos N=1, W=2, E=4, S=8
    if (y > 0 && boolMap[y - 1][x]) value += 1;          // Norte
    if (x > 0 && boolMap[y][x - 1]) value += 2;          // Oeste
    if (x < cols - 1 && boolMap[y][x + 1]) value += 4;   // Este
    if (y < rows - 1 && boolMap[y + 1][x]) value += 8;   // Sur
    return value;
}

// Función para detectar colisiones con pelotitas
function checkDotCollision() {
    const tileX = Math.floor((pacman.x + TILE_SIZE / 2) / TILE_SIZE);
    const tileY = Math.floor((pacman.y + TILE_SIZE / 2) / TILE_SIZE);

    if (tileY >= 0 && tileY < gameMap.length && tileX >= 0 && tileX < gameMap[0].length) {
        const tile = gameMap[tileY][tileX];
        
        if (tile.item === ITEM_TYPE.DOT) {
            // Remover pelotita y aumentar puntos
            tile.item = ITEM_TYPE.NONE;
            gameScore += 50;
            document.getElementsByClassName("points")[0].textContent = `Points: ${gameScore}`;
        }
        // Si no quedan pelotitas, recargar el mapa manteniendo la puntuación
        if (dotsRemaining() === 0) {
            // pequeñas pausas para evitar recargas múltiples rápidas
            setTimeout(() => {
                reloadMapKeepScore();
            }, 200);
        }
    }
}

// Cuenta cuántas pelotitas (DOT) quedan en el mapa
function dotsRemaining() {
    let count = 0;
    for (let y = 0; y < gameMap.length; y++) {
        for (let x = 0; x < gameMap[y].length; x++) {
            if (gameMap[y][x].item === ITEM_TYPE.DOT) count++;
        }
    }
    return count;
}

// Recarga el mapa desde mapa.txt sin reiniciar la puntuación
async function reloadMapKeepScore() {
    const response = await fetch('mapa.txt');
    const text = await response.text();
    processMapData(text);

    // Resetear posición de Pacman a la inicial (tile 1,1)
    if (typeof pacman !== 'undefined') {
        pacman.x = TILE_SIZE * 1;
        pacman.y = TILE_SIZE * 1;
        pacman.direction = { x: 0, y: 0 };
        pacman.nextDirection = { x: 0, y: 0 };
    }

    // Actualizar la UI de puntos por si acaso
    document.getElementsByClassName("points")[0].textContent = `Points: ${gameScore}`;
}

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

            // Dibujar pelotitas
            if (tile.item === ITEM_TYPE.DOT) {
                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.arc(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    //Dibujar a Pacman
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(pacman.x + TILE_SIZE / 2, pacman.y + TILE_SIZE / 2, TILE_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Verificar colisiones con pelotitas
    checkDotCollision();
}


function loop(){
    draw();
    requestAnimationFrame(loop);
}

async function initGame() {
    assets.spritesheet.src = "Imagenes/pacman-juego.gif"

    await new Promise(resolve => assets.spritesheet.onload = resolve);

    const response = await fetch('mapa.txt');
    const text = await response.text();
    processMapData(text);

    tiempo ();
    movePacman();
    loop();
}

function tiempo() {

    setInterval (() => {

        gameTime++;
        document.getElementsByClassName("time")[0].textContent = `Time: ${gameTime}s`;
        
    }, 1000);
}

function enemy() {


}