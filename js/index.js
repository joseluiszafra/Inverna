"use strict"

const header = document.getElementById("header")
const scroller = document.getElementById("scroller")
const menuToggle = document.getElementById("menu-toggle")
const nav = document.getElementById("nav")
const cartOpen = document.getElementById("cart-open")
const cart = document.getElementById("cart")
const heroImage = document.getElementById("hero__image")
const heroSource = document.getElementById("hero__source")
const popup = document.getElementById("popup")

const btnAll = document.getElementById("btn__all")
const btnBreakfast = document.getElementById("btn__breakfast")
const btnSnacks = document.getElementById("btn__snacks")
const btnSuperfoods = document.getElementById("btn__superfoods")
const btnBaking = document.getElementById("btn__baking")
const btnPantry = document.getElementById("btn__pantry")

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
        index >= gallery.length ? index = 0 : ''
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

function closePopup() {
    popup.classList.remove("popup__active")
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

if (popup) {
    popup.addEventListener('click', (e) => {
        if (e.target === popup) { closePopup() }
    })
}

// Fetch shopping cart
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
.catch(error => console.error(error))

// Fetch shop products
fetch("components/shop.json")
.then(response => response.json())
.then(data => {
    const filterProducts = (category) => {
        const productsToShow = data.filter(data => data.category === category)
        displayProducts(productsToShow)
    }

    btnAll.addEventListener("click", () => {
        displayProducts(data)
    })

    btnBreakfast.addEventListener("click", () => {
        filterProducts("Desayunos")
    })

    btnSnacks.addEventListener("click", () => {
        filterProducts("Snacks")
    })

    btnSuperfoods.addEventListener("click", () => {
        filterProducts("Superfoods")
    })

    btnBaking.addEventListener("click", () => {
        filterProducts("Repostería")
    })

    btnPantry.addEventListener("click", () => {
        filterProducts("Despensa")
    })

    const displayProducts = (productsToShow) => {
        const shopContainer = document.getElementById("shop__container")

        shopContainer.innerHTML = ""

        productsToShow.forEach((product, i) => {
            const createProduct = document.createElement('li')
            createProduct.classList.add('shop__item')
            createProduct.innerHTML = `
                <div class="item__top">
                    <div class="item__img">
                        <picture>
                            <source srcset="media/shop/${product.img}.webp" type="image/webp">
                            <img class="shop__background" src="media/shop/${product.img}.jpg" alt="store" loading="lazy">
                        </picture>
                    </div>
                    <div class="item__info">
                        <div class="item__title">
                            <h3 class="h4">${product.name}</h3>
                            <p class="body">${product.unit}</p>
                        </div>
                        <p class="body">${product.desc}</p>
                        <div class="item__features">
                            <p class="shop__feature feature ${product.features[0]}">${product.tags[0]}</p>
                            <p class="shop__feature feature ${product.features[1]}">${product.tags[1]}</p>
                        </div>
                        
                    </div>
                </div>
                <div class="item__bottom">
                    <h4>${product.price} €</h4>
                    <button class="btn btn--green btn-agregar"><i class="ri-add-line"></i>Agregar</button>
                </div>
            `
            shopContainer.appendChild(createProduct)

            createProduct.addEventListener('click', (e) => {
                if (e.target.closest('.btn-agregar')) return;

                popup.classList.add('popup__active');
                popup.innerHTML = `
                    <div class="popup__block" id="popup__block">
                        <div class="popup__img">
                            <picture>
                                <source srcset="media/shop/${product.img}.webp" type="image/webp">
                                <img class="popup__background" src="media/shop/${product.img}.jpg" alt="store" loading="lazy">
                            </picture>
                        </div>
                        <div class="popup__info">
                            <div class="eyebrow--container">
                                <p class="category feature">${product.category}</p>
                                <p class="shop__feature feature ${product.features[0]}">${product.tags[0]}</p>
                                <p class="shop__feature feature ${product.features[1]}">${product.tags[1]}</p>
                            </div>
                            <div class="popup__title">
                                <h3>${product.name}</h3>
                                <p class="feature">${product.unit}</p>
                            </div>
                            <p class="body">${product.detail}</p>
                            <div class="popup__benefits">
                                <p class="body"><i class="ri-flashlight-line"></i> BENEFICIOS</p>
                                <ul class="popup__benefits__container">
                                    <li><i class="ri-shield-check-line"></i>${product.benefits[0]}</li>
                                    <li><i class="ri-shield-check-line"></i>${product.benefits[1]}</li>
                                    <li><i class="ri-shield-check-line"></i>${product.benefits[2]}</li>
                                </ul>
                            </div>
                            <h5><i class="ri-leaf-line"></i> Ingredientes</h5>
                            <p class="body">${product.ingredients}</p>
                            <div class="popup__bottom">
                                <h4>${product.price} €</h4>
                                <button class="btn btn--green btn-agregar"><i class="ri-add-line"></i>Agregar al carrito</button>
                            </div>
                            <button id="popup-close">
                                <div class="popup__close">
                                    <i class="ri-close-large-line"></i><span class="header__circle"></span>
                                </div>
                            </button>
                        </div>
                    </div>
                `
                const popupClose = document.getElementById("popup-close")
                if (popupClose) {
                    popupClose.addEventListener("click", closePopup)
                }
            })
        })
    }
    displayProducts(data);
})
.catch(error => console.error(error))






// const cartCount = document.getElementById("header__cart__count")

// cartCount.innerText = "2"
// cartCount.style.display = "block"


const btnFilter = document.querySelectorAll(".btn--filter")

btnFilter.forEach((eachBtn, i) => {
    btnFilter[i].addEventListener("click", () => {
        btnFilter.forEach((eachBtn, i) => {
            btnFilter[i].classList.remove("selected")
        })
        btnFilter[i].classList.add("selected")
    })
})


const checkoutSelector = document.querySelectorAll(".selector__option")
const checkoutOption = document.querySelectorAll(".checkout__selector__option")

checkoutSelector.forEach((eachTitle, i) => {
    checkoutSelector[i].addEventListener("click", () => {
        checkoutSelector.forEach((eachTitle, i) => {
            checkoutSelector[i].classList.remove("selected")
            checkoutOption[i].classList.add("checkout__hidden")
        })
        checkoutSelector[i].classList.add("selected")
        checkoutOption[i].classList.remove("checkout__hidden")
    })
})


const checkoutPickup = document.querySelectorAll(".pickup__container")

checkoutPickup.forEach((eachTitle, i) => {
    checkoutPickup[i].addEventListener("click", () => {
        checkoutPickup.forEach((eachTitle, i) => {
            checkoutPickup[i].classList.remove("selected")
        })
        checkoutPickup[i].classList.add("selected")
    })
})




const btnBack = document.getElementById("btn__back")
if (btnBack) {
    btnBack.addEventListener("click", () => {
        window.history.back()
    })
}





