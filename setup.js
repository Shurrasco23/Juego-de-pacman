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
    assets.spritesheet.src = "Imagenes/mazeSpritesheet.png"

    await new Promise(resolve => assets.spritesheet.onload = resolve);

    const response = await fetch('mapa.txt');
    const text = await response.text();
    processMapData(text);

    movePacman();
    loop();
}