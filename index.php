<!DOCTYPE html>

<html lang = "es">

<head>
    
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0, minimum-scale=1.0">
    <title> Laberinto Pacman </title>
    <link rel="stylesheet" href="css/main.css"> <!-- CSS -->

</head>

<body>
    
    <div id="menu">
        <div id="menu_container">
            <h1 class="game_title">Pacman</h1>
            <button id="play_button" class="play_button">Jugar</button>
            <button id="instructions_button" class="instructions_button">Instrucciones</button>
            <button id="scoreboard_button" class="scoreboard_button">Puntuaciones</button>
        </div>
    </div>

    <div id="scoreboard" style="display: none">
        <div id="scoreboard_container">
            <h1 class="scoreboard_title">Top 10 Puntuaciones</h1>
            <div id="scoreboard_list">
                <p class="loading_text">Cargando puntuaciones...</p>
            </div>
            <button id="close_scoreboard_button" class="close_button">Volver al Menú</button>
        </div>
    </div>

    <div id="game" style="display: none">
        <div id="game_container">
            <h1 class="statistics_message">Estadísticas de Juego</h1>
            
            <div id="statistics_container">
                <h2 class="current_level">NIVEL 1</h2>
                <div class="points">Puntos: 0</div>
                <div class="lives">Vidas: 3</div>
                <div class="time">Tiempo: 0s</div>
            </div>

            <div id="gameContainer">
                <canvas id="labyrinthCanvas"></canvas>
                <canvas id="entityCanvas"></canvas>
            </div>
            
            <div class="controls">
                <div id="joystickContainer" class="joystick-container">
                    <div id="joystickStick" class="joystick-stick"></div>
                </div>
            </div>
        </div>
    </div>

    <script type="module" src="src/main.js"></script>

</body>

</html>

 
