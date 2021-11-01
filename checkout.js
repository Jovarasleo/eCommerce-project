const displayItem = document.querySelector("#checkout-app");
const cartIcon = document.querySelector(".cartIcon i");
const body = document.querySelector("body");
const cartTag = document.querySelector(".cart");
const searchInput = document.querySelector(".searchInput");
const searchBtn = document.querySelector(".searchBtn");
const form = document.querySelector(".userInfoForm");

let checkoutArr = [];
let cartArray = JSON.parse(localStorage.getItem("cart"));
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

  if (localStorage.getItem("checkout")) {
    checkoutArr = JSON.parse(localStorage.getItem("checkout"));
    cartRender();
  }
});
function cartRender() {
  let mainContainer = createEl("div", "Container");
  let checkOutInfoContainer = createEl("div", "checkoutInfo__Container");
  let checkOutInfoName = createEl("div", "checkoutInfo__Name");
  let checkOutInfoPrice = createEl("div", "checkoutInfo__Price");
  let checkOutInfoQuantity = createEl("div", "checkoutInfo__Quantity");
  checkOutInfoName.textContent = "Product Name";
  checkOutInfoPrice.textContent = "Price";
  checkOutInfoQuantity.textContent = "Quantity";
  checkOutInfoContainer.append(
    checkOutInfoQuantity,
    checkOutInfoName,
    checkOutInfoPrice
  );
  let toCartPage = createEl("button", "toCartPage");
  toCartPage.textContent = "Order";
  let totalPriceContainer = createEl("div", "totalPrice");
  let totalPrice = 0;
  let container =
    displayItem.querySelector(".checkoutContainer") ||
    createEl("div", "checkoutContainer");
  if (container !== null && container !== "") {
    container.innerHTML = null;
    container.remove();
  }

  let cart = items.filter((item) =>
    checkoutArr.some((selectedItem) => selectedItem.id === item.id)
  );
  if (!cart.length) {
    displayItem.innerHTML = "Thank you for the purchase <br />";
    displayItem.innerHTML += "Redirecting..";
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 3000);
  }
  let form = createEl("form", "form");
  let labelName = createEl("label", "labelName");
  let labelLName = createEl("label", "labeLlName");
  let labelAddress = createEl("label", "labelAddress");
  let labelPhone = createEl("label", "labelPhone");
  let inputName = createEl("input", "inputName");
  let inputLName = createEl("input", "inputLName");
  let inputAddress = createEl("input", "inputAddress");
  let inputPhone = createEl("input", "inputPhone");
  let labelPayment = createEl("label", "labelPayment");
  let inputPayment = createEl("select", "labelPayment");
  let paymentOption = createEl("option", "paymentOption");
  let labelDelivery = createEl("label", "labelPayment");
  let inputDelivery = createEl("select", "labelPayment");
  let deliveryOption = createEl("option", "paymentOption");
  labelDelivery.textContent = "Select delivery:";
  inputDelivery.value = "In Shop";
  deliveryOption.textContent = "In Shop";
  paymentOption.value = "Cash";
  paymentOption.textContent = "Cash";
  labelPayment.textContent = "Select payment:";
  labelName.textContent = "First name:";
  labelLName.textContent = "Last name:";
  labelPhone.textContent = "Phone:";
  labelAddress.textContent = "Address:";
  inputDelivery.appendChild(deliveryOption);
  inputPayment.appendChild(paymentOption);
  form.append(
    labelName,
    inputName,
    labelLName,
    inputLName,
    labelAddress,
    inputAddress,
    labelPhone,
    inputPhone,
    labelPayment,
    inputPayment,
    labelDelivery,
    inputDelivery
  );
  cart.forEach((item) => {
    const realIndex = checkoutArr.findIndex((obj) => obj.id === item.id);
    let cartItem = createEl("div", "checkoutItem");
    let cartInfoName = createEl("p", "checkoutitemName");
    let cartInfoPrice = createEl("span", "checkoutitemPrice");
    let select = createEl("span", "Quantity");
    let aTag = createEl("a", "link");
    let itemPrice = 0;
    cartInfoName.textContent = item.name;
    cartInfoPrice.textContent = `${item.price} €`;

    select.textContent = checkoutArr[realIndex].quantity;

    itemPrice = item.price * checkoutArr[realIndex].quantity;
    totalPrice += itemPrice;
    aTag.append(cartInfoName);
    cartItem.append(select, aTag, cartInfoPrice);
    container.append(cartItem);
    mainContainer.append(
      checkOutInfoContainer,
      container,
      totalPriceContainer,
      toCartPage
    );
    displayItem.append(mainContainer, form);
    localStorage.setItem("cart", JSON.stringify(cartArray));
    cartIcon.textContent = cartArray.length;
  });
  totalPriceContainer.append(
    `Total sum: ${Math.round(totalPrice * 100) / 100} €`
  );
  toCartPage.addEventListener("click", () => {
    checkoutArr = [];
    cartArray = [];
    cartIcon.textContent = cartArray.length;
    localStorage.setItem("checkout", JSON.stringify(checkoutArr));
    localStorage.setItem("cart", JSON.stringify(cartArray));
    cartRender();
  });
}
