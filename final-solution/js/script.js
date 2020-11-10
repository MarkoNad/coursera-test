(function (global) {

  var dc = {};

  var homeHtmlUrl = "snippets/home-snippet.html";
  var menuCategoriesHtmlUrl = "snippets/menu-categories-snippet.html";
  var menuCategoryHtmlUrl = "snippets/menu-category-snippet.html";
  var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json";

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

  function insertProperty(string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string
      .replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  }



  document.addEventListener("DOMContentLoaded", function (event) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      homeHtmlUrl,
      receiveMainContent,
      false);
    });

  function receiveMainContent(homeHtml) {
    insertHtml("#main-content", homeHtml);
  }



  dc.loadMenuCategories = function () {
    showLoading("#main-content");

    $ajaxUtils.sendGetRequest(
      menuCategoriesHtmlUrl,
      receiveMenuCategories,
      false
    );

  };

  function receiveMenuCategories(menuCategoriesHtml) {
    $ajaxUtils.sendGetRequest(
      menuCategoryHtmlUrl,
      receiveMenuCategory,
      false
    );

    function receiveMenuCategory(menuCategoryHtml) {
      console.log("Receiving menu category.");

      $ajaxUtils.sendGetRequest(
        allCategoriesUrl,
        receiveCategoriesArray,
        true
      );

      function receiveCategoriesArray(categoriesArray) {
        console.log("Categories array: " + categoriesArray);

        menuCategoriesHtml += '<div id="categories-container" class="row">';

        for (var i = 0; i < categoriesArray.length; i++) {
          console.log("Name " + i + ": " + shortName);
          var shortName = categoriesArray[i].short_name;
          var populatedCategoryHtml = insertProperty(menuCategoryHtml, 'short_name', shortName);
          menuCategoriesHtml += populatedCategoryHtml;
        }

        menuCategoriesHtml += '</div>';

        insertHtml("#main-content", menuCategoriesHtml);
      }
    }
  }

  global.$dc = dc;

})(window);