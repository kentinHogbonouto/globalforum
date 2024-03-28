function ajouterAuPanier(produit) {
  var panier = JSON.parse(localStorage.getItem("panier")) || [];
  panier.push(produit);
  localStorage.setItem("panier", JSON.stringify(panier));
}

// function afficherPanierPartout() {
//   var x = document.getElementById("myDIV");
//   var show = localStorage.getItem("show");
//   if (show === "true") {
//     x.style.display = "block";
//   } else {
//     x.style.display = "none";
//   }
// }

// afficherPanierPartout();

function afficherPanier() {
  var panier = JSON.parse(localStorage.getItem("panier")) || [];
  var panierListe = document.getElementById("panier");
  for (var i = 0; i < panier.length; i++) {
    var produitLi = document.createElement("p");
    produitLi.classList.add("text-dark");
    produitLi.classList.add("bold");
    produitLi.classList.add("mt-2");
    produitLi.textContent = panier[i];
    panierListe.appendChild(produitLi);
  }
}

function effacerPanier() {
  console.log("delete");
  localStorage.clear();

  var x = document.getElementById("myDIV");
  if (x.style.display === "block") {
    x.style.display = "none";
    localStorage.setItem("show", false);
  }
}

function incrementer() {
  var span = document.getElementById("compteur");
  var valeur = parseInt(span.innerText);
  valeur = valeur + 1;
  span.innerText = valeur;

  // Stocker la nouvelle valeur du compteur dans localStorage
  localStorage.setItem("compteurValue", valeur);

  ajouterAuPanier(valeur);
}

// Récupérer la valeur du compteur depuis localStorage lors du chargement de la page
window.onload = function () {
  var span = document.getElementById("compteur");
  console.log(span);
  span.style.display = "block";
  var valeur = localStorage.getItem("compteurValue");
  if (valeur !== null) {
    span.innerText = valeur;
  }
};
