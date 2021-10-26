let items;
fetch("/data.json")
  .then((response) => response.json())
  .then((data) => {
    items = data;
    render(items);
  });

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

      aTag.href = `/index2.html?product=${item.id}`;
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
          console.log(item.id);
          if (cartArray.some((o) => o.id == item.id)) {
            cartArray.find((o) => o.id == item.id).quantity += Number(
              select.value
            );
          } else {
            cartArray.push({ id: item.id, quantity: Number(select.value) });
          }
        }
        console.log(item.id, select.value, "cartArray:", cartArray);
        cartIcon.textContent = cartArray.length;
        cartRender(cartArray, items);
      });
      quantityContainer.append(incBtnminus, select, incBtnplus);
      aTag.append(cardInfoName);
      cardInfo.append(aTag, cardInfoPrice, cardInfoQuantity);
      card.append(cardImg, cardInfo, quantityContainer, toCart);
      appItems.appendChild(card);
      cardImg.src = item.pictures[0];
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
  console.log("function fires");
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
