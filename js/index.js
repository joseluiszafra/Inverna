"use strict"

const header = document.getElementById("header")
const scroller = document.getElementById("scroller")
const menuToggle = document.getElementById("menu-toggle")
const nav = document.getElementById("nav")

const cartCount = document.getElementById("header__cart__count")
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
let shopping__cart = JSON.parse(localStorage.getItem("shopping__cart")) || []
          
function rotateHero(start) {
    if (heroImage) {
        heroImage.style.opacity = "0"
        setTimeout(() => {
            index++
            index >= gallery.length ? index = 0 : ''
            heroImage.src = `${gallery[index]}.jpg`
            heroSource.srcset = `${gallery[index]}.webp`
            setTimeout(() => {
                heroImage.style.opacity = "1"
            }, 150)
        }, 150)
    }
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
    if (window.scrollY < 80) {
        scroller.classList.add("scroller-hero")
        header.classList.add("header--hero")
    } else {
        scroller.classList.remove("scroller-hero")
        header.classList.remove("header--hero")
    }
})

menuToggle.addEventListener("click", toggleMenu)

if (popup) {
    popup.addEventListener("click", (e) => {
        if (e.target === popup) closePopup()
    })
}

// Fetch shopping cart
fetch("components/cart.html")
.then(response => response.text())
.then(data => {
    cart.innerHTML = data
    const cartClose = document.getElementById("cart-close")
    const cartEmpty = document.getElementById("cart__empty")
    const cartFull = document.getElementById("cart__full")
    const cartCheckout = document.getElementById("cart__checkout")
    const cartPrice = document.getElementById("cart__price")

    function openCart() {
        cart.classList.add("cart__opened")
        updateCartUI()
    }

    function closeCart() {
        cart.classList.remove("cart__opened")
        cart.classList.add("cart__closed")
        setTimeout(() => {
            cart.classList.remove("cart__closed")
        }, 300)
        if (shopping__cart.length == 0) {
            cartCount.style.display = "none"
        } else {
            cartCount.style.display = "block"
            cartCount.innerText = shopping__cart.reduce((acc, e) => acc + e.quantity, 0)
        }
        updateCartCheckout()
    }

    cartOpen.addEventListener("click", openCart)
    cartClose.addEventListener("click", closeCart)
    cart.addEventListener("click", (e) => {
        if (e.target === cart) closeCart()
    })


    const updateCartUI = () => {
        cartFull.innerHTML = ""

        const total = shopping__cart.reduce((acc, e) => acc + e.price * e.quantity, 0)
        cartPrice.innerHTML = `${total.toFixed(2)} €`

        if (shopping__cart.length == 0) {
            cartEmpty.style.display = "flex"
            cartFull.style.display = "none"
            cartCheckout.style.display = "none"
            localStorage.removeItem("shopping__cart")
        } else {
            cartEmpty.style.display = "none"
            cartFull.style.display = "flex"
            cartCheckout.style.display = "flex"
        }

        shopping__cart.forEach((cartProduct) => {
            const createItem = document.createElement('li')
            createItem.classList.add('cart__item')
            createItem.innerHTML = `
                <picture>
                    <source srcset="media/shop/${cartProduct.img}.webp" type="image/webp">
                    <img class="cart__item__img" src="media/shop/${cartProduct.img}.jpg" alt="" loading="lazy">
                </picture>
                <div class="cart__item__description">
                    <h3>${cartProduct.name}</h3>
                    <p>${cartProduct.unit}</p>
                    <div class="cart__item__container">
                        <div class="cart__item__input">
                            <button class="product__minus"><i class="ri-subtract-line"></i></button>
                            <p>${cartProduct.quantity}</p>
                            <button class="product__add"><i class="ri-add-line"></i></button>
                        </div>
                        <div class="cart__item__price">
                            <p>${cartProduct.quantity * cartProduct.price} €</p>
                            <button class="cart__item__delete"><i class="ri-close-large-line"></i></button>
                        </div>
                    </div>
                </div>
            `
            cartFull.appendChild(createItem)

            const deleteBtn = createItem.querySelector('.cart__item__delete')
            deleteBtn.addEventListener('click', () => {
                const currentIndex = shopping__cart.findIndex(item => item.id === cartProduct.id)
                if (currentIndex !== -1) {
                    shopping__cart.splice(currentIndex, 1)
                }
                updateCartUI()
            })

            const productAdd = createItem.querySelector('.product__add')
            productAdd.addEventListener('click', () => {
                cartProduct.quantity++
                updateCartUI()
            })

            const productMinus = createItem.querySelector('.product__minus')
            productMinus.addEventListener('click', () => {
                cartProduct.quantity--
                if (cartProduct.quantity === 0) {
                    const currentIndex = shopping__cart.findIndex(item => item.id === cartProduct.id)
                    if (currentIndex !== -1) shopping__cart.splice(currentIndex, 1)
                }
                updateCartUI()
            })
            localStorage.setItem("shopping__cart", JSON.stringify(shopping__cart))
        })
    }
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

        productsToShow.forEach((product) => {
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

            // Helper function to handle adding to cart (avoids code repetition)
            const addToCart = () => {
                const repeat = shopping__cart.find((repeatProduct) => repeatProduct.id === product.id)

                if (repeat) {
                    repeat.quantity++
                } else {
                    shopping__cart.push({
                        id: product.id,
                        img: product.img,
                        name: product.name,
                        unit: product.unit,
                        price: product.price,
                        quantity: product.quantity,
                    })
                }
                

                if (shopping__cart.length == 0) {
                    cartCount.style.display = "none"
                } else {
                    cartCount.style.display = "block"
                    cartCount.innerText = shopping__cart.reduce((acc, e) => acc + e.quantity, 0)
                }
                
                localStorage.setItem("shopping__cart", JSON.stringify(shopping__cart))
            }

            // 1. FIX: Scope the selector to 'createProduct' instead of 'document'
            const addProductBtn = createProduct.querySelector('.btn-agregar')
            addProductBtn.addEventListener("click", (e) => {
                e.stopPropagation() // Prevents the card click event from firing when clicking this button
                addToCart()
            })


            createProduct.addEventListener("click", (e) => {
                if (e.target.closest('.btn-agregar')) return

                popup.classList.add('popup__active')
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
                                <button class="btn btn--green btn-agregar-popup"><i class="ri-add-line"></i>Agregar al carrito</button>
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

                const popupAddBtn = popup.querySelector('.btn-agregar-popup')
                if (popupAddBtn) {
                    popupAddBtn.addEventListener("click", addToCart)
                }
                
            })
        })
    }
    displayProducts(data)
})
.catch(error => console.error(error))


if (shopping__cart.length == 0) {
    cartCount.style.display = "none"
} else {
    cartCount.style.display = "block"
    cartCount.innerText = shopping__cart.reduce((acc, e) => acc + e.quantity, 0)
}


const ayuda = document.getElementById("checkout__cart__container")
const otro = document.getElementById("checkout__cart__price")
const updateCartCheckout = () => {
    ayuda.innerHTML = ""

    const total2 = shopping__cart.reduce((acc, e) => acc + e.price * e.quantity, 0)
    otro.innerHTML = `${total2.toFixed(2)} €`

    shopping__cart.forEach((cartProduct) => {
        const createItem = document.createElement('li')
        createItem.classList.add('cart__item')
        createItem.innerHTML = `
            <picture>
                <source srcset="media/shop/${cartProduct.img}.webp" type="image/webp">
                <img class="cart__item__img" src="media/shop/${cartProduct.img}.jpg" alt="" loading="lazy">
            </picture>
            <div class="cart__item__description">
                <div>
                    <h3>${cartProduct.name}</h3>
                    <div class="cart__item__container">
                        <p>${cartProduct.quantity}</p>
                        <p>x</p>
                        <p>${cartProduct.unit}</p>
                    </div>
                </div>
                <p class="cart__item__price">${cartProduct.quantity * cartProduct.price} €</p>
            </div>
        `
        ayuda.appendChild(createItem)

    })
}

updateCartCheckout()




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
