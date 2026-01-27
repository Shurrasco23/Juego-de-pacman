import { initializeGame } from './engine/setup.js';

// Start game when play button is clicked
document.getElementById('play_button').addEventListener('click', async () => {
    try {
        // Hide menu
        document.getElementById('menu').style.display = 'none';
        
        // Show game
        document.getElementById('game').style.display = 'block';
        
        // Initialize the game
        await initializeGame();
        
        console.log('Game initialized successfully');
    } catch (error) {
        console.error('Failed to start game:', error);
        // Show menu again on error
        document.getElementById('menu').style.display = 'block';
        document.getElementById('game').style.display = 'none';
    }
});

// Close scoreboard button
document.getElementById('close_scoreboard_button').addEventListener('click', () => {
    document.getElementById('scoreboard').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
});

// Scoreboard button
document.getElementById('scoreboard_button').addEventListener('click', () => {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('scoreboard').style.display = 'block';
});

// Instructions button
document.getElementById('instructions_button').addEventListener('click', () => {
    alert('Instrucciones del juego: Usa las flechas para mover a Pacman y come todos los puntos');
});