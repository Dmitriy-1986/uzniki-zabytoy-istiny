/* Footer Year */
const yearElement = document.getElementById('year');
const currentYear = new Date().getFullYear();
yearElement.textContent = currentYear;
/* //Footer Year */

/* Navbar to scroll */
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(0, 0, 0, 0.9)';
        nav.style.position = 'fixed';
    } else {
        nav.style.background = 'transparent';
        nav.style.position = 'absolute';
    }
});
/* //Navbar to scroll */