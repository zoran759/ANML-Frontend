<?php


    $name = $_POST["name"];
    $company = $_POST["company"];
    $email = $_POST["email"];
    $message = $_POST["description"];
    $project_type = $_POST["project-type"];
    $budget = $_POST["budget"];
    $timeline = $_POST["timeline"];


$EmailTo = "info@anml.com";
$Subject = "Contact form ANML";

// prepare email body text
$Body = "";
$Body .= "Name: ";
$Body .= $name;
$Body .= "\n";
$Body .= "Company: ";
$Body .= $company;
$Body .= "\n";
$Body .= "Email: ";
$Body .= $email;
$Body .= "\n";
$Body .= "Project Type: ";
$Body .= $project_type;
$Body .= "\n";
$Body .= "Budget: ";
$Body .= $budget;
$Body .= "\n";
$Body .= "Timeline: ";
$Body .= $timeline;
$Body .= "\n";
$Body .= "Message: ";
$Body .= $message;
$Body .= "\n";

$Headers = "From:".$EmailTo;


// send email
if(mail($EmailTo, $Subject, $Body, $Headers, "-f ".$EmailTo)) {
    echo 1;
}



?>
