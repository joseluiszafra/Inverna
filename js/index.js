const header = document.getElementById("header")
const scroller = document.getElementById("scroller")

window.addEventListener("scroll", () => {
    if (window.scrollY < 100) {
        scroller.classList.add("scroller-hero")
        header.classList.add("header-hero")
    } else {
        scroller.classList.remove("scroller-hero")
        header.classList.remove("header-hero")
    }
})

let index = 0
const heroImage = document.getElementById("hero__image")
const heroSource = document.getElementById("hero__source")
const gallery = [
    "media/store",
    "media/cafeteria",
    "media/carrot-cake",
    "media/products",
    "media/store-front",
]

setInterval(rotateHero, 5000)

function rotateHero(start) {
    // if (index >= gallery.length) {
    //     index = 0
    // }
    // heroImage.src = `${gallery[index]}.jpg`
    // heroSource.srcset = `${gallery[index]}.webp`
    // index++

    heroImage.style.opacity = "0"
    setTimeout(() => {
        index++
        index >= gallery.length ? index = 0 :''
        heroImage.src = `${gallery[index]}.jpg`
        heroSource.srcset = `${gallery[index]}.webp`
        setTimeout(() => {         
            heroImage.style.opacity = "100%"
        }, 100);
    }, 100);        
}