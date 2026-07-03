"use strict"

const header = document.getElementById("header")
const scroller = document.getElementById("scroller")
const menuToggle = document.getElementById("menu-toggle")
const nav =document.getElementById("nav")
const cartOpen = document.getElementById("cart-open")
const cart = document.getElementById("cart")
const heroImage = document.getElementById("hero__image")
const heroSource = document.getElementById("hero__source")
const gallery = [
    "media/store",
    "media/cafeteria",
    "media/carrot-cake",
    "media/products",
    "media/store-front",
]
let index = 0



function rotateHero(start) {
    heroImage.style.opacity = "0"
    setTimeout(() => {
        index++
        index >= gallery.length ? index = 0 :''
        heroImage.src = `${gallery[index]}.jpg`
        heroSource.srcset = `${gallery[index]}.webp`
        setTimeout(() => {         
            heroImage.style.opacity = "1"
        }, 150);
    }, 150);        
}

function toggleMenu() {
    nav.classList.toggle("no-mobile")
    nav.classList.toggle("header__nav--open")
    menuToggle.classList.toggle("menu--opened")
    header.classList.toggle("header--opened")
}




setInterval(rotateHero, 3000)

window.addEventListener("scroll", () => {
    if (window.scrollY < 100) {
        scroller.classList.add("scroller-hero")
        header.classList.add("header--hero")
    } else {
        scroller.classList.remove("scroller-hero")
        header.classList.remove("header--hero")
    }
})

menuToggle.addEventListener("click", toggleMenu)






fetch("components/cart.html")
.then(response => response.text())
.then(data => {
    cart.innerHTML = data
    const cartClose = document.getElementById("cart-close")

    function openCart() {
        cart.classList.add("cart__opened")
    }

    function closeCart() {
        cart.classList.remove("cart__opened")
        cart.classList.add("cart__closed")
        setTimeout(() => {
            cart.classList.remove("cart__closed")
        }, 300);
    }

    cartOpen.addEventListener("click", openCart)
    cartClose.addEventListener("click", closeCart)
    cart.addEventListener('click', (e) => {
    if (e.target === cart) { closeCart() }
    });
})


const cartCount = document.getElementById("header__cart__count")

cartCount.innerText = "2"
cartCount.style.display= "block"


const btnFilter = document.querySelectorAll(".btn__filter")

btnFilter.forEach ((eachBtn, i) => {
    btnFilter[i].addEventListener("click", () => {
        btnFilter.forEach ((eachBtn, i) => {
            btnFilter[i].classList.add("btn--yellow")
            btnFilter[i].classList.remove("btn--green")
        })
        btnFilter[i].classList.add("btn--green")
        btnFilter[i].classList.remove("btn--yellow")
    })
})


const checkoutSelector = document.querySelectorAll(".selector__option")
const checkoutOption = document.querySelectorAll(".checkout__selector__option")

checkoutSelector.forEach ((eachTitle, i) => {
    checkoutSelector[i].addEventListener("click", () => {
        checkoutSelector.forEach ((eachTitle, i) => {
            checkoutSelector[i].classList.remove("selected")
            checkoutOption[i].classList.add("checkout__hidden")
        })
        checkoutSelector[i].classList.add("selected")
        checkoutOption[i].classList.remove("checkout__hidden")
    })
})

const checkoutPickup = document.querySelectorAll(".pickup__container")

checkoutPickup.forEach ((eachTitle, i) => {
    checkoutPickup[i].addEventListener("click", () => {
        checkoutPickup.forEach ((eachTitle, i) => {
            checkoutPickup[i].classList.remove("selected")
        })
        checkoutPickup[i].classList.add("selected")
    })
})

const btnBack = document.getElementById("btn__back")

btnBack.addEventListener("click", () => {
    window.history.back()
})