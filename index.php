<!DOCTYPE html>

<html lang = "es">

<head>
    
    <meta charset="UTF-8">
    <title> Laberinto pacman </title>
    <link rel="stylesheet" href="Css/main.css"> <!-- Css -->

</head>

<body>
    
    <div id="menu">
        <div id="container_menu">
            <h1 class="titulo_juego"> Pacman </h1>
            <button id="boton_juego" class="boton_juego"> Jugar</button>
            <button id="boton_instrucciones" class="boton_instrucciones"> Instrucciones</button>
        </div>
    </div>

    <div id="Juego", style="display: none"> <!-- Juego-->
        
        <div id="container_juego">
        
        <h1 class="Mensaje-estadisticas"> Estadisticas de juego </h1> <!-- Container estadisticas--> 
        
        <div id="container-estadisticas">
            <h2 class="Nivel-actual"> NIVEL 1 </h2> <!-- Nivel -->
            <div class="puntos"> Puntos: 0  </div> <!-- Puntos -->
            <div class="vidas"> Vidas: 3 </div> <!-- Vidas-->
            <div class="tiempo"> Tiempo: 0s </div> <!-- Tiempo-->
        </div>

        <canvas id="gameCanvas" width="480" height="480">
            Tu navegador no soporta Canvas de HTML5. Por favor actualízalo.
        </canvas>

        <br>
        
        <div class="controles"> <!-- flechas-->
            <div class="cruz-control">
                <div class="fila-arriba">
                    <div class="flecha flecha-arriba">
                        <img src="/Imagenes/flecha-arriba.png" height="100px">
                    </div>
                </div>
                    
                <div class="fila-horizontal">
                    <div class="flecha flecha-izquierda">
                        <img src="/Imagenes/flecha-izquierda.png" width="100px">
                    </div>
                    
                    <div class="flecha flecha-derecha">
                        <img src="/Imagenes/flecha-derecha.png" width="100px">
                    </div>
                    
                </div>

                <div class="fila-abajo">
                    <div class="flecha flecha-abajo">
                        <img src="/Imagenes/flecha-abajo.png" height="100px">
                    </div>
                </div>
            </div>
        </div> 
    </div>
    </div>

    <script src="setup.js"> </script> <!-- setup js-->
    <script src="main.js"> </script> <!-- Main js-->
    <script src="navegacion.js"> </script> <!-- Navegacion-->
    <script src="movimiento.js"> </script> <!-- Movimiento-->
    <script src="fantasma.js"> </script> <!-- fantasma-->

</body>

</html>

 
