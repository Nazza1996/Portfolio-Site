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
        if (hamburgerMenu.style.display === 'block') {
            document.body.style.overflow = 'hidden';
            scrollToTop();
        } else {
            document.body.style.overflow = '';
        }
    });

    document.querySelectorAll('.hamburger-link').forEach(link => {
        link.addEventListener('click', () => {
            document.body.style.overflow = '';
            hamburgerMenu.style.display = 'none';
        });
    });

    window.addEventListener('hashchange', switchPage)
    switchPage();

    screen.orientation.addEventListener('change', () => {
        hamburgerMenu.style.display = 'none';
    });
});

function scrollToTop(smooth) {
    if (smooth) {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.documentElement.style.scrollBehavior = '';
}

async function switchPage() {
    const hash = window.location.hash.replace('#', '') || 'home';
    const res = await fetch(`sections/${hash}.md`);

    if (res.ok) {
        const md = await res.text();
        const html = marked.parse(md);
        document.getElementById('section-container').innerHTML = sanitizeHtml(html);

        if (hash === 'home') {
            await loadHomePage();
        } else if (hash === 'projects') {
            await loadProjectsPage();
        }
    }
}

function sanitizeHtml(html) {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'a', 'abbr', 'b', 'br', 'blockquote', 'code', 'div', 'em', 'i', 'img', 'li',
            'ol', 'p', 'pre', 'span', 'strong', 'ul', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'table', 'thead', 'tbody', 'tr', 'th', 'td', 'button', 'section', 'article'
        ],
        ALLOWED_ATTR: [
            'href', 'src', 'alt', 'title', 'class', 'id', 'name', 'style', 'target', 'rel',
            'width', 'height', 'type', 'value', 'aria-label', 'aria-hidden', 'role', 'data-*'
        ],
        ALLOW_DATA_ATTR: true,
    });
}

async function loadHomePage() {
    document.title = "Nathan Watkins";
    let experienceData = [];
    await fetch('/experience.json')
        .then(response => response.json())
        .then(data => {
            experienceData = data;
        })
        .catch(error => console.error('Error loading experience: ', error));

    const experienceContainer = document.querySelector('.experience-container');
    experienceData.forEach(experience => {
        const item = createExperienceItem(experience);
        experienceContainer.append(item);
    });
}

function createExperienceItem(experience) {
    const div = document.createElement('div');
    div.classList.add('experience-item');

    div.innerHTML = `
        <div class="experience-date">
            <p>${experience.startDate} - ${experience.endDate}</p>
        </div>
        <div class="experience-box">
            <h2>${experience.position}</h2>
            <h3>${experience.company}</h3>
            <p>${experience.description}</p>
        </div>
    `;
    return div;
}

async function loadProjectsPage() {
    document.title = "Projects - Nathan Watkins";
    let projectsData = [];
    await fetch('/projects.json')
        .then(response => response.json())
        .then(data => {
            projectsData = data;
        })
        .catch(error => console.error('Error loading projects: ', error));

    const projectsContainer = document.querySelector('.projects-container');
    projectsData.forEach(project => {
        const projectItem = createProjectItem(project);
        projectsContainer.appendChild(projectItem);
    });

    const projectModal = document.querySelector('#projectModal');
    projectModal.addEventListener('click', () => {
        closeProjectModal();
    });
}

function createProjectItem(project) {
    const div = document.createElement('div');
    div.classList.add('project-item');

    div.innerHTML = `
        <a><div class="card"><img draggable="false" src="${project.image}" /></div></a>
        <div class="project-item-details">
            <div class="title">${project.title}</div>
            <div class="description">${project.shortDescription}</div>
        </div>
    `;

    div.addEventListener('click', () => renderProjectModal(project));
    return div;
}

function renderProjectModal({ image, title, shortDescription, longDescription, links, techStack }) {
  const projectModal = document.querySelector('#projectModal');
  const modalContent = projectModal.querySelector('.modal-content');
  const linksContainer = projectModal.querySelector('.top .tags');
  const tags = projectModal.querySelector('.bottom .tags');

  projectModal.querySelector('.top img').src = image || '';
  projectModal.querySelector('.title').textContent = title || 'Untitled';
  projectModal.querySelector('.short-description').textContent = shortDescription;
  projectModal.querySelector('.long-description').textContent = longDescription;

  let linksHTML = "";
  for (const i in links) {
    var link = links[i];
    linksHTML += `
        <a href="${link.url}" target="_blank" class="${link.css} tag-icon" title="${link.name}"><span>${link.name}</span></a>
    `;
  }
  linksContainer.innerHTML = linksHTML;

  let tagsHTML = "";
  for (const i in techStack) {
    var tech = techStack[i];
    tagsHTML += `
        <span><i class="fab fa-${tech.css} tag-icon"></i>${tech.name}</span>
    `;
  }
  tags.innerHTML = tagsHTML;

  projectModal.style.display = 'flex';
  scrollToTop();
  requestAnimationFrame(() => {
    document.documentElement.style.overflowY = 'hidden';
    projectModal.classList.add('show');
  });

  modalContent.addEventListener('click', (event) => event.stopPropagation());
  modalContent.querySelector('.back-button button').addEventListener('click', () => closeProjectModal());
}

function closeProjectModal() {
    projectModal.classList.remove('show');
    setTimeout(() => {
        document.documentElement.style.overflowY = 'auto';
        projectModal.style.display = 'none';
        projectModal.querySelector('.bottom .tags').innerHTML = '';
    }, 300);
}