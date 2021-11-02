const displayItem = document.querySelector("#app-item");
const cartIcon = document.querySelector(".cartIcon i");
const body = document.querySelector("body");
const cartTag = document.querySelector(".cart");
const searchInput = document.querySelector(".searchInput");
const searchBtn = document.querySelector(".searchBtn");
const searchTag = document.querySelector(".searchTag");

let cartArray = [];
let id = location.href.split("=")[1];

window.addEventListener("load", async () => {
  const result = await fetch("/data.json");
  const data = await result.json();

  items = data;
  render(items[id]);

  if (localStorage.getItem("cart")) {
    cartArray = JSON.parse(localStorage.getItem("cart"));
    cartRender();
  }
});
function createEl(type, elClass) {
  const element = document.createElement(type);
  element.classList = elClass;
  return element;
}
function toLocal() {
  localStorage.setItem("cart", JSON.stringify(cartArray));
  cartRender();
}
function incrementValue(select, quantity) {
  var value = Number(select.value, quantity);
  value = isNaN(value) ? 0 : value;
  if (value < quantity) {
    value++;
    select.value = value;
  }
}
function decrementValue(select) {
  var value = Number(select.value);
  value = isNaN(value) ? 0 : value;
  if (value > 1) {
    value--;
    select.value = value;
  }
}

function render() {
  let item = items[items.findIndex((obj) => obj.id === id)];
  let card = createEl("div", "itemCard");
  let cardImg = createEl("img", "itemImg");
  let cardInfo = createEl("div", "info-container");
  let cardInfoName = createEl("p", "itemName");
  let cardInfoPrice = createEl("span", "itemPrice");
  let cardInfoQuantity = createEl("span", "itemQuantity");
  let toCartContainer = createEl("div", "toCart__Container");
  let toCart = createEl("button", "toCartButton");
  let select = createEl("input", "selectQuantity");
  let incBtnplus = createEl("button", "selectinc");
  let incBtnminus = createEl("button", "selectdec");
  let quantityContainer = createEl("span", "quantityContainer");
  let aTag = createEl("a", "link");
  let imageContainer = createEl("div", "image__Container");
  let descriptionContainer = createEl("div", "description__Container");
  let descriptionP = createEl("h4", "description");
  let descriptionBtn = createEl("button", "descriptionBtn");
  let arrowRight = createEl("div", "arrowRight");
  let arrowLeft = createEl("div", "arrowLeft");
  const pictureArrLength = item.pictures.length;
  const picturesArray = item.pictures;
  let newindex = 0;
  cartIcon.textContent = 0;

  descriptionP.textContent = item.description;
  descriptionBtn.textContent = "Overview";

  incBtnplus.textContent = "+";
  incBtnminus.textContent = "-";

  incBtnplus.addEventListener("click", () => {
    incrementValue(select, item.quantity);
  });
  incBtnminus.addEventListener("click", () => {
    decrementValue(select);
  });

  select.type = "number";
  select.min = 1;
  select.value = select.min;
  select.max = item.quantity;
  cardInfoQuantity.textContent = `Stock: ${item.quantity}`;
  cardInfoName.textContent = item.name;
  cardInfoPrice.textContent = `${item.price}$`;
  toCart.textContent = "Add to cart";

  toCart.addEventListener("click", () => {
    if (select.value > 0 && select.value <= item.quantity) {
      if (cartArray.some((o) => o.id == item.id)) {
        cartArray.find((o) => o.id == item.id).quantity += Number(select.value);
      } else {
        cartArray.push({
          id: item.id,
          quantity: Number(select.value),
        });
      }
    }
    cartIcon.textContent = cartArray.length;
    toLocal();
  });

  if (item.pictures.length) {
    cardImg.src = item.pictures[0];
  } else if (item.thumbnail) {
    cardImg.src = item.thumbnail;
  } else {
    cardImg.src = "/assets/icons/no-image.png";
  }

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
  descriptionBtn.addEventListener("click", () => {
    descriptionP.classList.toggle("descriptionShow");
    descriptionBtn.classList.toggle("active--button");
  });
  quantityContainer.append(incBtnminus, select, incBtnplus);
  toCartContainer.append(quantityContainer, toCart);
  descriptionContainer.appendChild(descriptionP);
  aTag.append(cardInfoName);
  cardInfo.append(aTag, descriptionContainer, cardInfoPrice, cardInfoQuantity);
  if (item.description) {
    cardInfo.insertBefore(descriptionBtn, descriptionContainer);
  }
  imageContainer.append(cardImg);
  if (item.pictures.length > 1) {
    imageContainer.append(arrowRight, arrowLeft);
  }
  card.append(imageContainer, cardInfo, toCartContainer);
  displayItem.appendChild(card);
}

function cartRender() {
  let cartPageAtag = createEl("a", "toCartPagetag");
  let toCartPage = createEl("button", "toCartPage");
  toCartPage.textContent = "buy";
  cartPageAtag.href = "/cart.html";
  cartPageAtag.append(toCartPage);
  let totalPriceContainer = createEl("div", "totalPrice");
  let totalPrice = 0;
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
    let removeBtn = createEl("div", "removeBtn");
    let select = createEl("input", "selectQuantity");
    let incBtnplus = createEl("button", "selectinc");
    let incBtnminus = createEl("button", "selectdec");
    let quantityContainer = createEl("span", "quantityContainer");
    let itemPrice = 0;
    let aTag = createEl("a", "link");

    aTag.href = `/singleProduct.html?product=${item.id}`;

    incBtnplus.textContent = "+";
    incBtnminus.textContent = "-";

    if (item.thumbnail) {
      cartImg.src = item.thumbnail;
    } else if (item.pictures.length) {
      cartImg.src = item.pictures[0];
    } else cartImg.src = "/assets/icons/no-image.png";

    cartInfoName.textContent = item.name;
    cartInfoPrice.textContent = item.price;

    incBtnplus.addEventListener("click", () => {
      incrementValue(select, item.quantity);
      cartArray[realIndex].quantity = Number(select.value);
      toLocal();
    });
    incBtnminus.addEventListener("click", () => {
      decrementValue(select);
      cartArray[realIndex].quantity = Number(select.value);
      toLocal();
    });

    select.type = "number";
    select.min = 1;
    select.max = item.quantity;
    select.value = quantityCheck();
    function quantityCheck() {
      if (cartArray[realIndex].quantity > item.quantity) {
        return (select.value = item.quantity);
      } else if (cartArray[realIndex].quantity < 1) {
        return (select.value = 1);
      } else return (select.value = cartArray[realIndex].quantity);
    }
    select.addEventListener("change", (event) => {
      cartArray[realIndex].quantity = event.target.value;
      toLocal();
    });
    removeBtn.innerHTML = "<i class='fal fa-times'></i>";

    removeBtn.addEventListener("click", () => {
      cartArray.splice(realIndex, 1);
      cartIcon.textContent = cartArray.length;
      toLocal();
    });
    itemPrice = item.price * select.value;
    totalPrice += itemPrice;
    quantityContainer.append(incBtnminus, select, incBtnplus);
    aTag.append(cartInfoName);
    cartItem.append(cartImg, aTag, cartInfoPrice, removeBtn, quantityContainer);
    container.append(cartItem, totalPriceContainer);
    cartTag.append(container);
    localStorage.setItem("cart", JSON.stringify(cartArray));
    cartIcon.textContent = cartArray.length;
  });
  totalPriceContainer.append(
    `Total sum: ${Math.round(totalPrice * 100) / 100}`,
    cartPageAtag
  );
}

//eventlisteners to filter search results
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && searchInput.value) {
    location.href = `/index.html?search=${searchInput.value}`;
  }
});
searchBtn.addEventListener("click", () => {
  if (searchInput.value)
    searchTag.href = `/index.html?search=${searchInput.value}`;
});
