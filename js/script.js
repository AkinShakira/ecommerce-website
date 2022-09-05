"use strict";

// function getData() {
//   fetch(
//     "https://jsonplaceholder.com/AkinShakira/ecommerce-website"
//   ).then((response) => console.log(response.json()));
//     // .then((data) => console.log(data));
// }


function getData() {
  fetch("https://mockend.com/shakiraakinleye/ecommerce-website/products").then(
    (response) => console.log(response)
  );
  // .then((data) => console.log(data));
}

getData();



