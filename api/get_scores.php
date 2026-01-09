<?php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get top 10 scores
$sql = "SELECT player_name, final_score, score_date 
        FROM scores 
        ORDER BY final_score DESC, score_date DESC 
        LIMIT 10";

$result = $conn->query($sql);

if ($result) {
    $scores = [];
    while ($row = $result->fetch_assoc()) {
        $scores[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'scores' => $scores
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to fetch scores: ' . $conn->error
    ]);
}

$conn->close();
?>
