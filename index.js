const appItems = document.querySelector("#app-items");
const cartIcon = document.querySelector(".cartIcon i");
const body = document.querySelector("body");
const cartTag = document.querySelector(".cart");
const searchInput = document.querySelector(".searchInput");
const searchBtn = document.querySelector(".searchBtn");

let cartArray = [];
let items;
let id = location.href.split("=")[1];
//load data
window.addEventListener("load", async () => {
  const result = await fetch("/data.json");
  const data = await result.json();

  items = data;
  render(items);

  if (localStorage.getItem("cart")) {
    cartArray = JSON.parse(localStorage.getItem("cart"));
    cartRender();
  }
  if (id) {
    searchInput.value = id;
    render(items);
  }
});
function cartSize() {
  cartIcon.textContent = cartArray.length;
}
function renderAndUpdate() {
  render();
  history.replaceState({}, null, `/index.html?search=${searchInput.value}`);
}
function toLocal() {
  localStorage.setItem("cart", JSON.stringify(cartArray));
  cartRender();
}
function createEl(type, elClass) {
  const element = document.createElement(type);
  element.classList = elClass;
  return element;
}
function incrementValue(select, quantity) {
  let value = Number(select.value, quantity);
  value = isNaN(value) ? 0 : value;
  if (value < quantity) {
    value++;
    select.value = value;
  }
}
function decrementValue(select) {
  let value = Number(select.value);
  value = isNaN(value) ? 0 : value;
  if (value > 1) {
    value--;
    select.value = value;
  }
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
      cardInfoQuantity.textContent = `Stock: ${item.quantity}`;
      cardInfoName.textContent = item.name;
      cardInfoPrice.textContent = `${item.price} €`;
      toCart.textContent = "Add to cart";
      cartSize();

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
        toLocal();
      });
      if (item.thumbnail) {
        cardImg.src = item.thumbnail;
      } else if (item.pictures.length) {
        cardImg.src = item.pictures[0];
      } else {
        cardImg.src = "/assets/icons/no-image.png";
      }
      quantityContainer.append(incBtnminus, select, incBtnplus);
      aTag.append(cardInfoName);
      cardInfo.append(aTag, cardInfoPrice, cardInfoQuantity);
      card.append(cardImg, cardInfo, quantityContainer, toCart);
      appItems.appendChild(card);
    });
}
//function to render cart items
function cartRender() {
  let cartPageAtag = createEl("a", "toCartPagetag");
  let toCartPage = createEl("button", "toCartPage");
  let totalPriceContainer = createEl("div", "totalPrice");
  let container = createEl("div", "cartContainer");
  let totalPrice = 0;
  toCartPage.textContent = "View cart";
  cartPageAtag.href = "/cart.html";
  cartTag.innerHTML = "";
  cartPageAtag.append(toCartPage);
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
    removeBtn.innerHTML = "<i class='fal fa-times'></i>";
    cartInfoName.textContent = item.name;
    cartInfoPrice.textContent = `${item.price} €`;
    cartSize();

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
    select.addEventListener("change", (event) => {
      cartArray[realIndex].quantity = event.target.value;
      toLocal();
    });
    removeBtn.addEventListener("click", () => {
      cartArray.splice(realIndex, 1);
      cartSize();
      toLocal();
    });

    function quantityCheck() {
      if (cartArray[realIndex].quantity > item.quantity) {
        return (select.value = item.quantity);
      } else if (cartArray[realIndex].quantity < 1) {
        return (select.value = 1);
      } else return (select.value = cartArray[realIndex].quantity);
    }
    if (item.thumbnail) {
      cartImg.src = item.thumbnail;
    } else if (item.pictures.length) {
      cartImg.src = item.pictures[0];
    } else {
      cartImg.src = "/assets/icons/no-image.png";
    }

    select.type = "number";
    select.min = 1;
    select.max = item.quantity;
    select.value = quantityCheck();
    itemPrice = item.price * select.value;
    totalPrice += itemPrice;

    quantityContainer.append(incBtnminus, select, incBtnplus);
    aTag.append(cartInfoName);
    cartItem.append(cartImg, aTag, cartInfoPrice, removeBtn, quantityContainer);
    container.append(cartItem);
    cartTag.append(container, totalPriceContainer);

    localStorage.setItem("cart", JSON.stringify(cartArray));
  });
  totalPriceContainer.append(
    `Total: ${Math.round(totalPrice * 100) / 100} €`,
    cartPageAtag
  );
}
//filter search results
document.querySelector("nav").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    renderAndUpdate();
  }
});
searchBtn.addEventListener("click", () => {
  renderAndUpdate();
});
searchInput.addEventListener("input", () => {
  if (!searchInput.value) {
    renderAndUpdate();
  }
});
