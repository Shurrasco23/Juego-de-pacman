// Esperar a que todo el HTML cargue
document.addEventListener("DOMContentLoaded", function() {

    const botonJugar = document.getElementById("boton_juego");
    const botonScoreboard = document.getElementById("boton_scoreboard");
    const botonCerrarScoreboard = document.getElementById("boton_cerrar_scoreboard");
    const menu = document.getElementById("menu");
    const juego = document.getElementById("Juego");
    const scoreboard = document.getElementById("scoreboard");

    botonJugar.addEventListener("click", function(){
        // 1. Ocultar menú
        menu.style.display = "none";
        
        // 2. Mostrar juego
        juego.style.display = "block";

        if (typeof initGame === "function") {
            initGame();
        }
    });

    // Mostrar scoreboard
    if (botonScoreboard) {
        botonScoreboard.addEventListener("click", function(){
            menu.style.display = "none";
            scoreboard.style.display = "block";
            
            // Cargar puntuaciones
            loadScoreboard();
        });
    }

    // Cerrar scoreboard
    if (botonCerrarScoreboard) {
        botonCerrarScoreboard.addEventListener("click", function(){
            scoreboard.style.display = "none";
            menu.style.display = "flex";
        });
    }

});

// Función para cargar el scoreboard desde la base de datos
function loadScoreboard() {
    const scoreboardList = document.getElementById("scoreboard_list");
    scoreboardList.innerHTML = '<p class="loading_text">Cargando puntuaciones...</p>';
    
    zfetch('api/get_scores.php')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.scores.length > 0) {
                scoreboardList.innerHTML = '';
                data.scores.forEach((score, index) => {
                    const scoreItem = document.createElement('div');
                    scoreItem.className = 'score_item';
                    scoreItem.innerHTML = `
                        <div class="score_rank">#${index + 1}</div>
                        <div class="score_info">
                            <div class="score_name">${score.player_name}</div>
                            <div class="score_date">${new Date(score.score_date).toLocaleDateString('es-ES')}</div>
                        </div>
                        <div class="score_points">${score.final_score} pts</div>
                    `;
                    scoreboardList.appendChild(scoreItem);
                });
            } else {
                scoreboardList.innerHTML = '<p class="loading_text">No hay puntuaciones registradas aún.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading scores:', error);
            scoreboardList.innerHTML = '<p class="loading_text">Error al cargar puntuaciones.</p>';
        });
}