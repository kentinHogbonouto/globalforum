window.onscroll = function() {
  var div = document.getElementById("social");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    div.style.display = "none";
    div.classList.remove("fadeIn");
    div.classList.add("fadeOut");
  } else {
    div.style.display = "block";
    div.classList.remove("fadeOut");
    div.classList.add("fadeIn");
  }
};