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
fetch("/data.json")
  .then((response) => response.json())
  .then((data) => {
    items = data;
    console.log(items);
    render(items[id]);
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
  quantityContainer.append(incBtnminus, select, incBtnplus);
  aTag.append(cardInfoName);
  cardInfo.append(aTag, cardInfoPrice, cardInfoQuantity);
  card.append(cardImg, cardInfo, quantityContainer, toCart);
  displayItem.appendChild(card);
  cardImg.src = items[realIndex].pictures[0];
}
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

    cartImg.src = item.pictures[0];
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
    removeBtn.textContent = "remove";

    removeBtn.addEventListener("click", () => {
      cartArray.splice(realIndex, 1);
      cartIcon.textContent = cartArray.length;
      cartRender();
    });

    cartItem.append(cartImg, cartInfoName, cartInfoPrice, removeBtn, select);
    container.append(cartItem);
    cartTag.append(container);
    console.log(cart);
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
