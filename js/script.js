"use strict";
// ELEMENT SELECTION
const app = document.querySelector('.app')
const productContainer = document.querySelector(".product__list");
const cartCount = document.querySelector('.cart__count');
const cartPage = document.querySelector('.cart__page');
const cartPageContent = document.querySelector(".cart__page__content ");
// const orderSummary = document.querySelector(".order__summary")
const cartPageEmpty = document.querySelector(".cart__page__empty");
const overlay = document.querySelector(".overlay");
const cartItemsContainer = document.querySelector(".cart__items");
const cartTotal = document.querySelector(".cart__total__value");
const cartSubotal = document.querySelector(".cart__subtotal__value");
const cartShippingValue = document.querySelector(".cart__shipping__value");
const shippingPrice = document.querySelector(".shipping__selector");
const reviewSlides = document.querySelectorAll(".slide");
const checkoutPage = document.querySelector(".checkout__page");



// BUTTONS SELECTION
const btnAddToCart =document.querySelector(".btn__add-cart")
const btnAddToFavorites =document.querySelector(".btn__add-favorite")
const btnDisplayCart = document.querySelector(".btn__cart")
const btnCheckout = document.querySelector(".btn__checkout")
// const btnDisplayFavorites = document.querySelector(".btn__favorite")
const btnClearCart = document.querySelector(".btn__cart--clear");
const btnCloseCart = document.querySelector(".btn__cart--close")
const btnPrevSlide = document.querySelector(".slider__btn--left");
const btnNextSlide = document.querySelector(".slider__btn--right");




// STARTING CONDITIONS
displayProducts();
renderCartStorage();
goToSlide(0);



// FUNCTIONS
// // //  //
// PRODUCT RENDERING FUNTIONS

function renderVariants(option) {
  const variant = `<option value="${option}">${option}</option>`
  return variant;
}


function renderProducts(product) {
  const html = `
        <div class="product" data-id="${product.productID}" data-image="${
    product.imageUrl
  }" data-name="${product.name}" data-stock="${product.stock}" data-price="${
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
              
            <p class="product__price">${new Intl.NumberFormat("en-Ng", {
              style: "currency",
              currency: "NGN",
            }).format(product.price)}</p>
          </div>

          <div class="product__options">
            <div class="product__quantity__container" id="${
              product.stock > 0 ? "" : "action--disabled"
            }">
              <form id="product__quantity__form" class="product__quantity__form" action="#">
                <input type="button" value="-" class="product__quantity--decrement" id="${
                  product.stock > 0 ? "" : "action--disabled"
                }"/>
                <input type="text" name="product__quantity__value" value="${
                  product.stock > 0 ? 1 : 0
                }" class="product__quantity__value" id="${
    product.stock > 0 ? "" : "action--disabled"
  }"/>
                <input type="button" value="+" class="product__quantity--increment" id="${
                  product.stock > 0 ? "" : "action--disabled"
                }"/>
              </form>
            </div>

            <div class="product__variant" >
              <select name="product__color" class="product__color" id="${
                product.stock > 0 ? "" : "action--disabled"
              }">
                  ${product.variant.map((option) =>
                    renderVariants(option)
                  )}               
              </select>
            </div>
          </div>

          <div class="product__actions" id="${
            product.stock > 0 ? "" : "action--disabled"
          }">
            <button class="btn__add-cart">
              <img src="images/add-to-cart.png" alt="Add To Cart">
              <span> Add To Bag </span>
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



// // //  //
// PRODUCT DISPLAY FUNTIONS
async function displayProducts() {
  try {
    const data = await getProductJson();
    data.forEach((product) => renderProducts(product));
  }
  catch (err) {
    console.log(err)
  }
}

// // //  //
// PRODUCT OPTION FUNCTIONS
function pathQuantityChange(event) {
  const parentEl = event.path[1];
  const productEl = event.path[4];
  const productStock = Number(productEl.dataset.stock);
  const productQtyEl = parentEl.querySelector(".product__quantity__value");

  return {parentEl, productEl, productStock, productQtyEl}
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

function changeQtyAttr(event) {
  if (
    event.target.className === "product__quantity--decrement" ||
    event.target.className === "product__quantity--increment"
  ) {
    const { productEl, productQtyEl } = pathQuantityChange(event);
    let productQty = Number(productQtyEl.value);
    productEl.dataset.quantity = productQty;
    return true;
  } else {
    return false;
  }
}

function changeColorAttribute(event) {
  if (event.target.className === "product__color") {
    let product = event.path[3];
    product.dataset.color = event.target.value;
  }
}



// MISC CART FUNCTIONS
function displayCartCount() {
  if (cartItemsContainer.childElementCount >= 1) {
    cartCount.style.display = "block";
    cartCount.textContent = cartItemsContainer.childElementCount;
  } else {
    cartCount.style.display = "none";
  }
}


function pathProductToCart(event) {
  const productEl = event.target.closest(".product");
  const productId = Number(productEl.dataset.id);
  const productImgSrc = productEl.dataset.image;
  const productName = productEl.dataset.name;
  const productPrice = productEl.dataset.price;
  const productStock = productEl.dataset.stock;
  const productColor = productEl.dataset.color;
  return {
    productEl,
    productId,
    productImgSrc,
    productName,
    productPrice,
    productStock,
    productColor
  };
}


function pathInCart(event) {
  const cartItem = event.target.closest(".cart__item");
  const cartId = Number(cartItem.dataset.id);
  const cartItemImgSrc = cartItem.dataset.image;
  const cartItemName = cartItem.dataset.name;
  const cartItemPrice = cartItem.dataset.price;
  const cartItemStock = cartItem.dataset.stock;
  const cartItemColor = cartItem.dataset.color;
  const cartItemQty = cartItem.dataset.quantity;

  return {
    cartItem,
    cartId,
    cartItemImgSrc,
    cartItemName,
    cartItemPrice,
    cartItemStock,
    cartItemColor,
    cartItemQty
  };
}


// // //  //
// ADD TO CART FUNCTIONS

function checkIdPresent(event) {
  const { productId } = pathProductToCart(event);
  const cartArray = Array.from(cartItemsContainer.children);
  const cartIDs = cartArray.map((item) => Number(item.dataset.id));
  const idPresent = cartIDs.includes(productId);
  return idPresent;
}

// // FIX: check if cart has same variant
// function checkIdPresent(event) {
//   const { productId, productColor } = pathProductToCart(event);
//   const cartIDs = cartArray.map((item) => Number(item.dataset.id));
//   const idPresent = cartIDs.includes(productId);
//   return idPresent;
// }

// function checkColorPresent(event) {
//   const { productColor } = pathProductToCart(event);
//   const cartIs = cartArray.map((item) => Number(item.dataset.id));
//   const idPresent = cartIDs.includes(productId);
// }

function noQuantitySelected(event) {
  const { productEl } = pathProductToCart(event);
  const selectedProductQty = productEl.querySelector(
    ".product__quantity__value"
  ).value;
  if (Number(selectedProductQty) === 0) {
    return true;
  } else {
    return false;
  }
}

function outOfStock(event) {
  const { productStock } = pathProductToCart(event);
  if (Number(productStock) === 0) {
    return true;
  } else {
    return false;
  }
}

function btnAddToCartHandler(event) {
  if (event.target.className === "btn__add-cart") {
    const idPresent = checkIdPresent(event);
    const QuantitySelected = noQuantitySelected(event);
    const stockOut = outOfStock(event);

    if (
      idPresent === false &&
      QuantitySelected === false &&
      stockOut === false
    ) {
      const cartItem = renderCartProduct(event);
      displayCartCount();
      addCartItemLocalStorage(event, cartItem)
    }
  } else {
    return;
  }
}




// // //  //
// CART AND CONTENT RENDERING FUNCTIONS

function createCartItemHtml(id, name, stock, price, color, quantity, img) {
  const html = `<div class="cart__item" data-id="${id}" data-name="${name}" data-stock="${stock}" data-price="${price}" data-color="${color}" data-quantity="${quantity}" data-image="${img}">
            <div class="cart__item__image">
              <img src="${img}" alt="Product image">
            </div>

            <div class="cart__content">
              <p class="cart__item__name order-1">${name}</p>

              <div class="product__quantity__container order-6">
                <form id="product__quantity__form" class="product__quantity__form" action='#'>
                  <input type="button" value="-" class="product__quantity--decrement"/>
                  <input type="text" name="product__quantity__value" value='${quantity}' class="product__quantity__value" disabled/>
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
              ).format(price)} <span class="note">each</span></p>

              <p class="cart__item__subtotal order-5" data-subtotal="${
                price * quantity
              }" > <span class="cart__item__subtotal__value">${new Intl.NumberFormat(
    "en-Ng",
    {
      style: "currency",
      currency: "NGN",
    }
  ).format(
    price * quantity
  )} </span> <span class="note">Subtotal</span></p>

              <button class="btn__cart--remove-item order-2">X</button>

            </div>
          </div>`;

  return html;
}

function renderCartProduct(event) {
  const {
    productEl,
    productId,
    productImgSrc,
    productName,
    productPrice,
    productStock
  } = pathProductToCart(event);

  const selectedProductQty = productEl.querySelector(
    ".product__quantity__value"
  ).value;
  const selectedProductColor = productEl.querySelector(".product__color").value;
  productEl.dataset.quantity = selectedProductQty;
  productEl.dataset.color = selectedProductColor;
  
  const html = createCartItemHtml(productId, productName, productStock, productPrice, selectedProductColor, selectedProductQty, productImgSrc);
  cartItemsContainer.insertAdjacentHTML("beforeend", html);
  return html;
}

function getShippingPrice() {
  cartShippingValue.textContent = `${new Intl.NumberFormat("en-Ng", {
    style: "currency",
    currency: "NGN",
  }).format(shippingPrice.value)}`;
  return shippingPrice.value;
}

function calcItemSubtotal () {
  const cartItems = Array.from(
    document.querySelectorAll(".cart__item")
  );
  cartItems.forEach(function (item) {
    const itemQty = item.dataset.quantity;
    const itemPrice = item.dataset.price;
    const itemSubtotal = itemQty * itemPrice;
    const itemSubtotalEl = item.querySelector(".cart__item__subtotal");
    itemSubtotalEl.dataset.subtotal = itemSubtotal;
    const cartItemSubtotalValue = item.querySelector(
      ".cart__item__subtotal__value"
    );
    cartItemSubtotalValue.textContent = new Intl.NumberFormat(
                "en-Ng", { style: "currency", currency: "NGN" }).format(itemSubtotal)
  })
}

function calcCartTotal() {
  const cartItemsSubtotal = Array.from(
    document.querySelectorAll(".cart__item__subtotal")
  );

  const shipping = getShippingPrice();

  const subtotal = cartItemsSubtotal
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


// // //  //
// CART DISPLAY FUNCTIONS

function center(page) {
  const scrollValue = window.scrollY;
  const halfWindowHeight = window.innerHeight / 2;
  console.log(halfWindowHeight)
  page.style.top = `${scrollValue + halfWindowHeight}px`;
  page.style.transform = "translate(-50%, -50%)"
}

function btnDisplayCartHandler() {
  // FIX: PAGE SCROLL
  // cartPage.style.display = "block";
  // app.style.overflow = "hidden";

  displayOverlay();
  center(cartPage);
  cartPage.style.display = "block";

  if (cartItemsContainer.childElementCount >= 1) {
    cartPageContent.style.display = "flex";
    calcCartTotal();
  } else {
    cartPageEmpty.style.display = "flex";
  }
}


// CART ACTIONS
function deleteCartItem(event) {
  if (event.target.className === "btn__cart--remove-item order-2") {
    const {cartItem} = pathInCart(event)

    cartItem.remove();
    delCartItemLocalStorage(event);
    calcItemSubtotal();
    calcCartTotal();
    displayCartCount();
  }
}

function clearCart() {
  const itemsContainer = Array.from(cartItemsContainer.children);
  itemsContainer.forEach(function (item) {
    item.remove();
  })
  calcItemSubtotal();
  calcCartTotal();
  displayCartCount();
  localStorage.clear();
}
  

// CART STORAGE FUNCTIONS
// USED THE PRODUCT TO CART PATH HERE BECAUSE THIS ACTION ACTUALLY HAPPENS ON THE PRODUCT PAGE BEFORE THE ITEM IS IN CART
function addCartItemLocalStorage(event, item) {
  const { productId } = pathProductToCart(event);
  localStorage.setItem(`${productId}`, item);
}

// USED THE IN CART PATH BECAUSE THE ITEM IS IN CART NOW AND THE ACTION OCCURS IN THE CART 
function delCartItemLocalStorage(event) {
  const { cartId } = pathInCart(event);
  localStorage.removeItem(`${cartId}`);
}

// THIS WILL RENDER THE LOCALLY STORED CART ITEMS IN THE UI
function renderCartStorage() {
  const cartStorage = Object.values(localStorage);
  cartStorage.forEach(function (item) {
    cartItemsContainer.insertAdjacentHTML("beforeend", item)
  })
  displayCartCount();
}

// THIS WILL UPDATE THE STORED CART ITEMS UPON CHANGES TO QUANTITY AND VARIANT IN THE CART
function updateCartStorage(event) {
  const update = changeQtyAttr(event);
  const { cartItem,
    cartId,
    cartItemImgSrc,
    cartItemName,
    cartItemPrice,
    cartItemStock,
    cartItemColor,
    cartItemQty } = pathInCart(event);
  
  if (update === true) {
  const updatedItem = createCartItemHtml(cartId, cartItemName, cartItemStock, cartItemPrice, cartItemColor, cartItemQty, cartItemImgSrc)    
    localStorage.setItem(`${cartId}`, updatedItem);
  } else {
    return;
  }
}



// CHECKOUT
function displayCheckoutPage() {
  displayOverlay();
  center(checkoutPage)
  checkoutPage.style.display = "block";
}



// // //  //
// MODAL FUNCTIONS
function displayOverlay () {
  overlay.classList.remove("hidden")
}

function hideOverlay () {
  overlay.classList.add("hidden")
}


function closeModals() {
  cartPage.style.display = "none";
  cartPageContent.style.display = "none";
  cartPageEmpty.style.display = "none";
  checkoutPage.style.display = "none";
  hideOverlay();
}



// SLIDER FUNCTIONS
let curSlide = 0;
const maxSlides = reviewSlides.length;

function goToSlide(slide) {
  reviewSlides.forEach(function (s, i) {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
}

goToSlide(0);

// MOVE TO NEXT SLIDE ON THE RIGHT
function nextSlide() {
  if (curSlide === maxSlides - 1) {
    curSlide = 0;
  } else curSlide++;

  goToSlide(curSlide);
}

// MOVE TO PREVIOUS SLIDE ON THE LEFT
function prevSlide() {
if (curSlide === 0) {
  curSlide = maxSlides - 1;
  } else curSlide--;

  goToSlide(curSlide);
}









// EVENT LISTENERS
// HOME/PRODUCT PAGE
productContainer.addEventListener("click", function (event) {
  btnIncreaseQtyHandler(event);
  btnDecreaseQtyHandler(event);
  btnAddToCartHandler(event);
  changeQtyAttr(event);
});

productContainer.addEventListener("input", function (event) {
  validateQtyInput(event)
  changeColorAttribute(event);
});

btnPrevSlide.addEventListener("click", prevSlide);
btnNextSlide.addEventListener("click", nextSlide);

// USING THE KEYBOARD TO NAV THE SLIDER
document.addEventListener("keydown", function (e) {
  if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
  if (e.key === "ArrowLeft") prevSlide();
  if (e.key === "ArrowRight") nextSlide();
});



// MODALS
btnDisplayCart.addEventListener("click", btnDisplayCartHandler)
btnCloseCart.addEventListener("click", closeModals)
overlay.addEventListener("click", closeModals)


// CART PAGE
cartItemsContainer.addEventListener("click", function (event) {
  btnIncreaseQtyHandler(event);
  btnDecreaseQtyHandler(event);
  updateCartStorage(event);
});

cartItemsContainer.addEventListener("input", function (event) {
  changeColorAttribute(event);
});

cartPage.addEventListener("click", function (event) {
  calcItemSubtotal();
  calcCartTotal();
  deleteCartItem(event);
});

cartPage.addEventListener("input", function () {
  calcItemSubtotal();
  calcCartTotal();
})

btnClearCart.addEventListener("click", clearCart);

btnCheckout.addEventListener("click", function () {
  closeModals();
  displayCheckoutPage();
})