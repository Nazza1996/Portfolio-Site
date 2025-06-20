var hamburgerButton;
var hamburgerMenu;
var footer;

document.addEventListener('DOMContentLoaded', () => {
    hamburgerButton = document.getElementById('hamburgerButton');
    hamburgerMenu = document.querySelector('.hamburger-menu');
    footer = document.querySelector('footer');

    hamburgerButton.addEventListener('click', () => {
        hamburgerMenu.style.display = hamburgerMenu.style.display === 'block' ? 'none' : 'block';
    })

    document.querySelectorAll('.hamburger-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburgerMenu.style.display = 'none';
        });
    });
})

function hamburgerLink() {
    hamburgerMenu.style.display = 'none';
}

function switchPage(e) {
    console.log(e.target);
}