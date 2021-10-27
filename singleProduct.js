const displayItem = document.querySelector("#app-item");
const cartIcon = document.querySelector(".cartIcon i");
const body = document.querySelector("body");
const cartTag = document.querySelector(".cart");
const searchInput = document.querySelector(".searchInput");
const searchBtn = document.querySelector(".searchBtn");

let cartArray = [];
let id = location.href.split("=")[1];
console.log(id);

function createEl(type, elClass) {
  const element = document.createElement(type);
  element.classList = elClass;
  return element;
}
window.addEventListener("load", async () => {
  const result = await fetch("/data.json");
  const data = await result.json();

  items = data;
  render(items[id]);

  if (localStorage.getItem("cart")) {
    console.log("hello");
    console.log(items);
    cartArray = JSON.parse(localStorage.getItem("cart"));
    console.log(cartArray);
    cartRender();
  }
});

function render() {
  const realIndex = items.findIndex((obj) => obj.id === id);
  let card = createEl("div", "itemCard");
  let cardImg = createEl("img", "itemImg");
  let cardInfo = createEl("div", "info-container");
  let cardInfoName = createEl("p", "itemName");
  let cardInfoPrice = createEl("span", "itemPrice");
  let cardInfoQuantity = createEl("span", "itemQuantity");
  let toCart = createEl("button", "toCartButton");
  let select = createEl("input", "selectQuantity");
  let incBtnplus = createEl("button", "selectinc");
  let incBtnminus = createEl("button", "selectdec");
  let quantityContainer = createEl("span", "quantityContainer");
  let aTag = createEl("a", "link");
  let imageContainer = createEl("div", "image__Container");
  let arrowRight = createEl("div", "arrowRight");
  let arrowLeft = createEl("div", "arrowLeft");

  incBtnplus.textContent = "+";
  incBtnminus.textContent = "-";

  select.type = "number";
  select.min = 1;
  select.value = select.min;
  select.max = items[realIndex].quantity;

  incBtnplus.addEventListener("click", () => {
    incrementValue(select, items[realIndex].quantity);
  });
  incBtnminus.addEventListener("click", () => {
    decrementValue(select);
  });
  cartIcon.textContent = 0;
  cardInfoQuantity.textContent = `Stock: ${items[realIndex].quantity}`;
  cardInfoName.textContent = items[realIndex].name;
  cardInfoPrice.textContent = `${items[realIndex].price}$`;
  toCart.textContent = "Add to cart";
  toCart.addEventListener("click", () => {
    if (select.value > 0 && select.value <= items[realIndex].quantity) {
      console.log(items[realIndex].id);
      if (cartArray.some((o) => o.id == items[realIndex].id)) {
        cartArray.find((o) => o.id == items[realIndex].id).quantity += Number(
          select.value
        );
      } else {
        cartArray.push({
          id: items[realIndex].id,
          quantity: Number(select.value),
        });
      }
    }
    console.log(items[realIndex].id, select.value, "cartArray:", cartArray);
    cartIcon.textContent = cartArray.length;
    cartRender(cartArray, items[realIndex]);
    localStorage.setItem("cart", JSON.stringify(cartArray));
  });
  //
  //append section
  quantityContainer.append(incBtnminus, select, incBtnplus);
  aTag.append(cardInfoName);
  cardInfo.append(aTag, cardInfoPrice, cardInfoQuantity);
  imageContainer.append(cardImg);
  if (items[realIndex].pictures.length > 1) {
    imageContainer.append(arrowRight, arrowLeft);
  }
  card.append(imageContainer, cardInfo, quantityContainer, toCart);
  displayItem.appendChild(card);

  //gallery sectiom
  if (items[realIndex].pictures.length) {
    cardImg.src = items[realIndex].pictures[0];
    console.log(items[realIndex].pictures);
  } else {
    cardImg.src = items[realIndex].thumbnail;
  }

  const pictureArrLength = items[realIndex].pictures.length;
  const picturesArray = items[realIndex].pictures;
  let newindex = 0;
  function nextImage() {
    if (newindex < pictureArrLength - 1) {
      newindex++;
      cardImg.src = picturesArray[newindex];
    } else if (newindex == pictureArrLength - 1) {
      cardImg.src = picturesArray[0];
      newindex = 0;
    }
  }
  function previousImage() {
    if (newindex < picturesArray.length && newindex > 0) {
      newindex--;
      cardImg.src = picturesArray[newindex];
    } else if (newindex == 0) {
      cardImg.src = picturesArray[pictureArrLength - 1];
      newindex = pictureArrLength - 1;
    }
  }
  arrowRight.addEventListener("click", () => {
    nextImage();
  });
  arrowLeft.addEventListener("click", () => {
    previousImage();
  });
}
//function to render all objects added to cartArray
function cartRender() {
  let container =
    cartTag.querySelector(".cartContainer") || createEl("div", "cartContainer");
  if (container !== null && container !== "") {
    container.innerHTML = null;
  }

  let cart = items.filter((item) =>
    cartArray.some((selectedItem) => selectedItem.id === item.id)
  );
  cart.forEach((item) => {
    const realIndex = cartArray.findIndex((obj) => obj.id === item.id);
    let cartItem = createEl("div", "cartItem");
    let cartImg = createEl("img", "cartItemImg");
    let cartInfoName = createEl("p", "cartitemName");
    let cartInfoPrice = createEl("span", "cartitemPrice");
    let removeBtn = createEl("button", "removeBtn");
    let select = createEl("input", "selectQuantity");
    let incBtnplus = createEl("button", "selectinc");
    let incBtnminus = createEl("button", "selectdec");
    let quantityContainer = createEl("span", "quantityContainer");

    incBtnplus.textContent = "+";
    incBtnminus.textContent = "-";

    cartImg.src = item.thumbnail;
    cartInfoName.textContent = item.name;
    cartInfoPrice.textContent = item.price;

    incBtnplus.addEventListener("click", () => {
      incrementValue(select, items[realIndex].quantity);
      cartArray[realIndex].quantity = Number(select.value);
      localStorage.setItem("cart", JSON.stringify(cartArray));
    });
    incBtnminus.addEventListener("click", () => {
      decrementValue(select);
      cartArray[realIndex].quantity = Number(select.value);
      localStorage.setItem("cart", JSON.stringify(cartArray));
    });

    select.type = "number";
    select.min = 1;
    select.max = item.quantity;
    select.value = quantityCheck();
    function quantityCheck() {
      if (cartArray[realIndex].quantity > item.quantity) {
        return (select.value = item.quantity);
      } else return (select.value = cartArray[realIndex].quantity);
    }
    removeBtn.textContent = "remove";

    removeBtn.addEventListener("click", () => {
      cartArray.splice(realIndex, 1);
      localStorage.setItem("cart", JSON.stringify(cartArray));
      cartIcon.textContent = cartArray.length;
      cartRender();
    });
    quantityContainer.append(incBtnminus, select, incBtnplus);
    cartItem.append(
      cartImg,
      cartInfoName,
      cartInfoPrice,
      removeBtn,
      quantityContainer
    );
    container.append(cartItem);
    cartTag.append(container);
    console.log(cart);
    localStorage.setItem("cart", JSON.stringify(cartArray));
    cartIcon.textContent = cartArray.length;
  });
}
//hide
cartIcon.addEventListener("click", () => {
  cartTag.classList.toggle("is-active");
});
//increase decrease functions to select quantity
function incrementValue(select, quantity) {
  var value = parseInt(select.value, quantity);
  value = isNaN(value) ? 0 : value;
  if (value < quantity) {
    value++;
    select.value = value;
  }
}
function decrementValue(select) {
  var value = parseInt(select.value);
  value = isNaN(value) ? 0 : value;
  if (value > 1) {
    value--;
    select.value = value;
  }
}
