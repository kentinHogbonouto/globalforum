<?php
require './vendor/autoload.php';
use Stripe\Checkout\Session;
use Stripe\Stripe;

header("Content-Type: application/json; charset=UTF-8");
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");


$STRIPE_SECRET = "sk_test_51MzHJ6BXAS73LFrZmBTc4DbIV9uwxJ8lQ5sTEKWCnPgArh3MtsVe5nmOC8OQfLFuzTI7dj47TTUiKKuv3PCixFlh00NpSvbD61";

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


class StripePayment
{

  public function __construct($clientSecret)
  {
    echo $clientSecret;
    Stripe::setApiKey($clientSecret);
    Stripe::setApiVersion("2022-11-15");
  }

  public function startPayment($cart)
  {
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
    $domaine = $_SERVER['HTTP_HOST'];

    // $path = $protocol . '://' . $domaine;
    $path = "http://london.globalforumcities.com";

    $session = Session::create([
      'mode' => 'payment',
      'success_url' => $path . '/recu.html',
      'cancel_url' => $path . '/checkout.html',
      'line_items' => $cart->getItems(),
      "customer_email" => $cart->getOwner()['address'],
    ]);


    header("HTTP/1.1 303 See Other");
    header('Location: ' . $session->url);
  }
}

$payment = new StripePayment($STRIPE_SECRET);
$cart = new Cart($_POST);
var_dump($cart->getItems());
$payment->startPayment($cart);

echo "echo start payment";

?>