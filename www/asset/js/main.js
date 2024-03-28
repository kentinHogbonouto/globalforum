$(document).ready(function () {
  $("#click-menu").click(function () {
    $(".menu").show("slow").fadeIn("slow");
  });

  $(".hide-menu").click(function () {
    $(".menu").hide("slow").hide("slow");
  });
});
