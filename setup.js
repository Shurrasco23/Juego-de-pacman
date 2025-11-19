//This function will setup the game space

function createMap(){
    
    document.getElementById("fileInput").addEventListener("change", function(){
        const file = this.files[0];
        const reader = new FileReader();

        reader.onload = function(){
            console.log(reader.result);
        };

        reader.readAsText(file);
    });

    let rows = 20;
    let cols = 20;

    const tilemap = [];

    for (let y = 0; y < rows; y++){
        const row = [];
        for (let x = 0; x < cols; x++)
        {
            const tile = {
                element: tileContent,
                x: x,
                y: y,
            };
            row.push(tile)
        }
        tilemap.push(row);
    }
}
