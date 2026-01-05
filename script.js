function createElement(tag, className, textContent) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = textContent;
    return element;
}

const sidePanel = document.querySelector('.hamburger-menu');
const sidePanelOverlay = document.getElementById('hamburger-overlay');
var hamburgerButton = document.getElementById('hamburgerButton');
var footerHomeButton = document.getElementById('footerHomeButton');

document.addEventListener('DOMContentLoaded', () => {
    hamburgerButton.addEventListener('click', () => {
        toggleSidePanel();
    });

    document.querySelectorAll('.hamburger-link').forEach(link => {
        link.addEventListener('click', () => {
            toggleSidePanel(false);
        });
    });

    sidePanelOverlay.addEventListener('click', () => {
        toggleSidePanel(false);
    });

    footerHomeButton.addEventListener('click', () => {
        if (['', '#', '#home'].includes(window.location.hash)) {
            scrollToTop(true);
        } else {
            window.location.hash = '#home';
        }
    });

    window.addEventListener('hashchange', switchPage)
    switchPage();

    screen.orientation.addEventListener('change', (e) => {
        if (e.target.type === 'landscape-primary' || e.target.type === 'landscape-secondary') {
            toggleSidePanel(false);
        }
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

    let qualificationData = [];
    await fetch('/qualifications.json')
        .then(response => response.json())
        .then(data => {
            qualificationData = data;
        })
        .catch(error => console.error('Error loading qualifications: ', error));
    const qualificationsContainer = document.querySelector('.qualification-container');
    qualificationData.forEach(qualification => {
        const item = createQualificationItem(qualification);
        qualificationsContainer.append(item);
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

function createQualificationItem(item) {
    const div = document.createElement('div');
    div.classList.add('experience-item');

    let levelsContainer;
    if (item.levels) {
        levelsContainer = document.createElement('div');
        item.levels.forEach(level => {
            const levelNumber = createElement('p', '', `Level ${level.level} Modules:`);
            levelsContainer.appendChild(levelNumber);

            level.modules.forEach(module => {
                const moduleContent = createElement('div', '', `${module.name} (${module.grade})`);
                levelsContainer.appendChild(moduleContent);
            });
        });
    }

    const date = createElement('div', 'experience-date');
    const dateContent = createElement('p', '', `${item.startDate} - ${item.endDate}`);
    date.appendChild(dateContent);

    const box = createElement('div', 'experience-box');
    const qualification = createElement('h2', '', item.qualification);
    const institution = createElement('h3', '', item.institution);
    box.appendChild(qualification);
    box.appendChild(institution);
    box.append(levelsContainer);

    div.appendChild(date);
    div.appendChild(box);
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


    const cards = projectsContainer.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = -(y - centerY) / 10;
            const rotateY = (x - centerX) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
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

function toggleSidePanel(shouldOpen) {
    if (shouldOpen === undefined) {
        shouldOpen = sidePanel.classList.contains('open') ? false : true;
    }

    function open() {
        sidePanel.classList.add('open');
        sidePanelOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        sidePanel.classList.remove('open');
        sidePanelOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (shouldOpen && shouldOpen === true) {
        open();
    } else {
        close();
    }
}