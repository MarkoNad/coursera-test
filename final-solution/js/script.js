(function (global) {

  var homeHtml = "snippets/home-snippet.html";

  function insertHtml(selector, html) {
    var targetElement = document.querySelector(selector);
    console.log("selector: " + selector);
    console.log("element: " + targetElement);
    targetElement.innerHTML = html;
  }

  function showLoading(selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  }

  document.addEventListener("DOMContentLoaded", function (event) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      homeHtml,
      function (responseText) {
        document.querySelector("#main-content")
          .innerHTML = responseText;
      },
      false);
    });

})(window);