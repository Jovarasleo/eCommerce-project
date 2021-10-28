const displayItem = document.querySelector("#app-cart");
const cartIcon = document.querySelector(".cartIcon i");
const body = document.querySelector("body");
const cartTag = document.querySelector(".cart");
const searchInput = document.querySelector(".searchInput");
const searchBtn = document.querySelector(".searchBtn");

let cartArray = [];
let id = location.href.split("=")[1];

function createEl(type, elClass) {
  const element = document.createElement(type);
  element.classList = elClass;
  return element;
}
window.addEventListener("load", async () => {
  const result = await fetch("/data.json");
  const data = await result.json();

  items = data;
  cartRender(items[id]);

  if (localStorage.getItem("cart")) {
    cartArray = JSON.parse(localStorage.getItem("cart"));
    cartRender();
  }
});
function cartRender() {
  let cartPageAtag = createEl("a", "toCartPagetag");
  let toCartPage = createEl("button", "toCartPage");
  toCartPage.textContent = "buy";
  cartPageAtag.href = "/cart.html";
  cartPageAtag.append(toCartPage);
  let totalPriceContainer = createEl("div", "totalPrice");
  let totalPrice = 0;
  let container =
    displayItem.querySelector(".cartContainer") ||
    createEl("div", "cartContainer");
  if (container !== null && container !== "") {
    container.innerHTML = null;
    container.remove();
  }
  if (!container.target) {
    console.log("what");
    displayItem.innerHTML = "Cart is empty";
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
    displayItem.append(container);
    localStorage.setItem("cart", JSON.stringify(cartArray));
    cartIcon.textContent = cartArray.length;
  });
  totalPriceContainer.append(
    `Total sum: ${Math.round(totalPrice * 100) / 100}`,
    cartPageAtag
  );
}
