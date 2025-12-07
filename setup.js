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

    // AQUÍ DEBERÍAN IR LOS LISTENERS DE INPUT DE JUGADOR

    loop();
}

/*
function createMap() {
    // Obtener el archivo por su id
    const fileInput = document.getElementById("fileInput"); 
    
    // Leer el archivo cuando se seleccione
    fileInput.addEventListener("change", function () {
        const file = this.files[0]; // Obtener el archivo seleccionado
        const reader = new FileReader(); // lectura del contenido del archivo

        reader.onload = function () {
            const text = reader.result.trim(); // 

            // Convertir texto en array de filas
            const lines = text.split("\n");

            const rows = lines.length; // Numero de filas
            const cols = lines[0].length; // Numero de columnas
            
            // Crear el mapa como una matriz 2D
            const tilemap = [];
            
            //construccion del mapa a partir del archivo
            for (let y = 0; y < rows; y++) {
                const row = [];
                for (let x = 0; x < cols; x++) {
                    const char = lines[y][x]; 

                    let type = "";
                    if (char === "0") type = "wall"; // Pared
                    else if (char === "1") type = "path"; // Camino

                    row.push({
                        type: type, // Tipo de elemento del mapa
                        x: x, // Coordenada x
                        y: y // Coordenada y
                    });
                }
                tilemap.push(row); // Agregar fila al mapa
            }

            drawmap(tilemap, rows, cols); // Funcion dibujar mapa
        };

        reader.readAsText(file); // Leer el archivo como texto
    });
}

createMap();



function preloadAssets(callback){
    assets.spritesheet.src = 

    assets.spritesheet.onload = () => {
        console.log("Spritesheet cargada correctamente")
        assets.isLoaded = true;
        callback();
    }
}

// Su objetivo es asignar sprite de cada tile en base a la cantidad de caminos disponibles
function loadMapSprites(tilemap, rows, cols){
    
    // Array auxiliares para revisar los vecinos de cada posición y asignar direccion
    dx = [1, -1, 0, 0];
    dy = [0, 0, 1, -1];
    key = ['E', 'O', 'N', 'S'] // Este, Oeste, Norte, Sur

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++){
            // 0 y 1 también sirven como booleanos
            if (gameMap[x][y]){
                // Esta llave va a contener todas las direcciones disponibles del camino
                let spriteKey = "";
                // Revisamos los 4 vecinos
                for (let i = 0; i < 4; i++){
                    let neightX = x + dx[i];
                    let neightY = y + dy[i];
                    // Importante no revisar un index inválido
                    if(neightX < cols && neightX >= 0 && neightY < rows && neightY >= 0){
                        if (gameMap[neightX][neightY]) {
                            // Usando el array auxiliar, incluimos una dirección
                            spriteKey += key[i];
                        }
                    }
                }
                // Con la llave lista, usamos un switch 
                // para encontrar el sprite correspondiente
                switch(spriteKey){
                    case "EONS":
                        
                }
            }
        }
    }
}*/

/*
function drawmap(tilemap, rows, cols) {
    const mapa = document.getElementById("mapa"); 
    mapa.innerHTML = ""; // Limpiar mapa existente

    mapa.style.gridTemplateColumns = `repeat(${cols}, 20px)`;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {

            const tile = document.createElement("div"); //Crear div para tipo de tile
            tile.classList.add("tile"); // agregar clase tile

            if (tilemap[y][x].type === "wall") {
                tile.classList.add("wall"); // agregar a tile la clase wall (pared)
            } else {
                tile.classList.add("path"); // agregar a tile la clase path (camino)
            }

            mapa.appendChild(tile); // Agregar tile al mapa
        }
    }
}
*/
// Para dibujar el mapa se hizo uso de CSS 
