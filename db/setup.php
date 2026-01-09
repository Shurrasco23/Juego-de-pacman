<?php
$host = 'localhost';
$username = 'root';
$password = '';

// Connect without selecting database first
$conn = new mysqli($host, $username, $password);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Read and execute schema.sql
$sql = file_get_contents('schema.sql');

// Split by semicolon and execute each statement
$statements = array_filter(array_map('trim', explode(';', $sql)));

foreach ($statements as $statement) {
    if (!empty($statement)) {
        if ($conn->query($statement) === TRUE) {
            echo "✓ Executed: " . substr($statement, 0, 50) . "...<br>";
        } else {
            echo "✗ Error: " . $conn->error . "<br>";
        }
    }
}

echo "<br><strong>Database setup complete!</strong>";
$conn->close();
?>