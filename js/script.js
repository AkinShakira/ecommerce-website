"use strict";
// ELEMENT SELECTION
const productContainer = document.querySelector(".product__list");
const cartPage = document.querySelector('.cart__page')
const overlay = document.querySelector(".overlay")


// BUTTONS SELECTION
const addToCart =document.querySelector(".btn__add-cart")
const addToFavorites =document.querySelector(".btn__add-favorite")
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
        <div class="product">
          <!-- product image -->
          <div class="product__image__container mb-2">
            <img src= "${
              product.imageUrl
            }" alt="Product Image" class="product__image" >
          </div>

          <p class="product__name">${product.name}</p>

          <div class="product__info">
            <p data-stock="${product.stock}" class="product__stock__icon ${
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
                <input type="number" name="product__quantity__value" min="0" value='${
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

// async function getProductJson() {
//   try {
//     const response = await fetch(
//       "https://shakiraakinleye.github.io/ap-server/db.json"
//     );
//     const json = await response.json();
//     return json;
//     // Handle errors
//   } catch {
//     console.log(error);
//   }
// }
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
  const productStock = Number(productStockEl.dataset.stock);
  const productQtyEl = parentEl.children[1];

  return {parentEl, productEl, productStockEl, productStock, productQtyEl}
}


function btnIncreaseQtyHandler(event) {
  if (event.target.className === "product__quantity--increment") {
    const { productQtyEl, productStock } = elementSelection(event);
    let productQty = Number(productQtyEl.value);
    if (productQty < productStock) {
      productQty++;
      productQtyEl.value = productQty;
    } else {

    }
  }
}

function btnDecreaseQtyHandler(event) {
  if (event.target.className === "product__quantity--decrement") {
    const {productQtyEl} = elementSelection(event);
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
    const { parentEl, productStock } = elementSelection(event);
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


function renderCartProduct(event) {

}

function pathCart(event) {
  const productEl = event.path[3];
  // const cartQty = 2;
  // const cartVariant = "gold";
  // const cartItemName = "Maia"
  // const cartImage = "img"
  // const cartItemPrice = 
  return {productEl}
}

function addToCartHandler(event) {
  // const { parentEl} = elementSelection(event);
  // if (parentEl) {
  //   console.log(parentEl);
  // }

  if (event.path[1].className === "btn__add-cart") {
    const {productEl} = pathCart(event)
    console.log(productEl)
    fetch("http://localhost:3000/products", {
      method: "PUT",
      body: JSON.stringify({
        id: 1,
        title: "foo",
        body: "bar",
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  }
}








function btnDisplayCartHandler() {
  overlay.classList.remove("hidden")
  cartPage.classList.remove("hidden")
  // POSITION THE CART
}


function closeAllOverlay(){
  overlay.classList.add("hidden")
  cartPage.classList.add("hidden")
  // favoritePage.classList.add("hidden")
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
  addToCartHandler(event);
});

// 
btnDisplayCart.addEventListener("click", btnDisplayCartHandler)
btnCloseCart.addEventListener("click", closeAllOverlay)
overlay.addEventListener("click", closeAllOverlay)




// STARTING CONDITIONS
displayProducts();




// CART CART CART CART CART
// CART CART CART CART CART
// CART CART CART CART CART


// displayCart()







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