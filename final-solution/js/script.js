$(function () {

  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });

  $("#navbarToggle").click(function (event) {
    $(event.target).focus();
  });
});

(function (global) {

  var dc = {};

  var homeHtmlUrl = "snippets/home-snippet.html";
  var menuCategoriesHtmlUrl = "snippets/menu-categories-snippet.html";
  var menuCategoryHtmlUrl = "snippets/menu-category-snippet.html";
  var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json";
  var menuItemsHtmlUrl = "snippets/menu-items-snippet.html";
  var menuItemHtmlUrl = "snippets/menu-item-snippet.html";
  var menuItemsUrl = "https://davids-restaurant.herokuapp.com/menu_items.json?category=";

  function insertHtml(selector, html) {
    var targetElement = document.querySelector(selector);
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



  var switchMenuToActive = function () {
    // Remove 'active' from home button
    var classes = document.querySelector("#navHomeButton").className;
    classes = classes.replace(new RegExp("active", "g"), "");
    document.querySelector("#navHomeButton").className = classes;

    // Add 'active' to menu button if not already there
    classes = document.querySelector("#navMenuButton").className;
    if (classes.indexOf("active") == -1) {
      classes += " active";
      document.querySelector("#navMenuButton").className = classes;
    }
  }

  dc.loadMenuCategories = function () {
    switchMenuToActive();
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
      $ajaxUtils.sendGetRequest(
        allCategoriesUrl,
        receiveCategoriesArray,
        true
      );

      function receiveCategoriesArray(categoriesArray) {

        menuCategoriesHtml += '<div id="categories-container" class="row">';

        for (var i = 0; i < categoriesArray.length; i++) {

          var shortName = categoriesArray[i].short_name;
          var name = categoriesArray[i].name;

          var populatedCategoryHtml = insertProperty(menuCategoryHtml, 'short_name', shortName);
          var populatedCategoryHtml = insertProperty(populatedCategoryHtml, 'name', name);
          
          menuCategoriesHtml += populatedCategoryHtml;
        }

        menuCategoriesHtml += '</div>';

        insertHtml("#main-content", menuCategoriesHtml);
      }
    }
  }







dc.loadMenuItems = function (shortName) {
    showLoading("#main-content");

    $ajaxUtils.sendGetRequest(
      menuItemsHtmlUrl,
      receiveMenuItems,
      false
    );

    function receiveMenuItems(menuItemsHtml) {
      $ajaxUtils.sendGetRequest(
        menuItemHtmlUrl,
        receiveMenuItem,
        false
      );

      function receiveMenuItem(menuItemHtml) {
        $ajaxUtils.sendGetRequest(
          menuItemsUrl + shortName,
          receiveItemsArray,
          true
        );

        function receiveItemsArray(itemsArrayContainer) {
          menuItemsHtml += '<div id="menu-items-container" class="row">';

          var categoryShortName = itemsArrayContainer.category.short_name;
          var categoryName = itemsArrayContainer.category.name;
          var specialInstructions = itemsArrayContainer.category.special_instructions;

          menuItemsHtml = insertProperty(menuItemsHtml, 'category_name', categoryName);
          menuItemsHtml = insertProperty(menuItemsHtml, 'special_instructions', specialInstructions);

          var itemsArray = itemsArrayContainer.menu_items;

          for (var i = 0; i < itemsArray.length; i++) {
            var shortName = itemsArray[i].short_name;
            
            var itemName = itemsArray[i].name;
            var itemShortName = itemsArray[i].short_name;
            var description = itemsArray[i].description;
            var price = itemsArray[i].price_large;

            var populatedItemHtml = insertProperty(menuItemHtml, 'item_short_name', itemShortName);
            populatedItemHtml = insertProperty(populatedItemHtml, 'item_name', itemName);
            populatedItemHtml = insertProperty(populatedItemHtml, 'category_short_name', categoryShortName);
            populatedItemHtml = insertProperty(populatedItemHtml, 'description', description);
            populatedItemHtml = insertProperty(populatedItemHtml, 'price', price);
            
            menuItemsHtml += populatedItemHtml;

            if (i % 2 != 0) {
              menuItemsHtml += "<div class='clearfix visible-lg-block visible-md-block'></div>";
            }
          }

          menuItemsHtml += '</div>';

          insertHtml("#main-content", menuItemsHtml);
        }
      }
    }
  };


  global.$dc = dc;

})(window);