"use strict";
const productContainer = document.querySelector(".product__list");




async function getProductJson() {
  try {
    const response = await fetch("http://localhost:3000/products");
    const json = await response.json();
    return json;
    // Handle errors
  } catch {
    console.log(error)
  }
}



function renderVariants(option) {
  const variant = `<option value="${option}">${option}</option>`
  return variant;
}


function renderProducts(product) {
  const html = `
        <div class="product">
          <!-- product image -->
          <div class="product__image__container mb-2">
            <img src= "${
              product.imageUrl
            }" alt="Product Image" class="product__image" >
          </div>

          <p class="product__name">${product.name}</p>

          <div class="product__info">
            <p class="product__stock__icon ${
              product.stock > 0 ? "product--instock" : "product--soldout"
            }"></p>
              
            <p class="product__stock__note mr-3">${
              product.stock > 0 ? "In Stock" : "Sold Out"
            }</p>
              
            <p class="product__price">₦${product.price}</p>
          </div>

          <div class="product__options">
            <div class="product__quantity__container">
              <form id="product__quantity__form" class="product__quantity__form" action='#'>
                <input type="button" value="-" class="product__quantity--decrement"/>
                <input type="text" name="product__quantity__value" value='1' class="product__quantity__value"/>
                <input type="button" value="+" class="product__quantity--increment"/>
              </form>
            </div>

            <div class="product__variant">
              <select name="product__color" class="product__color">
                  ${product.variant.map((option) =>
                    renderVariants(option)
                  )}               
              </select>
            </div>
          </div>

          <div class="product__actions">
            <button class="btn__add-favorite">
                <img src="images/add-favorite.png">
            </button>
            <button class="btn__add-cart">
                <img src="images/add-cart.png" alt="">
            </button>
            <button class="btn__buy">
                Buy
            </button>
          </div>
        </div>
      `;
    productContainer.insertAdjacentHTML("beforeend", html);
  };


async function displayProducts() {
  const data = await getProductJson();
  data.forEach((product) => renderProducts(product))
}

displayProducts();