<?php
require './vendor/autoload.php';
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;
use Stripe\Checkout\Session;
use Stripe\Stripe;

header("Content-Type: application/json; charset=UTF-8");
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

function getAdresss($symb)
{
  if ($symb == '£') {
    return "London";
  }

  if ($symb == '€') {
    return 'Paris';
  }

  if ($symb == '$') {
    return 'New York';
  }

  if ($symb == 'SGD') {
    return 'Singapore';
  }
}
// test key
$STRIPE_SECRET = "sk_test_51MzHJ6BXAS73LFrZmBTc4DbIV9uwxJ8lQ5sTEKWCnPgArh3MtsVe5nmOC8OQfLFuzTI7dj47TTUiKKuv3PCixFlh00NpSvbD61";
// live key
// $STRIPE_SECRET = "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";

class Cart
{
  private $items = [];
  private $owner;
  private $payer;

  public function __construct($payload)
  {

    $books = json_decode($payload['books']);

    foreach ($books as $key => $value) {
      $this->items[] = [
        'quantity' => (int) $value->quantite,
        'price_data' => [
          'currency' => $payload['currency'],
          'product_data' => [
            'name' => $value->namebook
          ],
          'unit_amount' => (float) $value->prixbook * 100
        ],
      ];
    }

    $this->items[] = [
      'quantity' => 1,
      'price_data' => [
        'currency' => $payload['currency'],
        'product_data' => [
          'name' => "VAT"
        ],
        'unit_amount' => 160 * 100
      ],
    ];

    $this->owner = [
      'fist_name' => $payload["owner_first_name"],
      'last_name' => $payload['owner_last_name'],
      'mobile' => $payload['owner_mobile'],
      'address' => $payload['owner_address'],
      'company_name' => $payload['owner_company_name'],
      'department' => $payload['owner_department'],
      'country' => $payload['owner_country'],
      'job_title' => $payload['owner_job_title'],
    ];

    $this->payer = [
      'fist_name' => $payload["payer_fist_name"],
      'last_name' => $payload['payer_last_name'],
      'mobile' => $payload['payer_mobile'],
      'address' => $payload['payer_address'],
      'company_name' => $payload['payer_company'],
      'department' => $payload['owner_department'],
      'country' => $payload['payer_country'],
      'job_title' => $payload['payer_job'],
    ];

  }

  public function getItems()
  {
    return $this->items;
  }

  public function getOwner()
  {
    return $this->owner;
  }

  public function getPayer()
  {
    return $this->payer;
  }
}

class SendMail
{
  private $payment_id;
  private $amount;

  private $mode;

  private $created;

  public function __construct($payment_id, $amount, $mode, $created)
  {
    $this->amount = $amount;
    $this->payment_id = $payment_id;
    $this->mode = $mode;
    $this->created = $created;
  }

  public function start($cart, $domaine)
  {
    try {
      $symbole = $_POST['currencySymbole'];
      $mail = new PHPMailer(true);
      $currency = $_POST['currency'];
      $subject = 'Confirmation de paiement Stripe';
      $template = file_get_contents("template_email.html");
      $template = str_replace("{payment_id}", $this->payment_id, $template);
      $template = str_replace("{amount}", $this->amount, $template);
      $template = str_replace("{currency}", $currency, $template);
      $template = str_replace("{url}", $domaine, $template);
      $itemsHtml = '';
      $subtotal = 0;
      foreach ($cart->getItems() as $value) {
        $name = $value['price_data']['product_data']['name'];
        $price = $value['price_data']['unit_amount'] / 100;
        $quantity = $value['quantity'];
        $item = file_get_contents("email-items.html");
        $item = str_replace("{name}", $name, $item);
        $item = str_replace("{price}", $price . $symbole, $item);
        $item = str_replace("{quantity}", $quantity, $item);
        $itemsHtml = $itemsHtml . $item;
        $subtotal = $subtotal + ($price * $quantity);
      }
      $day = date('l, F jS Y');
      $hours = date('H:i:s');
      $template = str_replace("{items}", $itemsHtml, $template);
      $template = str_replace("{subtotal}", $symbole . $subtotal, $template);
      $template = str_replace("{total}", $symbole . $subtotal, $template);
      $recever_name = $cart->getOwner()['fist_name'] . ' ' . $cart->getOwner()['last_name'];
      $template = str_replace("{name}", $recever_name, $template);
      $template = str_replace("{tel}", $_POST['owner_mobile'], $template);
      $template = str_replace("{address}", $_POST['owner_address'], $template);
      $template = str_replace("{county}", $_POST['owner_country'], $template);
      $template = str_replace("{method}", "Visa", $template);
      $template = str_replace("{day}", $day, $template);
      $template = str_replace("{hours}", $hours, $template);
      $template = str_replace("{city}", getAdresss($symbole), $template);
      $sender_email = "noreply@globalforumcities.com";
      $sender_password = "@globalforumcities.com";
      $sender_name = 'The Global Forum on Cities';
      $recever_email = $cart->getOwner()['address'];
      $mail->SMTPDebug = 0;
      $mail->isSMTP();
      $mail->Host = 'ssl0.ovh.net';
      $mail->SMTPAuth = true;
      $mail->Username = $sender_email;
      $mail->Password = $sender_password;
      $mail->SMTPSecure = 'ssl';
      $mail->Port = 465;
      $mail->setFrom($sender_email, $sender_name);
      $mail->addAddress($recever_email, $recever_name);
      $mail->isHTML(true);
      $mail->Subject = $subject;
      $mail->Body = $template;
      $mail->send();
      setcookie("day", $day);
      setcookie("hours", $hours);

    } catch (Exception $e) {
      echo 'Erreur lors de l\'envoi de l\'e-mail : ' . $mail->ErrorInfo;
    }
  }
}

class StripePayment
{

  public function __construct($clientSecret)
  {
    Stripe::setApiKey($clientSecret);
    Stripe::setApiVersion("2022-11-15");
  }

  public function startPayment($cart)
  {
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
    $domaine = $_SERVER['HTTP_HOST'];

    $path = $protocol . '://' . $domaine;
    // $path = "http://london.globalforumcities.com";

    $session = Session::create([
      'mode' => 'payment',
      'success_url' => $path . '/recu.html',
      'cancel_url' => $path . '/checkout.html',
      'line_items' => $cart->getItems(),
      "customer_email" => $cart->getOwner()['address'],
    ]);
    setcookie("payment_id", $session->id);
    setcookie('payment_statut', $session->status);
    header("HTTP/1.1 303 See Other");
    header('Location: ' . $session->url);
    $sendMail = new SendMail($session->id, $session->amount_total, $session->mode, $session->created);
    $sendMail->start($cart, $path);

  }
}

$payment = new StripePayment($STRIPE_SECRET);
$cart = new Cart($_POST);
$payment->startPayment($cart);

echo "echo start payment";

?>