function getCookieValue(cookieName) {
  const cookies = document.cookie.split(";"); // Sépare la chaîne de caractères en un tableau de cookies
  for (let i = 0; i < cookies.length; i++) { // Parcourt le tableau de cookies
    const cookie = cookies[i].trim(); // Supprime les espaces autour du cookie
    if (cookie.startsWith(`${cookieName}=`)) { // Vérifie si le cookie correspond au nom recherché
      return cookie.substring(cookieName.length + 1); // Extrait la valeur du cookie
    }
  }
  return ""; // Si le cookie n'a pas été trouvé, renvoie une chaîne vide
}



$(document).ready(function () {

  sessionStorage.removeItem("books");
  localStorage.removeItem("compteurValue");
  const paymentId = getCookieValue('payment_id')

  if (paymentId) {
    const orderInfoContainer = document.getElementById('js-order-info')
    if (orderInfoContainer) {
      orderInfoContainer.innerHTML = `[Order #${paymentId}] (${new Date().toLocaleDateString()}) `
    }
  }

  let paymentData = window.sessionStorage.getItem('paymentData');
  if (!paymentData) return
  paymentData = JSON.parse(paymentData)

  const ticketSource = {
    "$": "New York",
    "$": "London",
    "€": "Paris",
    "SGD": "Singapore"
  }

  const itemContainer = document.getElementById("js-book-pass-container")
  if (itemContainer) {
    const books = JSON.parse(paymentData.books);
    let html = ''
    let subtotal = 0;
    for (const book of books) {
      html += `<tr>
      <td colspan="2">
        <img src="https://london.globalforumcities.com/asset/img/Cities-Logo-Whitebackground-Black-Logo"
          alt="The Global Forum on Cities" style="width: 50px;">
        <span style="color:black !important">Tickets ${ticketSource[paymentData.currencySymbole.trim()]} - ${book.namebook}</span>
      </td>
      <td>${book.quantite}</td>
      <td>${paymentData.currencySymbole}${book.prixbook}</td>
    </tr>`;
      subtotal = subtotal + Number(book.quantite) * Number(book.prixbook)
    }

    itemContainer.innerHTML = `
      ${html}
      <tr>
        <td colspan="4">
          <p>${new Date().toLocaleDateString()}</p>
          <p>${new Date().toLocaleTimeString()}</p>
          <p>${ticketSource[paymentData.currencySymbole.trim()]} City Hall</p>
          <p>Kamal Chunchie Way</p>
          <p>${ticketSource[paymentData.currencySymbole.trim()]}</p>
          <p>E16 1ZE</p>
        </td>
      </tr>
      <tr>
        <td colspan="3">Subtotal : </td>
        <td>${paymentData.currencySymbole}${subtotal}</td>
      </tr>
      <tr>
        <td colspan="3">Payment method : </td>
        <td>Visa</td>
      </tr>
      <tr>
        <td colspan="3">Total : </td>
        <td>${paymentData.currencySymbole}${subtotal}</td>
      </tr>
    `
    const billingContainer = document.getElementById('js-billing-container')
    if (billingContainer) {
      const html = `
      <p>${paymentData.owner_first_name} ${paymentData.owner_last_name}</p>
      <p>${paymentData.owner_mobile}</p>
      <p>${paymentData.owner_address}</p>
      <p>${paymentData.payer_country}</p>`
      billingContainer.innerHTML = html
    }

  }
})