const displayItem = document.querySelector("#checkout-app");
const cartIcon = document.querySelector(".cartIcon i");
const body = document.querySelector("body");
const cartTag = document.querySelector(".cart");
const searchInput = document.querySelector(".searchInput");
const searchBtn = document.querySelector(".searchBtn");
const form = document.querySelector(".userInfoForm");
const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

let checkoutArr = [];
let cartArray = JSON.parse(localStorage.getItem("cart"));
let id = location.href.split("=")[1];

window.addEventListener("load", async () => {
  const result = await fetch("/data.json");
  const data = await result.json();

  items = data;

  if (JSON.parse(localStorage.getItem("checkout")).length) {
    checkoutArr = JSON.parse(localStorage.getItem("checkout"));
    checkoutRender();
  } else {
    window.location.href = "/index.html";
  }
});

function createEl(type, elClass) {
  const element = document.createElement(type);
  element.classList = elClass;
  return element;
}
function toLocal() {
  localStorage.setItem("cart", JSON.stringify(cartArray));
}

function checkoutRender() {
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
  let totalPriceContainer = createEl("div", "totalPrice");
  let totalPrice = 0;
  let container =
    displayItem.querySelector(".checkoutContainer") ||
    createEl("div", "checkoutContainer");

  let cart = items.filter((item) =>
    checkoutArr.some((selectedItem) => selectedItem.id === item.id)
  );
  if (!checkoutArr.length) {
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
  let labelEmail = createEl("label", "labelEmail");
  let inputEmail = createEl("input", "inputEmail");
  let Submit = createEl("button", "submit");
  form.method = "get";
  Submit.type = "submit";
  Submit.textContent = "Order";
  labelEmail.textContent = "Email:";
  inputEmail.type = "email";
  inputPhone.type = "tel";
  inputPhone.pattern = "[+][3][7][0][0-9]{8}";
  inputPhone.placeholder = "+370-123-12345";
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
    labelEmail,
    inputEmail,
    labelAddress,
    inputAddress,
    labelPhone,
    inputPhone,
    labelPayment,
    inputPayment,
    labelDelivery,
    inputDelivery,
    Submit
  );
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (
      inputEmail.value.match(mailformat) &&
      inputName.value.length > 2 &&
      inputLName.value.length > 2
    ) {
      checkoutArr = [];
      cartArray = [];
      cartIcon.textContent = cartArray.length;
      localStorage.setItem("checkout", JSON.stringify(checkoutArr));
      toLocal();
      checkoutRender();
    }
  });
  cart.forEach((item) => {
    const realIndex = checkoutArr.findIndex((obj) => obj.id === item.id);
    let cartItem = createEl("div", "checkoutItem");
    let cartInfoName = createEl("p", "checkoutitemName");
    let cartInfoPrice = createEl("span", "checkoutitemPrice");
    let select = createEl("span", "Quantity");
    let aTag = createEl("a", "link");
    let itemPrice = 0;
    aTag.href = `/singleProduct.html?product=${item.id}`;
    cartInfoName.textContent = item.name;
    cartInfoPrice.textContent = `${item.price} €`;

    select.textContent = checkoutArr[realIndex].quantity;

    itemPrice = item.price * checkoutArr[realIndex].quantity;
    totalPrice += itemPrice;
    aTag.append(cartInfoName);
    cartItem.append(select, aTag, cartInfoPrice);
    container.append(cartItem);
    mainContainer.append(checkOutInfoContainer, container, totalPriceContainer);
    displayItem.append(mainContainer, form);
    toLocal();
    cartIcon.textContent = cartArray.length;
  });
  totalPriceContainer.append(
    `Total sum: ${Math.round(totalPrice * 100) / 100} €`
  );
}
