<?php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get JSON data from request body
$data = json_decode(file_get_contents('php://input'), true);

// Validate data
if (!isset($data['player_name']) || !isset($data['final_score'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

// Clean input
$player_name = $conn->real_escape_string($data['player_name']);
$final_score = intval($data['final_score']);

// Insert into database
$sql = "INSERT INTO scores (player_name, final_score) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $player_name, $final_score);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Score saved successfully',
        'id' => $stmt->insert_id
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save score: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>
