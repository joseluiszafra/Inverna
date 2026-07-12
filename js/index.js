"use strict"

const header = document.getElementById("header")
const scroller = document.getElementById("scroller")
const menuToggle = document.getElementById("menu-toggle")
const nav = document.getElementById("nav")
const heroImage = document.getElementById("hero__image")
const heroSource = document.getElementById("hero__source")

const cartCount = document.getElementById("header__cart__count")
const cartOpen = document.getElementById("cart-open")
const cart = document.getElementById("cart")
const popup = document.getElementById("popup")

const btnFilter = document.querySelectorAll(".btn--filter")

const btnBack = document.getElementById("btn__back")
const checkoutCart = document.getElementById("checkout__cart__container")
const checkoutPrice = document.getElementById("checkout__cart__price")
const checkoutDelivery = document.querySelectorAll(".checkout__delivery-tab")
const checkoutOption = document.querySelectorAll(".checkout__delivery-content")
const checkoutPickup = document.querySelectorAll(".checkout__radio-label")

const gallery = [
    "media/store",
    "media/cafeteria",
    "media/carrot-cake",
    "media/products",
    "media/store-front",
]

let indexGallery = 0
let shopping__cart = JSON.parse(localStorage.getItem("shopping__cart")) || []

const updateCartCheckout = () => {
    if (checkoutCart) {
        checkoutCart.innerHTML = ""
    }

    const totalCheckout = shopping__cart.reduce((acc, e) => acc + e.price * e.quantity, 0)
    if (checkoutPrice) {
        checkoutPrice.innerHTML = `${totalCheckout.toFixed(2)} €`
    }

    shopping__cart.forEach((cartProduct) => {
        const createItem = document.createElement('li')
        createItem.classList.add('checkout__cart__item')
        createItem.innerHTML = `
            <picture>
                <source srcset="media/shop/${cartProduct.img}.webp" type="image/webp">
                <img class="checkout__cart__item__img" src="media/shop/${cartProduct.img}.jpg" alt="" loading="lazy">
            </picture>
            <div class="checkout__cart__item__description">
                <div>
                    <h3 class="body">${cartProduct.name}</h3>
                    <div class="checkout__cart__item__container">
                        <p class="feature">${cartProduct.quantity}</p>
                        <p class="feature">x</p>
                        <p class="feature">${cartProduct.unit}</p>
                    </div>
                </div>
                <p class="no-wrap body">${(cartProduct.quantity * cartProduct.price).toFixed(2)} €</p>
            </div>
        `
        if (checkoutCart) {
            checkoutCart.appendChild(createItem)
        }
    })
}

function rotateHero(start) {
    if (heroImage) {
        heroImage.style.opacity = "0"
        setTimeout(() => {
            indexGallery++
            indexGallery >= gallery.length ? indexGallery = 0 : ''
            heroImage.src = `${gallery[indexGallery]}.jpg`
            heroSource.srcset = `${gallery[indexGallery]}.webp`
            setTimeout(() => {
                heroImage.style.opacity = "1"
            }, 150)
        }, 150)
    }
}

function toggleMenu() {
    nav.classList.toggle("no-mobile")
    nav.classList.toggle("header__nav--open")
    menuToggle.classList.toggle("menu--open")
    header.classList.toggle("header--open")
}

function updateCartCount() {
    if (shopping__cart.length == 0) {
        cartCount.style.display = "none"
    } else {
        cartCount.style.display = "block"
        cartCount.innerText = shopping__cart.reduce((acc, e) => acc + e.quantity, 0)
    }
}

function closePopup() {
    popup.classList.remove("popup--open")
    popup.classList.add("popup--close")
    setTimeout(() => {
        popup.classList.remove("popup--close")
    }, 300)
}

setInterval(rotateHero, 3000)
updateCartCount()
updateCartCheckout()

window.addEventListener("scroll", () => {
    if (window.scrollY < 65) {
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

btnFilter.forEach((eachBtn, i) => {
    btnFilter[i].addEventListener("click", () => {
        btnFilter.forEach((eachBtn, i) => {
            btnFilter[i].classList.remove("selected")
        })
        btnFilter[i].classList.add("selected")
    })
})

if (btnBack) {
    btnBack.addEventListener("click", () => {
        window.history.back()
    })
}

checkoutDelivery.forEach((eachTitle, i) => {
    checkoutDelivery[i].addEventListener("click", () => {
        checkoutDelivery.forEach((eachTitle, i) => {
            checkoutDelivery[i].classList.remove("selected")
            checkoutOption[i].classList.remove("selected")
        })
        checkoutDelivery[i].classList.add("selected")
        checkoutOption[i].classList.add("selected")
    })
})

checkoutPickup.forEach((eachTitle, i) => {
    checkoutPickup[i].addEventListener("click", () => {
        checkoutPickup.forEach((eachTitle, i) => {
            checkoutPickup[i].classList.remove("selected")
        })
        checkoutPickup[i].classList.add("selected")
    })
})

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
        cart.classList.add("cart--open")
        updateCartList()
    }

    function closeCart() {
        cart.classList.remove("cart--open")
        cart.classList.add("cart--close")
        setTimeout(() => {
            cart.classList.remove("cart--close")
        }, 300)
        updateCartCount()
        updateCartCheckout()
    }

    cartOpen.addEventListener("click", openCart)
    cartClose.addEventListener("click", closeCart)
    cart.addEventListener("click", (e) => {
        if (e.target === cart) closeCart()
    })


    const updateCartList = () => {
        cartFull.innerHTML = ""

        const totalCart = shopping__cart.reduce((acc, e) => acc + e.price * e.quantity, 0)
        cartPrice.innerHTML = `${totalCart.toFixed(2)} €`

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
                    <div>
                        <h3>${cartProduct.name}</h3>
                        <p class="feature">${cartProduct.unit}</p>
                    </div>
                    <div class="cart__item__container">
                        <div class="cart__item__input">
                            <button class="product__minus"><i class="ri-subtract-line"></i></button>
                            <p class="feature">${cartProduct.quantity}</p>
                            <button class="product__add"><i class="ri-add-line"></i></button>
                        </div>
                        <div class="cart__item__price">
                            <p class="body">${(cartProduct.quantity * cartProduct.price).toFixed(2)} €</p>
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
                updateCartList()
            })

            const productAdd = createItem.querySelector('.product__add')
            productAdd.addEventListener('click', () => {
                cartProduct.quantity++
                updateCartList()
            })

            const productMinus = createItem.querySelector('.product__minus')
            productMinus.addEventListener('click', () => {
                cartProduct.quantity--
                if (cartProduct.quantity === 0) {
                    const currentIndex = shopping__cart.findIndex(item => item.id === cartProduct.id)
                    if (currentIndex !== -1) shopping__cart.splice(currentIndex, 1)
                }
                updateCartList()
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
    
    const displayProducts = (productsToShow) => {
        const shopContainer = document.getElementById("shop__container")

        if (shopContainer) {
            shopContainer.innerHTML = ""
        }

        productsToShow.forEach((product) => {
            const createProduct = document.createElement('li')
            createProduct.classList.add('shop__product')
            createProduct.innerHTML = `
                <div class="shop__product__top">
                    <div class="shop__product__img">
                        <picture>
                            <source srcset="media/shop/${product.img}.webp" type="image/webp">
                            <img class="shop__background" src="media/shop/${product.img}.jpg" alt="store" loading="lazy">
                        </picture>
                    </div>
                    <div class="shop__product__info">
                        <div class="shop__product__title">
                            <h2 class="h4">${product.name}</h2>
                            <p class="body no-wrap">${product.unit}</p>
                        </div>
                        <p class="body shop__product__desc">${product.desc}</p>
                        <ul class="shop__product__features">
                            <li class="shop__feature feature ${product.features[0]}">${product.tags[0]}</li>
                            <li class="shop__feature feature ${product.features[1]}">${product.tags[1]}</li>
                        </ul>
                    </div>
                </div>
                <div class="shop__product__bottom">
                    <p class="h4">${product.price} €</p>
                    <button class="btn btn--green btn-agregar"><i class="ri-add-line"></i> Agregar</button>
                </div>
            `
            if (shopContainer) {
                shopContainer.appendChild(createProduct)
            }
            
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
                
                updateCartCount()
                localStorage.setItem("shopping__cart", JSON.stringify(shopping__cart))
            }

            
            const addProductBtn = createProduct.querySelector('.btn-agregar')
            addProductBtn.addEventListener("click", (e) => {
                e.stopPropagation() // Prevents the card click event from firing when clicking this button
                addToCart()
                addProductBtn.style = "background-color: var(--color-green)"
                addProductBtn.innerHTML = `<i class="ri-check-line"></i> Añadido`
                setTimeout(() => {
                    addProductBtn.style = "background-color: var(--color-primary)"
                    addProductBtn.innerHTML = `<i class="ri-add-line"></i> Agregar`
                }, 1500)
            })

            createProduct.addEventListener("click", (e) => {
                if (e.target.closest('.btn-agregar')) return

                popup.classList.add('popup--open')
                popup.innerHTML = `
                    <div class="popup__block" id="popup__block">
                        <div class="popup__img">
                            <picture>
                                <source srcset="media/shop/${product.img}.webp" type="image/webp">
                                <img class="popup__background" src="media/shop/${product.img}.jpg" alt="store" loading="lazy">
                            </picture>
                        </div>
                        <div class="popup__info">
                            <ul class="popup__eyebrow">
                                <li class="category feature">${product.category}</li>
                                <li class="shop__feature feature ${product.features[0]}">${product.tags[0]}</li>
                                <li class="shop__feature feature ${product.features[1]}">${product.tags[1]}</li>
                            </ul>
                            <div class="popup__title">
                                <h2 class="h3">${product.name}</h2>
                                <p class="feature">${product.unit}</p>
                            </div>
                            <p class="body">${product.detail}</p>
                            <div class="popup__benefits">
                                <h3 class="body"><i class="ri-flashlight-line"></i> BENEFICIOS</h3>
                                <ul class="popup__benefits__container">
                                    <li class="body"><i class="ri-shield-check-line"></i> ${product.benefits[0]}</li>
                                    <li class="body"><i class="ri-shield-check-line"></i> ${product.benefits[1]}</li>
                                    <li class="body"><i class="ri-shield-check-line"></i> ${product.benefits[2]}</li>
                                </ul>
                            </div>
                            <h4 class="h5"><i class="ri-leaf-line"></i> Ingredientes</h4>
                            <p class="body">${product.ingredients}</p>
                            <div class="popup__bottom">
                                <p class="h4">${product.price} €</p>
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
                    popupAddBtn.addEventListener("click", () => {
                        addToCart()
                        popupAddBtn.style = "background-color: var(--color-green)"
                        popupAddBtn.innerHTML = `<i class="ri-check-line"></i> Añadido al carrito`
                        setTimeout(() => {
                            popupAddBtn.style = "background-color: var(--color-primary)"
                            popupAddBtn.innerHTML = `<i class="ri-add-line"></i> Agregar al carrito`
                        }, 1500)
                    })
                }
                
            })
        })
    }

    btnFilter.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            
            if (category === "Todos") {
                displayProducts(data);
            } else {
                filterProducts(category);
            }
        });
    });

    displayProducts(data)
})
.catch(error => console.error(error))