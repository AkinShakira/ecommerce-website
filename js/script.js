"use strict";
document.addEventListener("DOMContentLoaded", productsFetch);

const cartItemsContainer = document.querySelector(".cart__items");
const cartCount = document.querySelector(".cart__count");


initSlider();
// updateAndDisplayCartCount();

function convertPriceToLocalCurrency(value) {
  return new Intl.NumberFormat("en-Ng", {
    style: "currency",
    currency: "NGN",
  }).format(value);
}

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

function updateAndDisplayCartCount() {
  if (cartItemsContainer.childElementCount > 0) {
    cartCount.style.display = "block";
    cartCount.textContent = cartItemsContainer.childElementCount;
  } else {
    cartCount.style.display = "none";
  }
}

function productsFetch() {
  const app = document.querySelector(".app");
  const productContainer = document.querySelector(".product__list");

  function renderVariants(option) {
    const variant = `<option value="${option}">${option}</option>`;
    return variant;
  }

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

  function setProductDataAtrributes(id, stock, variants) {
    const lastProduct = productContainer.lastElementChild;
    lastProduct.dataset.id = id;
    lastProduct.dataset.stock = stock;
    lastProduct.dataset.quantity = 1;
    lastProduct.dataset.color = variants[0];
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
        setProductDataAtrributes(product.id, product.stock, product.variants);
      });
      return productsDataMap;
    })
    .then((productsDataMap) => initApp(productsDataMap));
}

function initApp(productsDataMap) {
  const products = document.querySelectorAll(".product");

  // STARTING CONDITIONS
  initProductOptions();

  // const cartCount = document.querySelector(".cart__count");
  const cartPage = document.querySelector(".cart__page");
  const cartPageContent = document.querySelector(".cart__page__content ");
  // const orderSummary = document.querySelector(".order__summary")
  const cartPageEmpty = document.querySelector(".cart__page__empty");
  const overlay = document.querySelector(".overlay");
  // const cartItemsContainer = document.querySelector(".cart__items");
  const cartTotal = document.querySelector(".cart__total__value");
  const cartSubtotal = document.querySelector(".cart__subtotal__value");
  const cartShippingValue = document.querySelector(".cart__shipping__value");
  const shippingSelector = document.querySelector(".shipping__selector");
  const checkoutPage = document.querySelector(".checkout__page");
  const shippingForm = document.querySelector(".shipping__form__container");
  const userInputFields = Array.from(shippingForm.querySelectorAll("input"));
  const reviewPage = document.querySelector(".review__page");
  const orderItemsContainer = document.querySelector(".order__items");
  const alertModal = document.querySelector(".alert__modal");

  // BUTTONS SELECTION
  const btnDisplayCart = document.querySelector(".btn__cart");
  const btnClearCart = document.querySelector(".btn__cart--clear");
  const btnCloseCart = document.querySelector(".btn__cart--close");
  const btnCheckout = document.querySelector(".btn__checkout");
  const btnBackToCart = document.querySelector(".btn__back__to__cart");
  const btnContinue = document.querySelector(".btn__continue");
  const btnEditCart = document.querySelector(".btn__edit__cart");
  const btnEditUserData = document.querySelector(".btn__edit__user-data");
  const btnPlaceOrder = document.querySelector(".btn__place__order");

  // renderCartIemsInStorage();

  // EVENTS
  // initCart();
  // initCheckout();

  function initProductOptions() {
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
      if (productQty > 0) {
        productQty--;
        quantityInput.value = productQty;
      } else {
        return;
      }
    }

    function validateQuantityInput(quantityInput, quantityForm, stock) {
      if (+quantityInput.value < 0) {
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
      element.dataset.color = selector.value;
    }

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
      const quantityForm = product.querySelector(".product__quantity__form");
      const productColorSelector = product.querySelector(".product__color");
      const productStock = product.dataset.stock;

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

      productColorSelector.addEventListener("input", function () {
        changeColorDataset(product, productColorSelector);
      });
    });
  }

  initAddToCart();

  function initAddToCart() {
    function generateCartItemHTML(color, imageUrl, name, price, quantity) {
      const html = `<div class="cart__item">
              <div class="cart__item__image">
                <img src="${imageUrl}" alt="Product image">
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
      latestCartItem.dataset.id = id;
      latestCartItem.dataset.color = color;
      latestCartItem.dataset.price = price;
      latestCartItem.dataset.quantity = quantity;
      latestCartItem.dataset.subtotal = price * quantity;
      return { latestCartItem };
    }

    function generateCartUI(html) {
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
      };
      const cartItemJSON = JSON.stringify(cartObject);
      localStorage.setItem(id, cartItemJSON);
    }

    function addItemToCart(color, id, image, name, price, quantity) {
      const html = generateCartItemHTML(
        color,
        image,
        name,
        price,
        quantity
      );

      generateCartUI(html);

      const { latestCartItem } = setCartItemDataset(
        color, 
        id,
        price,
        quantity
      );

      addCartItemToLocalStorage(
        color, 
        id,
        image,
        name,
        price,
        quantity
      );

      updateAndDisplayCartCount();
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

    function btnAddToCartHandler(color, id, image, name, price, quantity) {
      const { idPresent } = checkIdPresentInCart(id);
      const noQuantitySelected = checkQuantitySelected(quantity);

      if (idPresent === false && noQuantitySelected === false) {
        addItemToCart(color, id, image, name, price, quantity);
      } else {
        return;
      }
    }

    products.forEach((product) => {
      const productMap = productsDataMap.get(+product.dataset.id);
      const productId = product.dataset.id;
      const selectedProductQuantity = product.dataset.quantity;
      const selectedProductColor = product.dataset.quantity;
      const productImage = productMap.imageUrl;
      const productPrice = productMap.price;
      const productName = productMap.name;

      const btnAddToCart = product.querySelector(".btn__add-to-cart");

      btnAddToCart.addEventListener("click", function () {
        btnAddToCartHandler(
          selectedProductColor,
          productId,
          productImage,
          productName,
          productPrice,
          selectedProductQuantity
        );
      })
    });
  }

  function initCart() {
    function getShippingPrice() {
      const shippingPrice = shippingSelector.value;
      cartShippingValue.textContent = `${convertPriceToLocalCurrency(
        shippingPrice
      )}`;
      return shippingPrice;
    }

    function calcCartItemSubtotal(cartItem) {
      const cartItemQuantity = +cartItem.dataset.quantity;
      const cartItemPrice = +cartItem.dataset.price;
      const cartItemSubtotal = cartItemQuantity * cartItemPrice;
      cartItem.dataset.subtotal = cartItemSubtotal;
      console.log(cartItemSubtotal);
      return { cartItemSubtotal };
    }

    function addCartItemSubtotalToUI(cartItem, subtotal) {
      const cartItemSubtotalValue = cartItem.querySelector(
        ".cart__item__subtotal__value"
      );
      cartItemSubtotalValue.textContent = convertPriceToLocalCurrency(subtotal);
    }

    function calcAndDisplayCartItemSubtotal(cartItem) {
      const { cartItemSubtotal } = calcCartItemSubtotal(cartItem);
      addCartItemSubtotalToUI(cartItem, cartItemSubtotal);
    }

    function CartItemSubtotal() {
      const cartItems = Array.from(document.querySelectorAll(".cart__item"));
      console.log(cartItems);
      cartItems.forEach((cartItem) => calcAndDisplayCartItemSubtotal(cartItem));
    }

    function calcCartSubtotalAndTotal() {
      const cartItems = Array.from(document.querySelectorAll(".cart__item"));
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
      const { subtotal, total } = calcCartSubtotalAndTotal();
      cartSubtotal.textContent = `${convertPriceToLocalCurrency(subtotal)}`;
      cartTotal.textContent = `${convertPriceToLocalCurrency(total)}`;
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
        displayCartSubtotalAndTotal();
      } else {
        cartPageEmpty.style.display = "flex";
      }
    }

    function center(page) {
      const scrollValue = window.scrollY;
      const halfWindowHeight = window.innerHeight / 2;
      page.style.top = `${scrollValue + halfWindowHeight}px`;
      page.style.transform = "translate(-50%, -50%)";
    }

    function cartDOMSelection(event) {
      const cartItemEl = event.target.closest(".cart__item");
      const cartItemId = cartItemEl.dataset.id;
      console.log(cartItemId);
      return { cartItemEl, cartItemId };
    }

    async function cartPageQuantityChange(event) {
      try {
        if (event.target.closest(".cart__item") !== null) {
          const { cartItemEl, cartItemId } = cartDOMSelection(event);
          const { quantityForm, quantityInput } =
            quantityChangeEventDOMSelection(event);
          const { productsDataMap } = await createProductDataStr();
          const product = productsDataMap.get(+cartItemId);

          increaseProductQuantity(event, quantityInput, product.stock);
          decreaseProductQuantity(event, quantityInput);
          changeQuantityDataset(event, quantityInput, cartItemEl);
        } else {
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }

    function delCartItemFromLocalStorage(id) {
      localStorage.removeItem(id);
    }

    function deleteCartItem(event) {
      if (event.target.className === "btn__cart--remove-item order-2") {
        const { cartItemEl, cartItemId } = cartDOMSelection(event);

        cartItemEl.remove();
        delCartItemFromLocalStorage(cartItemId);
        displayCartSubtotalAndTotal();
        updateAndDisplayCartCount();
      }
    }

    function clearCart() {
      Array.from(cartItemsContainer.children).forEach(function (cartItem) {
        cartItem.remove();
      });
      displayCartSubtotalAndTotal();
      updateAndDisplayCartCount();
      localStorage.clear();
    }

    function renderCartIemsInStorage() {
      const cartStorage = Object.values(localStorage);
      cartStorage.forEach(function (cartItemJSON) {
        const cartItemObject = JSON.parse(cartItemJSON);

        const html = generateCartItemHTML(
          cartItemObject.color,
          cartItemObject.id,
          cartItemObject.image,
          cartItemObject.name,
          cartItemObject.price,
          cartItemObject.quantity
        );

        generateCartUI(html);

        setCartItemDataset(
          cartItemObject.id,
          cartItemObject.color,
          cartItemObject.price,
          cartItemObject.quantity
        );
      });

      updateAndDisplayCartCount();
    }

    // initCart END
  }
  // NOT DONE

  // // FIX: check if cart has same variant
  // function checkIdPresentInCart(event) {
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

  // // //  //
  // CART DISPLAY FUNCTIONS

  // CART ACTIONS

  // CART STORAGE FUNCTIONS

  // USED THE IN CART PATH BECAUSE THE ITEM IS IN CART NOW AND THE ACTION OCCURS IN THE CART

  // THIS WILL RENDER THE LOCALLY STORED CART ITEMS IN THE UI

  // THIS WILL UPDATE THE STORED CART ITEMS UPON CHANGES TO QUANTITY AND VARIANT IN THE CART
  // function updateCartStorage(event) {
  //   const update = changeQuantityDataset(event);
  //   const {
  //     cartItem,
  //     cartId,
  //     cartItemImgSrc,
  //     cartItemName,
  //     cartItemPrice,
  //     cartItemStock,
  //     cartItemColor,
  //     cartItemQty,
  //   } = pathInCart(event);

  //   if (update === true) {
  //     const updatedItem = generateCartItemHTML(
  //       cartId,
  //       cartItemName,
  //       cartItemStock,
  //       cartItemPrice,
  //       cartItemColor,
  //       cartItemQty,
  //       cartItemImgSrc
  //     );
  //     localStorage.setItem(`${cartId}`, updatedItem);
  //   } else {
  //     return;
  //   }
  // }

  // CHECKOUT
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

  function validateUserData() {
    const formNotFilled = userInputFields.some((input) => input.value === "");

    return { formNotFilled };
  }

  function storeBuyerData() {
    userInputFields.forEach(function (input) {
      sessionStorage.setItem(`${input.id}`, `${input.value}`);
    });

    const state = document.querySelector(".state");
    sessionStorage.setItem(`${state.id}`, `${state.value}`);
  }

  function btnContinueHandler() {
    storeBuyerData();
    const { formNotFilled } = validateUserData();

    if (formNotFilled === false) {
      closeModals();
      displayOverlay();
      center(reviewPage);
      reviewPage.style.display = "block";
      renderOrderItemHtml();
      renderOrderPrice();
      renderShippingDetails();
    } else {
      toggleAlertModal("All Input Fields Are Required!");
    }
  }

  function renderOrderItemHtml() {
    const cartItemsArray = Array.from(cartItemsContainer.children);
    const orderItemsArray = Array.from(orderItemsContainer.children);

    cartItemsArray.forEach(function (item) {
      if (orderItemsArray.some((item) => item.dataset.id) === true) {
        return;
      } else {
        const orderItemHtml = ` <div class="order__item__container" data-id="${
          item.dataset.id
        }">
                                <img src="${
                                  item.dataset.image
                                }" alt="product image" class="order__item__image">
                                <div class="order__item">
                                  <p class="order__item__name">${
                                    item.dataset.name
                                  }</p>
                                  <div class="order__item__options">
                                    <p class="order__item__color">${
                                      item.dataset.color
                                    }</p>
                                    <p><span class="order__item__quantity">${
                                      item.dataset.quantity
                                    }</span><span>pcs</span></p>
                                  </div>
                                </div>
                                <p class="order__item__price">${convertPriceToLocalCurrency(
                                  item.dataset.subtotal
                                )}</p>
                              </div> `;

        orderItemsContainer.insertAdjacentHTML("beforeend", orderItemHtml);
      }
    });
  }

  function renderOrderPrice() {
    const subtotal = document.querySelector(".review__subtotal__value");
    const shipping = document.querySelector(".review__shipping__value");
    const total = document.querySelector(".review__total__value");

    subtotal.textContent = `${convertPriceToLocalCurrency(
      sessionStorage.getItem("cart-subtotal")
    )}`;

    shipping.textContent = `${convertPriceToLocalCurrency(
      sessionStorage.getItem("shipping-value")
    )}`;

    total.textContent = `${convertPriceToLocalCurrency(
      sessionStorage.getItem("cart-total")
    )}`;
  }

  function renderShippingDetails() {
    const firstName = document.querySelector(".first__name");
    const lastName = document.querySelector(".last__name");
    const email = document.querySelector(".user__email");
    const phone = document.querySelector(".user__tel");
    const address1 = document.querySelector(".user__address-1");
    const address2 = document.querySelector(".user__address-2");
    const address3 = document.querySelector(".user__address-3");

    firstName.textContent = sessionStorage.getItem("first__name");
    lastName.textContent = sessionStorage.getItem("last__name");
    email.textContent = sessionStorage.getItem("email");
    phone.textContent = sessionStorage.getItem("phone__number");
    address1.textContent = sessionStorage.getItem("address");
    address2.textContent = sessionStorage.getItem("city");
    address3.textContent = sessionStorage.getItem("state");
  }

  function clearStoredUserData() {
    sessionStorage.clear();
  }

  function sendOrderToWhatsapp() {
    const message = `${sessionStorage.getItem(
      "first__name"
    )} ${sessionStorage.getItem("last__name")} has placed an order`;
    // New Order!! \n Order details \n Item (2pcs, color)\n \n Contact details\n Name \n phone \n Address
    const urlMessage = message.replace(" ", "%20").replace("\n", "%0A");
    console.log("test", urlMessage);
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
        clearCart();
        clearStoredUserData();
        displayAlertModal(res);
        window.addEventListener("focus", function () {
          setTimeout(location.reload(), 2000);
        });
      })
      .catch((err) => displayAlertModal(err));
  }

  // // //  //
  // MODAL FUNCTIONS
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

  // EVENTS

  // async function initProductActions() {
  //   productContainer.addEventListener("click", function (event) {
  //     productPageQuantityChange(event);
  //     btnAddToCartHandler(event);
  //   });

  //   productContainer.addEventListener("input", function (event) {
  //     changeColorDataset(event);
  //   });
  // }

  // OVERLAY
  overlay.addEventListener("click", closeModals);

  function initCart() {
    btnDisplayCart.addEventListener("click", btnDisplayCartHandler);

    cartItemsContainer.addEventListener("click", function (event) {
      cartPageQuantityChange(event);
      // updateCartStorage(event);
    });

    cartItemsContainer.addEventListener("input", function (event) {
      changeColorDataset(event);
    });

    cartPage.addEventListener("click", function (event) {
      CartItemSubtotal();
      displayCartSubtotalAndTotal();
      deleteCartItem(event);
    });

    cartPage.addEventListener("input", function () {
      CartItemSubtotal();
      displayCartSubtotalAndTotal();
    });

    btnCloseCart.addEventListener("click", closeModals);

    btnClearCart.addEventListener("click", clearCart);
  }

  function initCheckout() {
    btnCheckout.addEventListener("click", function () {
      closeModals();
      btnCheckoutHandler();
    });

    btnContinue.addEventListener("click", function (event) {
      btnContinueHandler();
    });

    btnEditUserData.addEventListener("click", function () {
      closeModals();
      displayShippingForm();
    });

    btnBackToCart.addEventListener("click", function () {
      closeModals();
      btnDisplayCartHandler();
    });

    btnEditCart.addEventListener("click", function () {
      closeModals();
      btnDisplayCartHandler();
    });

    btnPlaceOrder.addEventListener("click", btnPlaceOrderHandler);
  }
}
