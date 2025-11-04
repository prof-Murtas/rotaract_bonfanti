<?php
header('Content-Type: application/json');

$csvFile = '../csv/storia.csv';
$data = [];

if (($handle = fopen($csvFile, 'r')) !== FALSE) {
    $header = fgetcsv($handle);
    while (($row = fgetcsv($handle)) !== FALSE) {
        $data[] = [
            'anno' => $row[0],
            'presidente' => $row[1]
        ];
    }
    fclose($handle);
}

echo json_encode($data);
?>
