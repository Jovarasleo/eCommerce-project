let items = [{name: "sweater", id:"1", price:20, pictures:["https://m.media-amazon.com/images/I/81XUHv6pLrL._AC_UX385_.jpg", "https://m.media-amazon.com/images/I/81r3mU1Dr9L._AC_SY500._SX._UX._SY._UY_.jpg"], quantity: 2, description:"warm winter sweater 100% wool"},{name: "sweater", id:"2", price:20, pictures:["https://m.media-amazon.com/images/I/81XUHv6pLrL._AC_UX385_.jpg", "https://m.media-amazon.com/images/I/81r3mU1Dr9L._AC_SY500._SX._UX._SY._UY_.jpg"], quantity: 6, description:"warm winter sweater 100% wool"}, {name: "sweater", id:"3", price:20, pictures:["https://m.media-amazon.com/images/I/81XUHv6pLrL._AC_UX385_.jpg", "https://m.media-amazon.com/images/I/81r3mU1Dr9L._AC_SY500._SX._UX._SY._UY_.jpg"], quantity: 2, description:"warm winter sweater 100% wool"}, {name: "sweater", id:"4", price:20, pictures:["https://m.media-amazon.com/images/I/81XUHv6pLrL._AC_UX385_.jpg", "https://m.media-amazon.com/images/I/81r3mU1Dr9L._AC_SY500._SX._UX._SY._UY_.jpg"], quantity: 2, description:"warm winter sweater 100% wool"}];
const appItems = document.querySelector("#app-items");

function createEl(type, elClass) {
    let element = document.createElement(type);
    element.classList = elClass
    return element;
}
window.addEventListener("load",()=>{
    render()
})
function render(){
    items.forEach((item)=>{
        let card = createEl("div", "itemCard")
        let cardImg = createEl("img", "itemImg")
        let cardInfo = createEl("div", "info-container")
        let cardInfoName = createEl("p", "itemName")
        let cardInfoPrice = createEl("span", "itemPrice")
        let cardInfoQuantity = createEl("span", "itemQuantity")
        let toCart = createEl("button", "toCartButton")
        let select = createEl("select", "selectQuantity")
        function quantity(){
            for (var i = 0; i < item.quantity; i++){
                select.options[select.options.length] = new Option(i+1, i);
              }
        }
        quantity()
        cardInfoQuantity.textContent = `Stock: ${item.quantity}`;
        cardInfoName.textContent = item.name;
        cardInfoPrice.textContent = `${item.price}$`;
        toCart.textContent = "Add to cart"
        toCart.addEventListener("click",()=>{
            console.log(item.id);
        })
        cardInfo.append(cardInfoName,cardInfoPrice, cardInfoQuantity)
        card.append(cardImg,cardInfo,select,toCart);
        appItems.appendChild(card);
        cardImg.src = item.pictures[0];
    })
}