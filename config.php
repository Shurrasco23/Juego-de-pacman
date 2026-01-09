<?php
// Database configuration
$host = 'localhost';    
$dbname = 'pacman_db';      
$username = 'root';         
$password = '';             

// Connection
$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Charset setup
$conn->set_charset("utf8");

// For API communication
header('Content-Type: application/json');
?>