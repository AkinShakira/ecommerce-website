"use strict";
// ELEMENT SELECTION
const productContainer = document.querySelector(".product__list");
const cartPage = document.querySelector('.cart__page');
const cartPageContent = document.querySelector(".cart__page__content ");
const cartPageEmpty = document.querySelector(".cart__page__empty");
const overlay = document.querySelector(".overlay");
const cartItemsContainer = document.querySelector(".cart__items")
const cartTotal = document.querySelector(".cart__total__value")
const cartSubotal = document.querySelector(".cart__subtotal__value")
let cartShippingValue = document.querySelector(".cart__shipping__value")
const shippingPrice = document.querySelector(".shipping__selector")


// BUTTONS SELECTION
const btnAddToCart =document.querySelector(".btn__add-cart")
const btnAddToFavorites =document.querySelector(".btn__add-favorite")
const btnDisplayCart = document.querySelector(".btn__cart")
const btnDisplayFavorites = document.querySelector(".btn__favorite")
const btnCloseCart = document.querySelector(".btn__cart--close")




// FUNCTIONS
function renderVariants(option) {
  const variant = `<option value="${option}">${option}</option>`
  return variant;
}


function renderProducts(product) {
  const html = `
        <div class="product" data-image="${product.imageUrl}" data-name="${product.name}" data-stock="${product.stock}" data-price="${
    product.price
  }" data-color="" data-quantity="">
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
              
            <p class="product__stock__note mr-4">${
              product.stock > 0 ? "In Stock" : "Sold Out"
            }</p>
              
            <p class="product__price">${new Intl.NumberFormat("en-Ng", {style: "currency", currency:"NGN"}).format(product.price)}</p>
          </div>

          <div class="product__options">
            <div class="product__quantity__container">
              <form id="product__quantity__form" class="product__quantity__form" action='#'>
                <input type="button" value="-" class="product__quantity--decrement"/>
                <input type="text" name="product__quantity__value" value='${
                  product.stock > 0 ? "1" : "0"
                }' class="product__quantity__value"/>
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

async function getProductJson() {
  try {
    const response = await fetch("http://localhost:3000/products");
    const json = await response.json();
    return json;
    // Handle errors
  } catch {
    console.log(error);
  }
}

async function displayProducts() {
  try {
    const data = await getProductJson();
    data.forEach((product) => renderProducts(product));
  }
  catch (err) {
    console.log(err)
  }
}


function pathQuantityChange(event) {
  const parentEl = event.path[1];
  const productEl = event.path[4];
  const productStockEl = productEl.children[2].children[0];
  const productStock = Number(productEl.dataset.stock);
  const productQtyEl = parentEl.children[1];

  return {parentEl, productEl, productStockEl, productStock, productQtyEl}
}


function btnIncreaseQtyHandler(event) {
  if (event.target.className === "product__quantity--increment") {
    const { productQtyEl, productStock } = pathQuantityChange(event);
    let productQty = Number(productQtyEl.value);
    if (productQty < productStock) {
      productQty ++;
      productQtyEl.value = productQty;
    } else {
      return
    }
  }
}

function btnDecreaseQtyHandler(event) {
  if (event.target.className === "product__quantity--decrement") {
    const { productQtyEl } = pathQuantityChange(event);

    let productQty = Number(productQtyEl.value);
    if (productQty > 0) {
      productQty --;
      productQtyEl.value = productQty;
    } else {
      return
    }
  }  
}

function validateQtyInput(event) {
  if (event.target.className === "product__quantity__value") {
    const { parentEl, productStock } = pathQuantityChange(event);
    if (event.target.value < 0) {
      parentEl.classList.add('quantity--invalid')
    } else if (event.target.value > productStock) {
      parentEl.classList.add('quantity--invalid')
    }
    else {
      parentEl.classList.remove('quantity--invalid')
    }
  }
}


function pathCart(event) {
  const productEl = event.path[3];
  const productImgSrc = productEl.dataset.image;
  const productName = productEl.dataset.name;
  const productPrice = productEl.dataset.price;

  return {productEl, productImgSrc, productName, productPrice}
}


function renderCartProduct(event) {
  const {
    productEl,
    productImgSrc,
    productName,
    productPrice,
  } = pathCart(event);
  
  const selectedProductQty = productEl.querySelector(
    ".product__quantity__value"
  ).value;
  const selectedProductColor = productEl.querySelector(".product__color").value;
  productEl.dataset.quantity = selectedProductQty;
  productEl.dataset.color = selectedProductColor;
  
  const html = `<div class="cart__item">
            <div class="cart__item__image">
              <img src="${productImgSrc}" alt="Product image">
            </div>

            <div class="cart__content">
              <p class="cart__item__name order-1">${productName}</p>

              <div class="product__quantity__container order-6">
                <form id="product__quantity__form" class="product__quantity__form" action='#'>
                  <input type="button" value="-" class="product__quantity--decrement"/>
                  <input type="number" name="product__quantity__value" min="0" value='${selectedProductQty}' class="product__quantity__value"/>
                  <input type="button" value="+" class="product__quantity--increment"/>
                </form>
              </div>

              <div class="product__variant order-4">
                <select name="product__color" class="product__color">
                  <option value="gold">Gold</option>              
                  <option value="rosegold">Rosegold</option>              
                </select>
              </div>

              <p class="cart__item__price order-3">${new Intl.NumberFormat(
                "en-Ng",
                { style: "currency", currency: "NGN" }
              ).format(productPrice)} <span class="note">each</span></p>

              <p class="cart__item__subtotal order-5" data-subtotal="${
                productPrice * selectedProductQty
              }" >${new Intl.NumberFormat("en-Ng", {
    style: "currency",
    currency: "NGN",
  }).format(
    productPrice * selectedProductQty
  )} <span class="note">Subtotal</span></p>

              <button class="btn__cart--remove-item order-2">X</button>

            </div>
          </div>`;
  
  cartItemsContainer.insertAdjacentHTML("beforeend", html);

}

function getShippingPrice() {
  cartShippingValue.textContent = `${new Intl.NumberFormat("en-Ng", {
    style: "currency",
    currency: "NGN",
  }).format(shippingPrice.value)}`;
  return shippingPrice.value;
}

function calcCartTotal() {
  const cartItems = Array.from(
    document.querySelectorAll(".cart__item__subtotal")
  );

  const shipping = getShippingPrice();

  const subtotal = cartItems
    .map(function (item) {
      return +item.dataset.subtotal;
    })
    .reduce(function (subtotal, acc) {
      return acc + subtotal;
    }, 0);

  cartSubotal.textContent = `${new Intl.NumberFormat("en-Ng", {
    style: "currency",
    currency: "NGN",
  }).format(subtotal)}`;

  cartTotal.textContent = `${new Intl.NumberFormat("en-Ng", {
    style: "currency",
    currency: "NGN",
  }).format(subtotal + Number(shipping))}`;
}

function btnAddToCartHandler(event) {
  if (event.path[1].className === "btn__add-cart") {
    renderCartProduct(event)
  }
}

function center(page) {
  page.style.top = `${window.scrollY}px`;
}


function btnDisplayCartHandler() {
  // cartPage.style.display = "block";
console.log(cartItemsContainer.childElementCount);
  if (cartItemsContainer.childElementCount >= 1) {
    center(cartPage);
    cartPage.style.display = "block";
    cartPageContent.style.display = "flex";
    calcCartTotal();
  } else {
    center(cartPageEmpty);
    cartPageEmpty.style.display = "flex";
  }
}


function closeAllOverlay(){
  cartPage.style.display = "none"
  cartPageContent.style.display = "none"
  cartPageEmpty.style.display = "none"
}




// EVENT LISTENERS
productContainer.addEventListener("click", function (event) {
  btnIncreaseQtyHandler(event);
});
productContainer.addEventListener("click", function (event) {
  btnDecreaseQtyHandler(event);
});
productContainer.addEventListener("input", function (event) {
  validateQtyInput(event);
});
// 
productContainer.addEventListener("click", function (event) {
  btnAddToCartHandler(event);
});
shippingPrice.addEventListener("input", calcCartTotal)

// 
btnDisplayCart.addEventListener("click", btnDisplayCartHandler)
btnCloseCart.addEventListener("click", closeAllOverlay)
// overlay.addEventListener("click", closeAllOverlay)




// STARTING CONDITIONS
displayProducts();




// <div class="cart__item">
//             <div class="cart__item__image">
//               <img src="" alt="">
//             </div>

//             <p class="cart__item__name"> </p>

//             <div class="product__quantity__container">
//               <form id="product__quantity__form" class="product__quantity__form" action='#'>
//                 <input type="button" value="-" class="product__quantity--decrement"/>
//                 <input type="number" name="product__quantity__value" min="0" value='${
//                   product.stock > 0 ? "1" : "0"
//                 }' class="product__quantity__value"/>
//                 <input type="button" value="+" class="product__quantity--increment"/>
//               </form>
//             </div>

//             <div class="product__variant">
//               <select name="product__color" class="product__color">
//                   ${product.variant.map((option) =>
//                     renderVariants(option)
//                   )}
//               </select>
//             </div>

//             <button class="btn__cart--remove-item"></button>

//             <p class="cart__item__price">₦${product.price}</p>

//           </div>



// const imageLoader = function (entries, observer) {
//   const [entry] = entries;

//   if (!entry.isIntersecting) return;
//   entry.target.src = entry.target.dataset.src;
//   entry.target.addEventListener("load", function () {
//     entry.target.classList.remove("lazy-img");
//   });
//   observer.unobserve(entry.target);
// };



// const imageObsOptions = {
//   root: null,
//   threshold: 0,
//   rootMargin: "200px",
// };

// const imageObserver = new IntersectionObserver(imageLoader, imageObsOptions);
// featuresImages.forEach((image) => imageObserver.observe(image));