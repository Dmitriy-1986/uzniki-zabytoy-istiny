/* Mobile Menu */
const burgerBtn = document.getElementById('burgerBtn');
const burgerIcon = document.getElementById('burgerIcon');
const navMenu = document.querySelector('.nav-menu');

burgerBtn.addEventListener('click', function() {
    navMenu.classList.toggle('active');

    if (navMenu.classList.contains('active')) {
        burgerIcon.src = './assets/img/icon-close.png';
        document.body.style.overflow = 'hidden';
    } else {
        burgerIcon.src = './assets/img/icon-burger-menu.png';
        document.body.style.overflow = 'visible';
    }
})