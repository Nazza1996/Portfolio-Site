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
    });

    document.querySelectorAll('.hamburger-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburgerMenu.style.display = 'none';
        });
    });

    window.addEventListener('hashchange', switchPage)
    switchPage();

    screen.orientation.addEventListener('change', () => {
        hamburgerMenu.style.display = 'none';
    });
});

async function switchPage() {
    const hash = window.location.hash.replace('#', '') || 'home';
    const res = await fetch(`sections/${hash}.md`);

    if (res.ok) {
        const md = await res.text();
        const html = marked.parse(md);
        document.getElementById('section-container').innerHTML = DOMPurify.sanitize(html);

        if (hash === 'projects') {
            document.querySelectorAll('.project-item').forEach(item => {
                item.querySelector('img').onerror = () => {
                    item.style.display = 'none'
                    console.warn(`Could not load image for ${item.querySelector('.title').textContent}. Project has been hidden.`)
                };
            });
        }
    }

}