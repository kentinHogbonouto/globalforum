function ajouterAuPanier(produit) {
  const panier = JSON.parse(localStorage.getItem("panier")) || [];
  panier.push(produit);
  localStorage.setItem("panier", JSON.stringify(panier));
}


function afficherPanier() {
  const panier = JSON.parse(localStorage.getItem("panier")) || [];
  const panierListe = document.getElementById("panier");
  for (let i = 0; i < panier.length; i++) {
    const produitLi = document.createElement("p");
    produitLi.classList.add("text-dark");
    produitLi.classList.add("bold");
    produitLi.classList.add("mt-2");
    produitLi.textContent = panier[i];
    panierListe.appendChild(produitLi);
  }
}

function effacerPanier() {
  localStorage.clear();

  const x = document.getElementById("myDIV");
  if (x.style.display === "block") {
    x.style.display = "none";
    localStorage.setItem("show", false);
  }
}

function incrementer() {
  const localBooks = window.sessionStorage.getItem("books")
  const books = localBooks ? JSON.parse(localBooks) : []
  const book = {
    namebook: this.dataset.namebook.trim(),
    prixbook: this.dataset.prixbook,
    quantite: 1
  }
  const element = books.find(item => item.namebook === book.namebook)
  if (element) {
    element.quantite = Number(element.quantite) + Number(book.quantite)
  } else {
    books.push(book)
  }

  const span = document.getElementById("compteur");
  const bookItemsSize = books.length
  span.innerText = bookItemsSize;
  localStorage.setItem("compteurValue", bookItemsSize);
  window.sessionStorage.setItem('books', JSON.stringify(books))
}

// Récupérer la valeur du compteur depuis localStorage lors du chargement de la page
window.onload = function () {
  const span = document.getElementById("compteur");
  span.style.display = "block";
  const valeur = localStorage.getItem("compteurValue");
  if (valeur !== null) {
    span.innerText = valeur;
  }
};

(function bookPassEvent() {

  const nodeListe = document.querySelectorAll('#js-book-pass')
  for (const node of nodeListe) {
    node.addEventListener("click", incrementer)
  }

})()