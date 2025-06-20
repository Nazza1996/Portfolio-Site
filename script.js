var hamburgerButton;
var hamburgerMenu;
var footer;

document.addEventListener('DOMContentLoaded', () => {
    hamburgerButton = document.getElementById('hamburgerButton');
    hamburgerMenu = document.querySelector('.hamburger-menu');
    footer = document.querySelector('footer');

    hamburgerMenu.style.display = 'none';

    hamburgerButton.addEventListener('click', () => {
        hamburgerMenu.style.display = hamburgerMenu.style.display === 'block' ? 'none' : 'block';
    })

    document.querySelectorAll('.hamburger-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburgerMenu.style.display = 'none';
        });
    });

    window.addEventListener('hashchange', switchPage)
    switchPage();

    screen.orientation.addEventListener('change', () => {
        hamburgerMenu.style.display = 'none';
    })

});

function switchPage() {
    const hash = window.location.hash || '#home';
    const allSections = document.querySelectorAll('section');

    allSections.forEach(section => {
        section.classList.remove('active');
    });

    const target = document.querySelector(hash);
    if (target) {
        target.classList.add('active');
    }
}