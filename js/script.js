"use strict";
document.addEventListener("DOMContentLoaded", productsFetch);
initSlider();

function initSlider() {
  const reviewSlides = document.querySelectorAll(".slide");
  const btnPrevSlide = document.querySelector(".slider__btn--left");
  const btnNextSlide = document.querySelector(".slider__btn--right");
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

  btnPrevSlide.addEventListener("click", prevSlide);
  btnNextSlide.addEventListener("click", nextSlide);
  // USING THE KEYBOARD TO NAV THE SLIDER
  document.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  });
}

function convertPriceToLocalCurrency(value) {
  return new Intl.NumberFormat("en-Ng", {
    style: "currency",
    currency: "NGN",
  }).format(value);
}

function renderVariants(option) {
  const variant = `<option value="${option}">${option}</option>`;
  return variant;
}

function productsFetch() {
  const app = document.querySelector(".app");
  const productContainer = document.querySelector(".product__list");

  function generateProductsHTML(id, imageUrl, name, price, stock, variants) {
    const html = `
          <div class="product">
            <div class="product__image__container mb-2">
              <img src= "${imageUrl}" alt="Product Image" class="product__image" >
            </div>

            <p class="product__name">${name}</p>

            <div class="product__info">
              <p class="product__stock__icon ${
                stock > 0 ? "product--instock" : "product--soldout"
              }"></p>
                
              <p class="product__stock__note mr-4">${
                stock > 0 ? "In Stock" : "Sold Out"
              }</p>
                
              <p class="product__price">${convertPriceToLocalCurrency(
                price
              )}</p>
            </div>

            <div class="product__options">
              <div class="product__quantity__container" id="${
                stock > 0 ? "" : "action--disabled"
              }">
                <form id="product__quantity__form" class="product__quantity__form" action="#">
                  <input type="button" value="-" class="product__quantity--decrement" id="${
                    stock > 0 ? "" : "action--disabled"
                  }"/>
                  <input type="text" name="product__quantity__value" value="${
                    stock > 0 ? 1 : 0
                  }" 
                  class="product__quantity__value" id="${
                    stock > 0 ? "" : "action--disabled"
                  }"/>
                  <input type="button" value="+" class="product__quantity--increment" id="${
                    stock > 0 ? "" : "action--disabled"
                  }"/>
                </form>
              </div>

              <div class="product__variant" >
                <select name="product__color" class="product__color" id="${
                  stock > 0 ? "" : "action--disabled"
                }">
                    ${variants.map((option) =>
                      renderVariants(option)
                    )}               
                </select>
              </div>
            </div>

            <div class="product__actions" id="${
              stock > 0 ? "" : "action--disabled"
            }">
              <button class="btn__add-to-cart">
                <img src="images/add-to-cart.png" alt="Add To Cart">
                <span> Add To Bag </span>
              </button>
            </div>
          </div>
        `;

    return { html };
  }

  function setProductDataAtrributes(id, stock) {
    const lastProduct = productContainer.lastElementChild;
    lastProduct.dataset.id = id;
    lastProduct.dataset.stock = stock;
  }

  // FETCH THE PRODUCTS FROM API
  fetch("https://shakiraakinleye.github.io/Data/db.json")
    .then((response) => response.json())
    .then((productsJSON) => {
      const products = productsJSON.products;
      // CREATE A MAP COPY OF PRODUCTS DATA
      const productsDataMap = new Map();
      products.forEach((product) => {
        productsDataMap.set(product.productID, {
          id: product.productID,
          imageUrl: product.imageUrl,
          name: product.name,
          price: product.price,
          stock: product.stock,
          variants: [...product.variant],
        });
      });
      return productsDataMap;
    })
    .then((productsDataMap) => {
      // GENERATE PRODUCTS UI FROM THE DATA COPIED
      productsDataMap.forEach((product) => {
        const { html } = generateProductsHTML(
          product.id,
          product.imageUrl,
          product.name,
          product.price,
          product.stock,
          product.variants
        );
        productContainer.insertAdjacentHTML("beforeend", html);
        setProductDataAtrributes(product.id, product.stock);
      });
      return productsDataMap;
    })
    .then((productsDataMap) => initApp(productsDataMap));
}

function initApp(productsDataMap) {
  // ELEMENTS
  // HOME PAGE
  const body = document.querySelector("body");
  const products = document.querySelectorAll(".product");
  const cartCount = document.querySelector(".cart__count");
  // CART PAGE
  const cartPage = document.querySelector(".cart__page");
  const cartItemsContainer = cartPage.querySelector(".cart__items");
  const cartPageContent = cartPage.querySelector(".cart__page__content ");
  const cartPageEmpty = cartPage.querySelector(".empty__cart");
  const cartTotal = cartPage.querySelector(".cart__total__value");
  const cartSubtotal = cartPage.querySelector(".cart__subtotal__value");
  const cartShippingValue = cartPage.querySelector(".cart__shipping__value");
  const shippingSelector = cartPage.querySelector(".shipping__selector");
  // CHECKOUT PAGE
  const checkoutPage = document.querySelector(".checkout__page");
  const stateSelector = checkoutPage.querySelector(".state");
  const shippingForm = checkoutPage.querySelector(".shipping__form__container");
  const userInputFields = Array.from(shippingForm.querySelectorAll("input"));
  // REVIEW PAGE
  const reviewPage = document.querySelector(".review__page");
  const orderItemsContainer = reviewPage.querySelector(".order__items");
  const reviewSubtotal = reviewPage.querySelector(".review__subtotal__value");
  const reviewShipping = reviewPage.querySelector(".review__shipping__value");
  const reviewTotal = reviewPage.querySelector(".review__total__value");
  const reviewFirstName = reviewPage.querySelector(".first__name");
  const reviewLastName = reviewPage.querySelector(".last__name");
  const reviewEmail = reviewPage.querySelector(".user__email");
  const reviewPhone = reviewPage.querySelector(".user__tel");
  const reviewAddress1 = reviewPage.querySelector(".user__address-1");
  const reviewAddress2 = reviewPage.querySelector(".user__address-2");
  const reviewAddress3 = reviewPage.querySelector(".user__address-3");
  // MODALS
  const overlay = document.querySelector(".overlay");
  const alertModal = document.querySelector(".alert__modal");


  // // //
  // BUTTONS
  const btnDisplayCart = document.querySelector(".btn__cart");
  // CART PAGE
  const btnClearCart = cartPage.querySelector(".btn__cart--clear");
  const btnCloseCart = cartPage.querySelector(".btn__cart--close");
  const btnBackToShop = cartPage.querySelector(".btn__back__to__shop");
  const btnCheckout = cartPage.querySelector(".btn__checkout");
  // CHECKOUT PAGE
  const btnBackToCart = checkoutPage.querySelector(".btn__back__to__cart");
  const btnContinue = checkoutPage.querySelector(".btn__continue");
  // REVIEW PAGE
  const btnEditCart = reviewPage.querySelector(".btn__edit__cart");
  const btnEditUserData = reviewPage.querySelector(".btn__edit__user-data");
  const btnPlaceOrder = reviewPage.querySelector(".btn__place__order");

  // STARTING CONDITIONS
  let cartItems;
  initProductActions();
  initCartEvents();
  renderCartIemsInStorage();
  initCheckout();

  /////////////////

  function center(page) {
    body.style.overflow = "hidden";
    const scrollValue = window.scrollY;
    const halfWindowHeight = window.innerHeight / 2;
    page.style.top = `${scrollValue + halfWindowHeight}px`;
    page.style.transform = "translate(-50%, -50%)";
  }

  function updateAndDisplayCartCount() {
    if (cartItemsContainer.childElementCount > 0) {
      cartCount.style.display = "block";
      cartCount.textContent = cartItemsContainer.childElementCount;
    } else {
      cartCount.style.display = "none";
    }
  }

  function increaseProductQuantity(quantityInput, stock) {
    let productQty = +quantityInput.value;
    if (productQty < stock) {
      productQty++;
      quantityInput.value = productQty;
    } else {
      return;
    }
  }

  function decreaseProductQuantity(quantityInput) {
    let productQty = +quantityInput.value;
    if (productQty > 1) {
      productQty--;
      quantityInput.value = productQty;
    } else {
      return;
    }
  }

  function validateQuantityInput(quantityInput, quantityForm, stock) {
    if (+quantityInput.value < 1) {
      quantityForm.classList.add("quantity--invalid");
    } else if (+quantityInput.value > stock) {
      quantityForm.classList.add("quantity--invalid");
    } else {
      quantityForm.classList.remove("quantity--invalid");
    }
  }

  function changeQuantityDataset(quantityInput, element) {
    if (element.dataset.quantity === quantityInput.value) {
      return false;
    } else {
      element.dataset.quantity = +quantityInput.value;
      return true;
    }
  }

  function changeColorDataset(element, selector) {
    if (element.dataset.color === selector.value) {
      return false;
    } else {
      element.dataset.color = selector.value;
      return true;
    }
  }

  function generateCartItemHTML(
    color,
    imageUrl,
    name,
    price,
    quantity,
    variants
  ) {
    const html = `<div class="cart__item">
              <div class="cart__item__image">
                <img src="${imageUrl}" alt="Product image">
              </div>

              <div class="cart__content">
                <p class="cart__item__name order-1">${name}</p>

                <div class="product__quantity__container order-6">
                  <form id="product__quantity__form" class="product__quantity__form" action='#'>
                    <input type="button" value="-" class="product__quantity--decrement"/>
                    <input type="text" name="product__quantity__value" value='${quantity}' class="product__quantity__value" />
                    <input type="button" value="+" class="product__quantity--increment"/>
                  </form>
                </div>

                <div class="product__variant order-4">
                  <select name="product__color" class="product__color">
                    <option value="${color}">${color}</option> 
                    ${variants
                      .filter((option) => option !== color)
                      .map((option) => renderVariants(option))}               
                  </select>
                </div>

                <p class="cart__item__price order-3">${convertPriceToLocalCurrency(
                  price
                )} <span class="note">each</span></p>

                <p class="cart__item__subtotal order-5" data-subtotal="${
                  price * quantity
                }" > <span class="cart__item__subtotal__value">${convertPriceToLocalCurrency(
      price * quantity
    )} </span> <span class="note">Subtotal</span></p>

                <button class="btn__cart--remove-item order-2">X</button>

              </div>
            </div>`;

    return html;
  }

  function setCartItemDataset(color, id, price, quantity) {
    const latestCartItem = cartItemsContainer.lastElementChild;
    latestCartItem.dataset.color = color;
    latestCartItem.dataset.id = id;
    latestCartItem.dataset.price = price;
    latestCartItem.dataset.quantity = quantity;
    latestCartItem.dataset.subtotal = price * quantity;
    return { latestCartItem };
  }

  function addCartItemToUI(html) {
    cartItemsContainer.insertAdjacentHTML("beforeend", html);
  }

  function addCartItemToLocalStorage(
    color,
    id,
    imageUrl,
    name,
    price,
    quantity
  ) {
    const cartObject = {
      id: id,
      color: color,
      image: imageUrl,
      name: name,
      price: price,
      quantity: quantity,
      subtotal: price * quantity,
    };
    const cartItemJSON = JSON.stringify(cartObject);
    localStorage.setItem(id, cartItemJSON);
  }

  function addItemToCart(color, id, image, name, price, quantity, variants) {
    const html = generateCartItemHTML(
      color,
      image,
      name,
      price,
      quantity,
      variants
    );

    addCartItemToUI(html);

    const { latestCartItem } = setCartItemDataset(color, id, price, quantity);

    addCartItemToLocalStorage(color, id, image, name, price, quantity);

    updateAndDisplayCartCount();

    initCartActions(latestCartItem);
  }

  function checkIdPresentInCart(id) {
    const cartItemsArray = Array.from(cartItemsContainer.children);
    const cartIDs = cartItemsArray.map((item) => +item.dataset.id);
    const idPresent = cartIDs.includes(+id);
    return { idPresent };
  }

  function checkQuantitySelected(quantity) {
    if (+quantity === 0) {
      return true;
    } else {
      return false;
    }
  }

  function getSelectedProductOptions(product) {
    const inputProductQuantity = product.querySelector(
      ".product__quantity__value"
    );
    const productColorSelector = product.querySelector(".product__color");

    const selectedProductQuantity = inputProductQuantity.value;
    const selectedProductColor = productColorSelector.value;
    return { selectedProductQuantity, selectedProductColor };
  }

  function btnAddToCartHandler(product, id, image, name, price, variants) {
    const { selectedProductQuantity, selectedProductColor } =
      getSelectedProductOptions(product);

    const quantity = selectedProductQuantity;
    const color = selectedProductColor;

    const { idPresent } = checkIdPresentInCart(id);
    const noQuantitySelected = checkQuantitySelected(quantity);

    if (idPresent === false && noQuantitySelected === false) {
      addItemToCart(color, id, image, name, price, quantity, variants);
    } else {
      return;
    }
  }

  function initProductActions() {
    products.forEach((product) => {
      const btnIncreaseProductQuantity = product.querySelector(
        ".product__quantity--increment"
      );
      const btnDecreaseProductQuantity = product.querySelector(
        ".product__quantity--decrement"
      );
      const inputProductQuantity = product.querySelector(
        ".product__quantity__value"
      );
      const btnAddToCart = product.querySelector(".btn__add-to-cart");
      const quantityForm = product.querySelector(".product__quantity__form");
      const productColorSelector = product.querySelector(".product__color");

      const productMap = productsDataMap.get(+product.dataset.id);
      const productId = productMap.id;
      const productImage = productMap.imageUrl;
      const productName = productMap.name;
      const productPrice = productMap.price;
      const productStock = productMap.stock;
      const productVariants = productMap.variants;

      btnIncreaseProductQuantity.addEventListener("click", function () {
        increaseProductQuantity(inputProductQuantity, productStock);
        changeQuantityDataset(inputProductQuantity, product);
      });

      btnDecreaseProductQuantity.addEventListener("click", function () {
        decreaseProductQuantity(inputProductQuantity);
        changeQuantityDataset(inputProductQuantity, product);
      });

      inputProductQuantity.addEventListener("input", function (event) {
        validateQuantityInput(inputProductQuantity, quantityForm, productStock);
        changeQuantityDataset(inputProductQuantity, product);
      });

      productColorSelector.addEventListener("change", function () {
        changeColorDataset(product, productColorSelector);
      });

      btnAddToCart.addEventListener("click", function () {
        btnAddToCartHandler(
          product,
          productId,
          productImage,
          productName,
          productPrice,
          productVariants
        );
      });
    });
  }

  // CART CART CART
  function getShippingPrice() {
    const shippingPrice = shippingSelector.value;
    cartShippingValue.textContent = `${convertPriceToLocalCurrency(
      shippingPrice
    )}`;
    cartShippingValue.dataset.value = shippingPrice;
    return shippingPrice;
  }

  function cartCalc() {
    cartItems = Array.from(document.querySelectorAll(".cart__item"));

    function calcCartItemSubtotal(cartItem) {
      const cartItemQuantity = +cartItem.dataset.quantity;
      const cartItemPrice = +cartItem.dataset.price;
      const cartItemSubtotal = cartItemQuantity * cartItemPrice;
      cartItem.dataset.subtotal = cartItemSubtotal;
      return { cartItemSubtotal };
    }

    function calcAndDisplayCartItemSubtotal() {
      cartItems.forEach((cartItem) => {
        const { cartItemSubtotal } = calcCartItemSubtotal(cartItem);
        const cartItemSubtotalValue = cartItem.querySelector(
          ".cart__item__subtotal__value"
        );
        cartItemSubtotalValue.textContent =
          convertPriceToLocalCurrency(cartItemSubtotal);
      });
    }

    // CART SUBTOTAL AND TOTAL
    function calcCartSubtotalAndTotal() {
      const shipping = getShippingPrice();

      const subtotal = cartItems
        .map(function (cartItem) {
          return +cartItem.dataset.subtotal;
        })
        .reduce(function (subtotal, acc) {
          return acc + subtotal;
        }, 0);

      const total = subtotal + Number(shipping);

      cartSubtotal.dataset.value = subtotal;
      cartTotal.dataset.value = total;

      return { subtotal, total };
    }

    function displayCartSubtotalAndTotal() {
      const { subtotal, total } = calcCartSubtotalAndTotal(cartItems);
      cartSubtotal.textContent = `${convertPriceToLocalCurrency(subtotal)}`;
      cartTotal.textContent = `${convertPriceToLocalCurrency(total)}`;
    }

    calcAndDisplayCartItemSubtotal();
    displayCartSubtotalAndTotal();
  }

  function deleteCartItem(id, element) {
    element.remove();
    localStorage.removeItem(id);
    cartCalc();
  }

  function initCartActions(cartItem) {
    const cartItemId = cartItem.dataset.id;
    const btnIncreaseProductQuantity = cartItem.querySelector(
      ".product__quantity--increment"
    );
    const btnDecreaseProductQuantity = cartItem.querySelector(
      ".product__quantity--decrement"
    );
    const inputProductQuantity = cartItem.querySelector(
      ".product__quantity__value"
    );
    const quantityForm = cartItem.querySelector(".product__quantity__form");
    const productColorSelector = cartItem.querySelector(".product__color");
    const btnRemoveCartItem = cartItem.querySelector(".btn__cart--remove-item");

    const productMap = productsDataMap.get(+cartItemId);
    const productStock = productMap.stock;

    btnIncreaseProductQuantity.addEventListener("click", function () {
      increaseProductQuantity(inputProductQuantity, productStock);
      const update = changeQuantityDataset(inputProductQuantity, cartItem);
      cartCalc();
      updateCartStorage(update, cartItem);
    });

    btnDecreaseProductQuantity.addEventListener("click", function () {
      decreaseProductQuantity(inputProductQuantity);
      const update = changeQuantityDataset(inputProductQuantity, cartItem);
      cartCalc();
      updateCartStorage(update, cartItem);
    });

    inputProductQuantity.addEventListener("input", function (event) {
      validateQuantityInput(inputProductQuantity, quantityForm, productStock);
      const update = changeQuantityDataset(inputProductQuantity, cartItem);
      cartCalc();
      updateCartStorage(update, cartItem);
    });

    productColorSelector.addEventListener("change", function () {
      const update = changeColorDataset(cartItem, productColorSelector);
      updateCartStorage(update, cartItem);
    });

    btnRemoveCartItem.addEventListener("click", function () {
      deleteCartItem(cartItemId, cartItem);
      cartCalc();
      updateAndDisplayCartCount();
    });
  }

  function btnDisplayCartHandler() {
    displayOverlay();
    center(cartPage);
    cartPage.style.display = "block";
    cartPageContent.style.display = "flex";

    if (cartItemsContainer.childElementCount >= 1) {
      cartCalc();
    } else {
      cartPageEmpty.style.display = "flex";
    }
  }

  function clearCart() {
    cartItems.forEach(function (cartItem) {
      cartItem.remove();
    });
    localStorage.clear();
  }

  function renderCartIemsInStorage() {
    const cartStorage = Object.values(localStorage);
    cartStorage.forEach(function (cartItemJSON) {
      const cartItemObject = JSON.parse(cartItemJSON);
      const productMap = productsDataMap.get(+cartItemObject.id);
      const productVariants = productMap.variants;

      const html = generateCartItemHTML(
        cartItemObject.color,
        cartItemObject.image,
        cartItemObject.name,
        cartItemObject.price,
        cartItemObject.quantity,
        productVariants
      );

      addCartItemToUI(html);

      const { latestCartItem } = setCartItemDataset(
        cartItemObject.color,
        cartItemObject.id,
        cartItemObject.price,
        cartItemObject.quantity
      );

      initCartActions(latestCartItem);
    });

    cartCalc();
    updateAndDisplayCartCount();
  }

  function updateCartStorage(update, cartItem) {
    if (update === true) {
      const color = cartItem.dataset.color;
      const id = cartItem.dataset.id;
      const quantity = cartItem.dataset.quantity;

      const productMap = productsDataMap.get(+id);
      const image = productMap.imageUrl;
      const name = productMap.name;
      const price = productMap.price;

      addCartItemToLocalStorage(color, id, image, name, price, quantity);
    } else {
      return;
    }
  }

  // LISTENERS
  function initCartEvents() {
    btnDisplayCart.addEventListener("click", btnDisplayCartHandler);

    btnClearCart.addEventListener("click", clearCart);
    btnClearCart.addEventListener("click", cartCalc);
    btnClearCart.addEventListener("click", updateAndDisplayCartCount);

    shippingSelector.addEventListener("change", cartCalc);

    btnCloseCart.addEventListener("click", closeModals);

    btnBackToShop.addEventListener("click", closeModals);
  }

  // CHECKOUT PAGE

  function storeCartSummary() {
    sessionStorage.setItem(`${cartTotal.id}`, `${cartTotal.dataset.value}`);

    sessionStorage.setItem(
      `${cartSubtotal.id}`,
      `${cartSubtotal.dataset.value}`
    );

    sessionStorage.setItem(
      `${cartShippingValue.id}`,
      `${cartShippingValue.dataset.value}`
    );
  }

  function displayShippingForm() {
    displayOverlay();
    center(checkoutPage);
    checkoutPage.style.display = "block";
  }

  function btnCheckoutHandler() {
    if (localStorage.length === 0) return;
    else {
      storeCartSummary();
      displayShippingForm();
    }
  }

  // CONTINUE TO REVIEW PAGE
  function validateUserData() {
    const formNotFilled = userInputFields.some((input) => input.value === "");
    return { formNotFilled };
  }

  function storeBuyerData() {
    userInputFields.forEach(function (input) {
      sessionStorage.setItem(`${input.id}`, `${input.value}`);
    });
    sessionStorage.setItem(`${stateSelector.id}`, `${stateSelector.value}`);
  }

  function clearPreviousOrderItems() {
    const prevOrderItems = Array.from(
      reviewPage.querySelectorAll(".order__item__container")
    );
    prevOrderItems.forEach((item) => item.remove());
  }

  function generateOrderHTML(color, image, name, quantity, subtotal) {
    const orderItemHTML = ` <div class="order__item__container">
                                <img src="${image}" alt="product image" class="order__item__image">
                                <div class="order__item">
                                  <p class="order__item__name">${name}</p>
                                  <div class="order__item__options">
                                    <p class="order__item__color">${color}</p>
                                    <p><span class="order__item__quantity">${quantity}</span><span>pcs</span></p>
                                  </div>
                                </div>
                                <p class="order__item__price">${convertPriceToLocalCurrency(
                                  subtotal
                                )}</p>
                              </div> `;
    return { orderItemHTML };
  }

  function generateOrderItemUI() {
    const cartStorage = Object.values(localStorage);

    cartStorage.forEach(function (cartItemJSON) {
      const cartItemObject = JSON.parse(cartItemJSON);
      const orderId = cartItemObject.id;
      const orderColor = cartItemObject.color;
      const orderImage = cartItemObject.image;
      const orderName = cartItemObject.name;
      const orderQuantity = cartItemObject.quantity;
      const orderSubtotal = cartItemObject.subtotal;

      const { orderItemHTML } = generateOrderHTML(
        orderColor,
        orderImage,
        orderName,
        orderQuantity,
        orderSubtotal
      );

      orderItemsContainer.insertAdjacentHTML("beforeend", orderItemHTML);
      orderItemsContainer.lastElementChild.dataset.id = orderId;
    });
  }

  function renderOrderPrice() {
    reviewSubtotal.textContent = `${convertPriceToLocalCurrency(
      sessionStorage.getItem("cart-subtotal")
    )}`;

    reviewShipping.textContent = `${convertPriceToLocalCurrency(
      sessionStorage.getItem("shipping-value")
    )}`;

    reviewTotal.textContent = `${convertPriceToLocalCurrency(
      sessionStorage.getItem("cart-total")
    )}`;
  }

  function getShippingDetails(key) {
    return sessionStorage.getItem(key);
  }

  function renderShippingDetails() {
    reviewFirstName.textContent = getShippingDetails("first__name");
    reviewLastName.textContent = getShippingDetails("last__name");
    reviewEmail.textContent = getShippingDetails("email");
    reviewPhone.textContent = getShippingDetails("phone__number");
    reviewAddress1.textContent = getShippingDetails("address");
    reviewAddress2.textContent = getShippingDetails("city");
    reviewAddress3.textContent = getShippingDetails("state");
  }

  function btnContinueHandler() {
    storeBuyerData();
    const { formNotFilled } = validateUserData();

    if (formNotFilled === false) {
      closeModals();
      displayOverlay();
      center(reviewPage);
      reviewPage.style.display = "block";
      clearPreviousOrderItems();
      generateOrderItemUI();
      renderOrderPrice();
      renderShippingDetails();
    } else {
      toggleAlertModal("All Input Fields Are Required!");
    }
  }

  // PLACE ORDER
  function clearStoredUserData() {
    sessionStorage.clear();
  }

  function convertOrderToString(orderArray) {
    const string = orderArray
      .map((item) => {
        const itemString = `${item[0]} (${item[1]}pcs ${item[2]}) \n`;
        return itemString;
      })
      .reduce(function (itemString, acc) {
        return acc + itemString;
      }, "");
    return string;
  }

  function generateWhatsappMessage() {
    const cartStorage = Object.values(localStorage);

    const order = cartStorage.map(function (cartItemJSON) {
      const cartItemObject = JSON.parse(cartItemJSON);
      const orderColor = cartItemObject.color;
      const orderName = cartItemObject.name;
      const orderQuantity = cartItemObject.quantity;
      return [orderName, orderQuantity, orderColor];
    });

    convertOrderToString(order);

    const message = `New Order!! \nOrder Details \n${convertOrderToString(
      order
    )} \nShipping Details \n${getShippingDetails(
      "first__name"
    )} ${getShippingDetails("last__name")} \n${getShippingDetails(
      "email"
    )} \n${getShippingDetails("phone__number")} \n${getShippingDetails(
      "address"
    )} \n${getShippingDetails("city")} \n${getShippingDetails("state")}`;

    const urlMessage = encodeURI(message);
    console.log(urlMessage);
    return { urlMessage };
  }

  function sendOrderToWhatsapp() {
    const { urlMessage } = generateWhatsappMessage();
    const href = `https://wa.me/2348143671737?text=${urlMessage}`;
    window.open(href, "_blank");
    return true;
  }

  function btnPlaceOrderHandler() {
    const orderPromise = new Promise(function (resolve, reject) {
      if (sendOrderToWhatsapp()) resolve("Your Order Has Been Placed!");
      else reject("Please, Try Again Soon");
    });

    orderPromise
      .then((res) => {
        displayAlertModal(res);
        clearCart();
        clearStoredUserData();
        window.addEventListener("focus", function () {
          setTimeout(location.reload(), 2000);
        });
      })
      .catch((err) => displayAlertModal(err));
  }

  function initCheckout() {
    btnCheckout.addEventListener("click", closeModals);
    btnCheckout.addEventListener("click", btnCheckoutHandler);

    btnContinue.addEventListener("click", btnContinueHandler);

    btnEditUserData.addEventListener("click", closeModals);
    btnEditUserData.addEventListener("click", displayShippingForm);

    btnBackToCart.addEventListener("click", closeModals);
    btnBackToCart.addEventListener("click", btnDisplayCartHandler);

    btnEditCart.addEventListener("click", closeModals);
    btnEditCart.addEventListener("click", btnDisplayCartHandler);

    btnPlaceOrder.addEventListener("click", btnPlaceOrderHandler);
  }

  // MODALS
  function displayOverlay() {
    overlay.classList.remove("hidden");
  }

  function hideOverlay() {
    overlay.classList.add("hidden");
  }

  function closeModals() {
    cartPage.style.display = "none";
    cartPageContent.style.display = "none";
    cartPageEmpty.style.display = "none";
    checkoutPage.style.display = "none";
    reviewPage.style.display = "none";
    body.style.overflow = "auto";
    hideOverlay();
  }

  function actionAlert(message) {
    alertModal.textContent = message;
  }

  function displayAlertModal(message) {
    actionAlert(message);
    center(alertModal);
    alertModal.style.display = "flex";
  }

  function hideAlertModal() {
    alertModal.style.display = "none";
  }

  function toggleAlertModal(message) {
    displayAlertModal(message);
    setTimeout(hideAlertModal, 2000);
  }

  overlay.addEventListener("click", closeModals);
}

