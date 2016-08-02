$(document).ready(function() {
  let select = document.querySelector('select');

  function loadJSON(url) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.onload = () => {
        // If the request response is valid
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        }
        // If the request is invalid
        else {
          console.log(xhr.status);
          reject(xhr.statusText);
        }
      };

      xhr.send();
    });
  }

  function loadCategories() {
    loadJSON('categories.json')
      .then(response => {
         populateCategories(response.categories);
         loadProductTypes();
      });
  }

  // Appends <option> tags to the <select>
  // after categories have loaded
  function populateCategories(categories) {
    categories.forEach(category => {
      select.innerHTML += `
        <option value="${category.name}">${category.name}</option>
      `;
    });
  }

  // Adds an event listener to the <select> and loads
  // the appropriate product list
  function loadProductTypes() {
    select.addEventListener('change', e => {
      loadJSON('types.json')
        .then(response => {
           let selectedProducts = filterByCategory(response.types);
           loadProducts(selectedProducts);
        });
    });
  }

  // Filters the product types by the selected category
  // in the <select> box
  // Returns an array of product types
  function filterByCategory(products) {
    let select = document.querySelector('select');
    var filteredProducts = {};
    let selectedProducts = products.filter((product) => {
      // Filter by Coffee
      if (select.value === "Coffee") {
        return product.category === 0;
      }
      // Filter by Tea
      else if (select.value === "Tea") {
        return product.category === 1;
      }
    });

    console.log(`${select.value} products:`, selectedProducts);

    selectedProducts.forEach((productType, index) => {
      filteredProducts[index] = {
        name: productType.name,
        description: productType.description,
        products: []
      };
    });

    console.log(filteredProducts);

    return filteredProducts;
  }

  // Loads the products.json file and
  // appends the appropriate products
  // to the DOM.
  function loadProducts(types) {
    loadJSON('products.json')
      .then(response => {
        console.log(response);
        filterByType(response.products);
      });
  };

  function filterByType(products) {
  };

  loadCategories();

});
