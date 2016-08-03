$(document).ready(function() {
  let select = document.querySelector('select');

  // Returns a promise of an XHR request
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

  // Loads the categories
  // Calls populateCategories() that then makes
  // a request to load the product types
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
  // Returns an object containing product types
  function filterByCategory(products) {
    let select = document.querySelector('select');
    var filteredProducts = {};

    // Filter all of the products down to the selected category
    // in the <select> tag
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

    // This should only log Tea product types OR Coffee product types.
    // It should never log both.
    console.log(`${select.value} types:`, selectedProducts);

    // Uses the array selectedProducts to create an object like so:
    // filteredProducts = {
    //   0: { name: "", description: "", products: [] },
    //   1: ...
    // }
    selectedProducts.forEach((productType, index) => {
      filteredProducts[index] = {
        id: productType.id,
        name: productType.name,
        description: productType.description,
        products: []
      };
    });

    // Logs the newly formatted object
    // Uncomment this line to see its structure
    // console.log(filteredProducts);

    // Return the object containing the products
    // filtered by the selected category
    return filteredProducts;
  }

  // Loads the products.json file and
  // filters the products by type
  function loadProducts(types) {
    loadJSON('products.json')
      .then(response => {
        var productsObj = filterByType(types, response.products);
        console.log(products);
        addProductsToDom(productsObj);
      });
  }

  /**
   * Adds the correct products to the filtered types object and returns it
   * @param {Object} types    An object formatted by filterByCategory()
   * @param {Array}  products An array of every product
   * @return The filtered-by-category object with added products
   **/
  function filterByType(types, products) {
    products.forEach((product) => {
      // ONLY Coffee OR Tea can be selected. Never both.
      for (type in types) {
        // If that product type is found
        if (types[type].id === product.type) {
          // Add that product
          // console.log(`Pushed ${product.name}`);
          types[type].products.push(product);
        }
      }
    });

    return types;
  }

  // Takes the filtered productsObj and appends them to the DOM
  // Each product type becomes a new row in the DOM
  // Each row contains products by type
  function addProductsToDom(productsObj) {

  }

  loadCategories();

});
