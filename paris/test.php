<?php

exec("composer require phpmailer/phpmailer");
exec("composer install");
echo "commande is executed";
echo phpinfo();
?>