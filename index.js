let items;
fetch('/data.json')
  .then(response => response.json())
  .then(data => items = data);

// [
// {name: "Asus TUF GAMING X570-PLUS (WI-FI)", id:"1", price:197.89, pictures:["https://cdna.pcpartpicker.com/static/forever/images/product/8d7d0435e8a2af93b5d91a1a5dccd476.256p.jpg"], quantity: 2, description:""},
// {name: "Asus ROG STRIX B550-F GAMING (WI-FI)", id:"2", price:197.89, pictures:["https://m.media-amazon.com/images/I/51xfJ2RkmKL.jpg"], quantity: 2, description:""},
// {name: "MSI MAG B550 TOMAHAWK", id:"3", price:197.89, pictures:["https://cdna.pcpartpicker.com/static/forever/images/product/52ee465cbd64b16145232d863524c066.256p.jpg"], quantity: 4, description:""},
// {name: "MSI B550-A PRO", id:"4", price:197.89, pictures:["https://cdna.pcpartpicker.com/static/forever/images/product/662aee2a85bbe3b7e12224e381e57d24.256p.jpg"], quantity: 2, description:""},
// {name: "ASRock B450M Pro4", id:"5", price:197.89, pictures:["https://cdna.pcpartpicker.com/static/forever/images/product/8f8baff091bfd5ef531c7ddb1a602ca4.256p.jpg"], quantity: 3, description:""},
// {name: "Asus ROG STRIX B550-A GAMING", id:"6", price:197.89, pictures:["https://cdna.pcpartpicker.com/static/forever/images/product/5ac88d84f61dd91c0621ac30c4dc5480.256p.jpg"], quantity: 5, description:""},
// {name: "Asus PRIME B560-PLUS", id:"7", price:197.89, pictures:["https://cdna.pcpartpicker.com/static/forever/images/product/9ff7242b59122ddd64439dea6d70d194.256p.jpg"], quantity: 2, description:""},
// {name: "Asus ROG Strix X570-E Gaming", id:"8", price:197.89, pictures:["https://cdna.pcpartpicker.com/static/forever/images/product/8edda8b2608b4fe4e5c3777f9e6df4fd.256p.jpg"], quantity: 2, description:""},
// {name: "MSI Z490-A PRO", id:"9", price:197.89, pictures:["https://cdna.pcpartpicker.com/static/forever/images/product/20b2f4cc60ded2ad4529beae7b0dda14.256p.jpg"], quantity: 7, description:""},
// {name: "MSI B550M PRO-VDH WIFI", id:"10", price:197.89, pictures:["https://cdna.pcpartpicker.com/static/forever/images/product/57b4a5399dc626e9c5786f786aeb94ac.256p.jpg"], quantity: 2, description:""},
// {name: "MSI B450 TOMAHAWK MAX", id:"11", price:197.89, pictures:["https://cdna.pcpartpicker.com/static/forever/images/product/0a8a0ca77620c63b68fec6323537d50a.256p.jpg"], quantity: 1, description:""}];


const appItems = document.querySelector("#app-items");
const cartIcon = document.querySelector(".cartIcon i");
const body = document.querySelector("body");
const cartTag = document.querySelector(".cart");
let cartArray = []

function createEl(type, elClass) {
    const element = document.createElement(type);
    element.classList = elClass
    return element;
}
//function to render cart items
function cartRender(){
    let container = cartTag.querySelector(".cartContainer") || createEl("div", "cartContainer");
    if(container!==null && container!== ""){
        container.innerHTML = null;
    }

    let cart = items.filter(item => cartArray.some(selectedItem => selectedItem.id === item.id));
    cart.forEach((item)=>{
    const realIndex = cartArray.findIndex((obj) => obj.id === item.id);
    let cartItem = createEl("div", "cartItem")
    let cartImg = createEl("img", "cartItemImg")
    let cartInfoName = createEl("p", "cartitemName")
    let cartInfoPrice = createEl("span", "cartitemPrice")
    let removeBtn = createEl("button", "removeBtn")
    let select = createEl("input", "selectQuantity")

    cartImg.src = item.pictures[0];
    cartInfoName.textContent = item.name;
    cartInfoPrice.textContent= item.price;

    select.type = "number";
    select.min = 1;
    select.max = item.quantity;
    select.value = quantityCheck();
    function quantityCheck () {
        if(cartArray[realIndex].quantity>item.quantity){
        return select.value = item.quantity}
        else return select.value = cartArray[realIndex].quantity;
    }
    removeBtn.textContent = "remove";

    removeBtn.addEventListener("click",()=>{
        cartArray.splice(realIndex, 1);
        cartIcon.textContent = cartArray.length
        cartRender();
    })

    cartItem.append(cartImg,cartInfoName,cartInfoPrice,removeBtn,select)
    container.append(cartItem)
    cartTag.append(container)
    console.log(cart)
    })
};

//function to render all items in the main page
function render(){
    items.forEach((item)=>{
        let card = createEl("div", "itemCard")
        let cardImg = createEl("img", "itemImg")
        let cardInfo = createEl("div", "info-container")
        let cardInfoName = createEl("p", "itemName")
        let cardInfoPrice = createEl("span", "itemPrice")
        let cardInfoQuantity = createEl("span", "itemQuantity")
        let toCart = createEl("button", "toCartButton")
        let select = createEl("input", "selectQuantity")
        let incBtnplus = createEl("button", "selectinc")
        let incBtnminus = createEl("button", "selectdec")
        let quantityContainer = createEl("span", "quantityContainer")

        incBtnplus.textContent = "+"
        incBtnminus.textContent = "-"

        select.type = "number";
        select.min = 1;
        select.value = select.min;
        select.max = item.quantity;

        incBtnplus.addEventListener("click",()=>{incrementValue(select, item.quantity)})
        incBtnminus.addEventListener("click",()=>{decrementValue(select, item.quantity)})

        cardInfoQuantity.textContent = `Stock: ${item.quantity}`;
        cardInfoName.textContent = item.name;
        cardInfoPrice.textContent = `${item.price}$`;
        toCart.textContent = "Add to cart"
        toCart.addEventListener("click",()=>{
            if (select.value>0 && select.value <= item.quantity){
                    console.log(item.id);
                    if (cartArray.some(o => o.id == item.id)) {
                        cartArray.find(o => o.id == item.id).quantity += Number(select.value);
                      } else {cartArray.push({id: item.id, quantity: Number(select.value)})}
                    }
            console.log(item.id, select.value,"cartArray:",cartArray);
            cartIcon.textContent = cartArray.length
            cartRender(cartArray, items);
        })
        quantityContainer.append(incBtnminus,select,incBtnplus)
        cardInfo.append(cardInfoName,cardInfoPrice, cardInfoQuantity)
        card.append(cardImg,cardInfo,quantityContainer,toCart);
        appItems.appendChild(card);
        cardImg.src = item.pictures[0];
    })
}

window.addEventListener("load",()=>{
    render()
})
//hide 
cartIcon.addEventListener("click",() => {
    cartTag.classList.toggle("is-active")
})
//increase decrease functions to select quantity
function incrementValue(select, quantity)
{
    var value = parseInt(select.value, quantity);
    value = isNaN(value) ? 0 : value;
    if(value<quantity){
        value++;
            select.value = value;
    }
}
function decrementValue(select, quantity)
{
    var value = parseInt(select.value, quantity);
    value = isNaN(value) ? 0 : value;
    if(value>1){
        value--;
        select.value = value;
    }

}