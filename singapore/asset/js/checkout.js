$(document).ready(function () {
  const booksInput = document.querySelector("#js-books-data")
  if (booksInput) {
    const books = window.sessionStorage.getItem('books') ?? JSON.stringify([])
    booksInput.value = books

  }
  const jsToggle = document.querySelector('#js-payer-toggle');
  if (jsToggle) {
    const payerForm = document.querySelector("#js-payer-form")
    if (payerForm) {
      const className = 'd-none'
      jsToggle.addEventListener('change', () => {
        payerForm.classList.toggle(className)
        const elements = payerForm.querySelectorAll('input, select')
        const required = payerForm.classList.contains(className)
        for (const element of elements) {
          element.setAttribute('required', !required)
        }
      })
    }
  }

  const ticketListContainer = $('#js-ticket-list')
  if (ticketListContainer) {
    const local = window.sessionStorage.getItem('books')
    const books = local ? JSON.parse(local) : []
    let subTotal = 0
    const tva = 160
    for (const book of books) {
      const bookPrice = Number(book.prixbook) * Number(book.quantite)
      subTotal += bookPrice
      const html = `
          <div class="col-12"
            style="display: flex;flex-direction: row;justify-content: space-between;">
            <p>${book.namebook}<span style="font-size: 0.8vw; margin-left: 15px">x </span>${book.quantite}</p>
            <p>SGD${bookPrice}</p>
          </div>
        `
      ticketListContainer.append(html)
    }

    $("#js-subtotal").append(`SGD${subTotal}`)
    $("#js-total").append(`SGD${subTotal + tva}`)
    const checkoutForm = document.querySelector('#js-checkout-form')
    if (checkoutForm) {
      console.log("checkoutForm", checkoutForm)

      checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault()
        const paymentData = {}
        for (const element of checkoutForm.elements) {
          console.log("element", element)
          paymentData[element.name] = element.value
        }

        window.sessionStorage.setItem('paymentData', JSON.stringify(paymentData))
        checkoutForm.submit()
      })
    }
  }
});