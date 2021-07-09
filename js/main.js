//sections
let main = document.querySelector('#main')
let single = document.querySelector('#single')
let order = document.querySelector('#order')
let allProducts = document.querySelector('.allProducts')
let showProducts = allProducts.querySelector('#products')
let formOrder = document.querySelector('#orderForm')

//singlePage
let singlelink = document.querySelector('#singlelink')
let shop = document.querySelector('#shop p')

let popularArticles = document.querySelector('#popularArticles')

let basket = []
let ukupaniznos;
let indexCustomer = 0;
let edit = false

popularProducts()
showAllProducts("all")

function popularProducts() {
    let text = ""

    products.forEach(element => {
        text += `
       <a class="item border d-block" href="javascript:showSinglePage(${element.id})">
                <div class="holder">
                    <img src="img/${element.image}" alt="">
                </div>
                <h5>${element.name}</h5>
        </a>
       
       `
    });
    text += "</article>"

    popularArticles.innerHTML = text;
}

function showAllProducts(filter) {
    let text = ``
    if (filter !== "All") {
        text += `<div class="d-flex flex-row justify-content-center align-items-center flex-wrap "> `
    }

    products.forEach(element => {
        if (filter === "All") {
            text += addItem(element)
        }

        if (filter === element.category) {
            text += `
            <div class="owl-item cloned mb-3" style="width: 277.5px; margin-right: 10px;">`
            text += addItem(element)
            text += `</div>`
        }

    });

    if (filter !== "All") {
        text += `</div>`
    }

        function addItem(element) {
            let text = `
                <a class="item border d-block" href="javascript:showSinglePage(${element.id})">
                    <div class="holder">
                        <img src="img/${element.image}" alt="">
                    </div>
                    <div class="text">
                        <h5>${element.name}</h5>`
                    text += createStarsForProduct(element, "allProducts")

                    text += `  
                        <div class="price">
                            <span>${element.price}</span><span>&nbsp;EUR</span>
                        </div>
                    </div>
                </a>`
            return text
        }

    showProducts.innerHTML = text
}


function showSinglePage(id) {

    setDisplay("none", "block", "none", "none", "none");

    let product = {}

    products.forEach((element, index) => {
        console.log(element.id)
        if (element.id == id) {
            product = element
        }
    });

    let text = `
                <article class="pl-5 d-flex flex-row justify-content-between align-items-center">
                    <div class="image text-center">
                        <img src="img/${product.image}">
                    </div>
                    <div class="opis">
                        <h4 class="text-cleft mt-5 display-4 pb-2">${product.name}</h4>
                        <hr>
                        <div class="d-flex flex-row justify-content-end"><p id='price'>${product.price}</p><span>EUR</span></div>
                        <p>${product.description}</p>
                        <p>Stars: ${product.stars}</p>
                        <div class="stars">
                `

    text += createStarsForProduct(product, "single") + `</div>`

    text += `<hr>
                    <p class="mt-5">Porucite proizvod:</p>
                     <div class="d-flex flex-row justify-content-start">
                            <input type="text" class="quantity form-control"`

    basket.forEach(element => {
        if (element.id == product.id) {
            text += `
                                         value="${element.quantity}"
                                    `
        }
    });
    text += `
                                 width="50%" placeholder="Quantity of product" name="quantity">   
                            <button id="order" data-id="${product.id}" productname="${product.name}" class="btn btn-primary ml-2">`

    if (edit) {
        text += 'Izmeni'
    } else {
        text += 'Naruci'
    }

    text += `</button>
                    </div>
                    
                </div>              
            </article>
    `

    single.innerHTML = text;
    let order = document.querySelector('#order')
    order.addEventListener('click', ubaciUkorupu);

    //add listener on stars rating                        
    let starssingle = document.querySelectorAll(`#starsingle`)
    starssingle.forEach(star => {
        star.addEventListener('click', oceni)
    });

}

function oceni() {

    alert("Samo registrovani korisnici imaju pravo da ocene proizvod.")

    /*  console.log(this)
     if(this.classList.contains('checked')){
         this.classList.remove('checked')
     } else {
         this.classList.add('checked')
     } */

}

function ubaciUkorupu() {
    if (edit) {
        basket.forEach(element => {
            if (element.id == this.getAttribute('data-id')) {
                element.quantity = document.querySelector('.quantity').value
            }
        });
    } else {
        let order = {
            id: this.getAttribute("data-id"),
            nameProduct: this.getAttribute("productname"),
            iznos: document.querySelector('#price').innerHTML,
            quantity: document.querySelector('.quantity').value
        }
        basket.push(order)
    }

    shop.innerHTML = basket.length

    ukupanIznosPorudzbe()

    if (edit) {
        edit = false
        orderForm()
    } else {
        setDisplay("block", "none", "none", "block", "none")
    }

}

function ukupanIznosPorudzbe() {
    let ukupno = document.querySelector('#ukupno')
    ukupaniznos = 0;

    for (let i = 0; i < basket.length; i++) {
        ukupaniznos += basket[i].iznos * basket[i].quantity
    }

    ukupno.innerHTML = ukupaniznos
}

function orderForm() {
    console.log(basket)

    let text = ''
    text += `
    <h3>Order</h3> 
    <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Product</th>
            <th scope="col">Quantity</th>
            <th scope="col">Price</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody> `
    let counter = 1
    basket.forEach(element => {

        text += `
            <tr>
                <th scope="row">${counter++}</th>
                <td>${element.nameProduct}</td>
                <td>${element.quantity}</td>
                <td>${parseInt(element.iznos) * parseInt(element.quantity)}&nbsp;<span>EUR</span></td>
                <td><button id="edit" data-id="${element.id}" class="btn btn-primary form-control">Edit</td>
                <td><button id="delete" data-id="${element.id}" class="btn btn-warning form-control">Delete</td>
            </tr>
  
            `
    });

    text += `
        <tr>
            <th scope="row"></th>
            <td></td>
            <td>Ukupno: </td>`
    if (ukupaniznos > 0) {
        text += `<td>${ukupaniznos}&nbsp;<span>EUR</span></td>`
    } else {
        text += `<td>0.00&nbsp;<span>EUR</span></td>`
    }


    text += `</tr>`

    text += `    
        </tbody>
      </table>
    `

    text += `
    
    <form class="p-5 mt-5">
    <h3 class="mb-5 text-center">Delivery details</h3>
    <div class="form-row">
      <div class="form-group col-md-6">
        <input type="text" class="form-control" id="customerName" placeholder="Name" value="">
      </div>
      <div class="form-group col-md-6">
        <input type="text" class="form-control" id="lastName" placeholder="Last name" value="">
      </div>
    </div>
    <div class="form-group">
      <input type="email" class="form-control" id="email" placeholder="Email" value="">
    </div>
    <div class="form-group">
      <input type="text" class="form-control" id="inputAddress" placeholder="Address" value="">
    </div>
    <div class="form-row">
      <div class="form-group col-md-6">
        <input type="text" class="form-control" id="inputCity" placeholder="City" value="">
      </div>
      <div class="form-group col-md-4">
        <select id="inputState" class="form-control">
          <option selected>Choose...</option>
          <option>Serbia</option>
          <option>Hungary</option>
        </select>
      </div>
      <div class="form-group col-md-2">
        <input type="text" class="form-control" id="inputZip" placeholder="Zip" value="">
      </div>
    </div>
    <button id="orderbutton" type="button" class="btn btn-warning px-5 mt-3">Order</button>
  </form>`

    formOrder.innerHTML = text;

    setListenerForEditDeleteBtn()
    setDisplay("none", "none", "none", "none", "block")

    let buttonOrder = document.querySelector('#orderbutton')
    buttonOrder.addEventListener('click', sendOrder)

}

function deleteOrder() {
    console.log()
    basket.forEach((element, index) => {
        if (element.id === this.getAttribute('data-id')) {
            basket.splice(index, 1)
        }
    });
    ukupanIznosPorudzbe()
    orderForm()
}

function editOrder() {
    edit = true
    showSinglePage(this.getAttribute('data-id'))
}

function sendOrder() {
    indexCustomer++
    let customer = []
    customer = {
        id: indexCustomer,
        name: document.querySelector('#customerName').value,
        lastname: document.querySelector('#lastName').value,
        adress: document.querySelector('#inputAddress').value,
        city: document.querySelector('#inputCity').value,
        postalcode: document.querySelector('#inputZip').value,
        country: "",
        basket: basket
    }

    customers.push(customer)
    location.reload();
    alert("Thank you! Your order is received")
}

function createStarsForProduct(product, page) {
    let i = 0;
    let text = '';
    while (i < product.stars) {
        if (page === "allProducts") {
            text += `<span id="starall" data-id="${product.id}" class="fa fa-star checked"></span>`
        } else {
            text += `<span id="starsingle" data-id="${product.id}" class="fa fa-star checked"></span>`
        }

        i++
    }

    while (i < 5) {
        if (page === "allProducts") {
            text += `<span id="starall" data-id="${product.id}" class="fa fa-star"></span>`
        } else {
            text += `<span id="starsingle" data-id="${product.id}" class="fa fa-star"></span>`
        }

        i++
    }
    return text
}

function setListenerForEditDeleteBtn() {
    let editButtons = document.querySelectorAll('#edit')
    let deleteButtons = document.querySelectorAll('#delete')
    for (let i = 0; i < editButtons.length; i++) {
        editButtons[i].addEventListener('click', editOrder)
        deleteButtons[i].addEventListener('click', deleteOrder)
    }

}

function setDisplay(maindisplay, singledisplay, orderdisplay, allProductsDisplay, orderForm) {
    main.style.display = maindisplay
    single.style.display = singledisplay
    order.style.display = orderdisplay
    allProducts.style.display = allProductsDisplay
    formOrder.style.display = orderForm
}
























$('.carousel').carousel({
    interval: 5000
})

$('.owl-carousel').owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    responsive: {
        0: {
            items: 1
        },
        600: {
            items: 3
        },
        1000: {
            items: 4
        }
    }
})