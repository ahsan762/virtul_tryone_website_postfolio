const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

let projects = JSON.parse(localStorage.getItem('adminProjects') || '[]');
let siteInfo = JSON.parse(localStorage.getItem('adminSiteInfo') || '{}');

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
  }
  if (document.getElementById('dashboard')) {
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
      showDashboard();
    }
  }
});

function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const error = document.getElementById('loginError');

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    sessionStorage.setItem('adminLoggedIn', 'true');
    showDashboard();
  } else {
    error.textContent = 'Invalid username or password. Try admin / admin123';
    error.classList.add('show');
  }
}

function showDashboard() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('dashboard').style.display = 'flex';
  initApp();
}

function checkAuth() {
  if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('loginPage').style.display = 'flex';
    return;
  }
}

function initApp() {
  initNav();
  loadDashboard();
  loadProjects();
  loadSiteInfo();
  loadContacts();
}

function initNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      if (!page) return;
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
      const section = document.getElementById(page);
      if (section) section.classList.add('active');
    });
  });

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    sessionStorage.removeItem('adminLoggedIn');
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('loginForm').reset();
  });
}

function loadDashboard() {
  const totalProjects = projects.length;
  const totalServices = 10;
  const contactCount = siteInfo.email ? 1 : 0;

  document.getElementById('statProjects').textContent = totalProjects;
  document.getElementById('statServices').textContent = totalServices;
  document.getElementById('statContacts').textContent = contactCount;
  document.getElementById('statViews').textContent = '1';

  const recentList = document.getElementById('recentProjects');
  if (recentList) {
    if (projects.length === 0) {
      recentList.innerHTML = '<tr><td colspan="3"><div class="empty-state"><i class="fas fa-folder-open"></i><p>No projects added yet. Add your first project!</p></div></td></tr>';
    } else {
      recentList.innerHTML = projects.slice(-3).reverse().map(p => `
        <tr>
          <td>${p.name}</td>
          <td><span class="skill-tag" style="font-size:0.75rem;padding:3px 10px;background:rgba(108,99,255,0.07);border-radius:12px">${p.category || 'General'}</span></td>
          <td>${p.link ? '<a href="'+p.link+'" target="_blank" style="color:var(--primary)"><i class="fas fa-external-link-alt"></i></a>' : '<span style="color:var(--text-muted)">—</span>'}</td>
        </tr>
      `).join('');
    }
  }
}

function loadProjects() {
  const container = document.getElementById('projectsList');
  if (!container) return;

  if (projects.length === 0) {
    container.innerHTML = '<tr><td colspan="4"><div class="empty-state"><i class="fas fa-folder-open"></i><p>No projects yet. Click "Add Project" to get started.</p></div></td></tr>';
    return;
  }

  container.innerHTML = projects.map((p, i) => `
    <tr>
      <td><strong>${p.name}</strong><br><small style="color:var(--text-muted);font-size:0.75rem">${p.desc ? p.desc.substring(0, 60) + (p.desc.length > 60 ? '...' : '') : ''}</small></td>
      <td><span class="skill-tag" style="font-size:0.75rem;padding:3px 10px">${p.category || 'General'}</span></td>
      <td>${p.link ? '<a href="'+p.link+'" target="_blank" style="color:var(--primary)"><i class="fas fa-external-link-alt"></i> View</a>' : '—'}</td>
      <td>
        <div class="actions">
          <button class="btn btn-secondary btn-sm" onclick="editProject(${i})"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger btn-sm" onclick="deleteProject(${i})"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

document.getElementById('addProjectBtn')?.addEventListener('click', () => openProjectModal());

document.getElementById('projectForm')?.addEventListener('submit', saveProject);
document.getElementById('cancelProject')?.addEventListener('click', closeProjectModal);

function openProjectModal(index) {
  const modal = document.getElementById('projectModal');
  const form = document.getElementById('projectForm');
  const title = document.getElementById('modalTitle');

  if (index !== undefined) {
    title.textContent = 'Edit Project';
    const p = projects[index];
    document.getElementById('projectName').value = p.name || '';
    document.getElementById('projectDesc').value = p.desc || '';
    document.getElementById('projectCategory').value = p.category || '';
    document.getElementById('projectLink').value = p.link || '';
    document.getElementById('projectIndex').value = index;
  } else {
    title.textContent = 'Add Project';
    form.reset();
    document.getElementById('projectIndex').value = '';
  }

  modal.classList.add('show');
}

function closeProjectModal() {
  document.getElementById('projectModal').classList.remove('show');
}

function saveProject(e) {
  e.preventDefault();
  const index = document.getElementById('projectIndex').value;
  const project = {
    name: document.getElementById('projectName').value.trim(),
    desc: document.getElementById('projectDesc').value.trim(),
    category: document.getElementById('projectCategory').value,
    link: document.getElementById('projectLink').value.trim()
  };

  if (!project.name) {
    alert('Please enter a project name');
    return;
  }

  if (index) {
    projects[parseInt(index)] = project;
  } else {
    projects.push(project);
  }

  localStorage.setItem('adminProjects', JSON.stringify(projects));
  closeProjectModal();
  loadProjects();
  loadDashboard();
  showSuccess('Project saved successfully!');
}

function editProject(index) {
  openProjectModal(index);
}

function deleteProject(index) {
  if (confirm('Delete this project?')) {
    projects.splice(index, 1);
    localStorage.setItem('adminProjects', JSON.stringify(projects));
    loadProjects();
    loadDashboard();
    showSuccess('Project deleted.');
  }
}

function loadSiteInfo() {
  const form = document.getElementById('siteInfoForm');
  if (!form) return;

  if (siteInfo.email) document.getElementById('siteEmail').value = siteInfo.email;
  if (siteInfo.phone) document.getElementById('sitePhone').value = siteInfo.phone;
  if (siteInfo.whatsapp) document.getElementById('siteWhatsapp').value = siteInfo.whatsapp;
  if (siteInfo.location) document.getElementById('siteLocation').value = siteInfo.location;
  if (siteInfo.fiverr) document.getElementById('siteFiverr').value = siteInfo.fiverr;
  if (siteInfo.facebook) document.getElementById('siteFacebook').value = siteInfo.facebook;
  if (siteInfo.instagram) document.getElementById('siteInstagram').value = siteInfo.instagram;
  if (siteInfo.linkedin) document.getElementById('siteLinkedin').value = siteInfo.linkedin;
  if (siteInfo.github) document.getElementById('siteGithub').value = siteInfo.github;
  if (siteInfo.youtube) document.getElementById('siteYoutube').value = siteInfo.youtube;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    siteInfo = {
      email: document.getElementById('siteEmail').value.trim(),
      phone: document.getElementById('sitePhone').value.trim(),
      whatsapp: document.getElementById('siteWhatsapp').value.trim(),
      location: document.getElementById('siteLocation').value.trim(),
      fiverr: document.getElementById('siteFiverr').value.trim(),
      facebook: document.getElementById('siteFacebook').value.trim(),
      instagram: document.getElementById('siteInstagram').value.trim(),
      linkedin: document.getElementById('siteLinkedin').value.trim(),
      github: document.getElementById('siteGithub').value.trim(),
      youtube: document.getElementById('siteYoutube').value.trim()
    };
    localStorage.setItem('adminSiteInfo', JSON.stringify(siteInfo));
    loadContacts();
    showSuccess('Site information saved!');
  });
}

function loadContacts() {
  const container = document.getElementById('contactsList');
  if (!container) return;

  const items = [];
  if (siteInfo.email) items.push({ label: 'Email', value: siteInfo.email, icon: 'fa-envelope' });
  if (siteInfo.phone) items.push({ label: 'Phone', value: siteInfo.phone, icon: 'fa-phone' });
  if (siteInfo.whatsapp) items.push({ label: 'WhatsApp', value: siteInfo.whatsapp, icon: 'fab fa-whatsapp' });
  if (siteInfo.location) items.push({ label: 'Location', value: siteInfo.location, icon: 'fa-map-marker-alt' });

  if (items.length === 0) {
    container.innerHTML = '<tr><td colspan="2"><div class="empty-state"><i class="fas fa-address-card"></i><p>No contact info saved. Add your details in Site Settings.</p></div></td></tr>';
  } else {
    container.innerHTML = items.map(c => `
      <tr>
        <td><i class="${c.icon}" style="color:var(--primary);width:20px;margin-right:8px"></i> ${c.label}</td>
        <td>${c.value}</td>
      </tr>
    `).join('');
  }
}

function showSuccess(msg) {
  const el = document.getElementById('successMsg');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}
