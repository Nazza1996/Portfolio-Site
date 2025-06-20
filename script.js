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
            await loadProjectsPage();
        }
    }
}

async function loadProjectsPage() {
    let projectsData = [];
    await fetch('/projects.json')
        .then(response => response.json())
        .then(data => {
            projectsData = data;
        })
        .catch(error => console.error('Error loading projects: ', error));

    const projectsContainer = document.querySelector('.projects-container');
    projectsData.forEach((project, index) => {
        const projectItem = createProjectItem(project, index);
        projectsContainer.appendChild(projectItem);
    });

    const projectModal = document.querySelector('#projectModal');
    projectModal.addEventListener('click', () => {
        projectModal.classList.remove('show');
        setTimeout(() => {
            projectModal.style.display = 'none';
            tags.innerHTML = '';
        }, 300);
    });
}

function createProjectItem(project, index) {
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

function renderProjectModal({ image, title, shortDescription, longDescription, techStack }) {
  const projectModal = document.querySelector('#projectModal');
  const modalContent = projectModal.querySelector('.modal-content');
  const tags = projectModal.querySelector('.tags');

  projectModal.querySelector('.top img').src = image || '';
  projectModal.querySelector('.title').textContent = title || 'Untitled';
  projectModal.querySelector('.short-description').textContent = shortDescription;
  projectModal.querySelector('.long-description').textContent = longDescription;

  let tagsHTML = "";
  for (const i in techStack) {
    var tech = techStack[i]
    tagsHTML += `
        <span><i class="fab fa-${tech.css} tag-icon"></i>${tech.name}</span>
    `;
  }
  tags.innerHTML = tagsHTML;

  projectModal.style.display = 'flex';
  requestAnimationFrame(() => {
    projectModal.classList.add('show');
  });

  modalContent.addEventListener('click', (event) => event.stopPropagation());
}