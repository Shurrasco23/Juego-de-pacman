// Esperar a que todo el HTML cargue
document.addEventListener("DOMContentLoaded", function() {

    const botonJugar = document.getElementById("boton_juego");
    const menu = document.getElementById("menu");
    const juego = document.getElementById("Juego");

    botonJugar.addEventListener("click", function(){
        // 1. Ocultar menú
        menu.style.display = "none";
        
        // 2. Mostrar juego
        juego.style.display = "block";

        if (typeof initGame === "function") {
            console.log("Iniciando juego...");
            initGame();
        }
    });

});