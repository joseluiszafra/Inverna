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