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
// Para dibujar el mapa se hizo uso de CSS 
