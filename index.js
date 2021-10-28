let items;

const appItems = document.querySelector("#app-items");
const cartIcon = document.querySelector(".cartIcon i");
const body = document.querySelector("body");
const cartTag = document.querySelector(".cart");
const searchInput = document.querySelector(".searchInput");
const searchBtn = document.querySelector(".searchBtn");
let cartArray = [];

function createEl(type, elClass) {
  const element = document.createElement(type);
  element.classList = elClass;
  return element;
}
//function to render cart items
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
    let aTag = createEl("a", "link");
    let itemPrice = 0;
    aTag.href = `/singleProduct.html?product=${item.id}`;

    incBtnplus.textContent = "+";
    incBtnminus.textContent = "-";

    incBtnplus.addEventListener("click", () => {
      incrementValue(select, item.quantity);
      cartArray[realIndex].quantity = Number(select.value);
      localStorage.setItem("cart", JSON.stringify(cartArray));
      cartRender();
    });
    incBtnminus.addEventListener("click", () => {
      decrementValue(select);
      cartArray[realIndex].quantity = Number(select.value);
      localStorage.setItem("cart", JSON.stringify(cartArray));
      cartRender();
    });

    if (item.thumbnail) {
      cartImg.src = item.thumbnail;
    } else if (item.pictures.length) {
      cartImg.src = item.pictures[0];
    } else {
      cartImg.src = "/assets/icons/no-image.png";
    }
    cartInfoName.textContent = item.name;
    cartInfoPrice.textContent = item.price;

    select.type = "number";
    select.min = 1;
    select.max = item.quantity;
    select.value = quantityCheck();
    function quantityCheck() {
      if (cartArray[realIndex].quantity > item.quantity) {
        return (select.value = item.quantity);
      } else return (select.value = cartArray[realIndex].quantity);
    }
    removeBtn.innerHTML = "<i class='fal fa-times'></i>";

    removeBtn.addEventListener("click", () => {
      cartArray.splice(realIndex, 1);
      localStorage.setItem("cart", JSON.stringify(cartArray));
      cartIcon.textContent = cartArray.length;
      cartRender();
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

//function to render all items in the main page
function render() {
  appItems.innerHTML = null;
  items
    .filter((item) => {
      {
        if (item.name.toLowerCase().includes(searchInput.value.toLowerCase())) {
          return item;
        }
      }
    })
    .forEach((item) => {
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

      aTag.href = `/singleProduct.html?product=${item.id}`;
      incBtnplus.textContent = "+";
      incBtnminus.textContent = "-";

      select.type = "number";
      select.min = 1;
      select.value = select.min;
      select.max = item.quantity;

      incBtnplus.addEventListener("click", () => {
        incrementValue(select, item.quantity);
      });
      incBtnminus.addEventListener("click", () => {
        decrementValue(select);
      });

      cardInfoQuantity.textContent = `Stock: ${item.quantity}`;
      cardInfoName.textContent = item.name;
      cardInfoPrice.textContent = `${item.price}$`;
      toCart.textContent = "Add to cart";
      cartIcon.textContent = 0;
      toCart.addEventListener("click", () => {
        if (select.value > 0 && select.value <= item.quantity) {
          if (cartArray.some((o) => o.id == item.id)) {
            cartArray.find((o) => o.id == item.id).quantity += Number(
              select.value
            );
          } else {
            cartArray.push({ id: item.id, quantity: Number(select.value) });
          }
        }
        cartIcon.textContent = cartArray.length;
        cartRender(cartArray, items);
        localStorage.setItem("cart", JSON.stringify(cartArray));
      });
      quantityContainer.append(incBtnminus, select, incBtnplus);
      aTag.append(cardInfoName);
      cardInfo.append(aTag, cardInfoPrice, cardInfoQuantity);
      card.append(cardImg, cardInfo, quantityContainer, toCart);
      appItems.appendChild(card);
      if (item.thumbnail) {
        cardImg.src = item.thumbnail;
      } else if (item.pictures.length) {
        cardImg.src = item.pictures[0];
      } else {
        cardImg.src = "/assets/icons/no-image.png";
      }
    });
}

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
//eventlisteners to filter search results
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    render();
  }
});
searchBtn.addEventListener("click", () => {
  render();
});
searchInput.addEventListener("input", () => {
  if (!searchInput.value) {
    render();
  }
});
window.addEventListener("load", async () => {
  const result = await fetch("/data.json");
  const data = await result.json();

  items = data;
  render(items);

  if (localStorage.getItem("cart")) {
    cartArray = JSON.parse(localStorage.getItem("cart"));
    cartRender();
  }
});
