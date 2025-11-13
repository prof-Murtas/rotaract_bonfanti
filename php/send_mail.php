<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Carica automaticamente le librerie di Composer
require __DIR__ . '/../vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    $mail = new PHPMailer(true);

    try {
        // ATTIVA DEBUG
        $mail->SMTPDebug = 2; // Mostra tutti i messaggi del server SMTP
        $mail->Debugoutput = 'html';
    
        // CONFIGURAZIONE SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'giordano.dorigoni@buonarroti.tn.it';
        $mail->Password = 'cgbgloninlaggaqk';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
    
        // MITTENTE E DESTINATARIO
        $mail->setFrom('giordano.dorigoni@buonarroti.tn.it', 'Modulo Contatti');
        $mail->addReplyTo($email, $name);
        $mail->addAddress('alessandro.berti1@buonarroti.tn.it');
    
        // CONTENUTO
        $mail->isHTML(true);
        $mail->Subject = 'Nuovo messaggio dal form contatti';
        $mail->Body = "
            <h3>Hai ricevuto un nuovo messaggio</h3>
            <p><strong>Nome:</strong> $name</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Messaggio:</strong><br>$message</p>
        ";
    
        // INVIA
        if ($mail->send()) {
            echo "<h2 style='color:green;'>✅ Mail inviata con successo!</h2>";
        } else {
            echo "<h2 style='color:red;'>❌ Mail non inviata.</h2>";
        }
    
    } catch (Exception $e) {
        echo "<h3 style='color:red;'>Errore PHPMailer: {$mail->ErrorInfo}</h3>";
    }
    
} else {
    header('Location: /rotaract_bonfanti/pages/contatti.html');
    exit;
}
?>
