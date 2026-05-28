
function copyCommand(btn){
    const commandText = btn.previousElementSibling.innerText;
    navigator.clipboard.writeText(commandText).then(() => {
        alert("Commande copiée dans le presse-papiers !");
    });
}
 
function toggleMenu() {
    document.querySelector('.sidebar').classList.toggle('active');
    document.querySelector('.overlay').classList.toggle('active');
}
 
// Mise en évidence du lien actif dans la sidebar
function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage && linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}
 
// Génération automatique de la TOC sous le lien actif dans la sidebar
function buildTOC() {
    const headings = document.querySelectorAll('.content h2');
    if (headings.length < 1) return;
 
    // Assigner des IDs aux h2
    headings.forEach(h => {
        if (!h.id) {
            h.id = h.textContent
                .toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
        }
    });
 
    // Trouver le lien actif dans la sidebar
    const activeLink = document.querySelector('.nav-sub a.active');
    if (!activeLink) return;
 
    // Créer la TOC et l'insérer juste après le lien actif
    const toc = document.createElement('ul');
    toc.className = 'toc-inline';
 
    headings.forEach(h => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = h.textContent;
        li.appendChild(a);
        toc.appendChild(li);
    });
 
    activeLink.closest('li').appendChild(toc);
 
    // Scroll spy
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const link = toc.querySelector(`a[href="#${id}"]`);
            if (!link) return;
            if (entry.isIntersecting) {
                toc.querySelectorAll('a').forEach(a => a.classList.remove('toc-active'));
                link.classList.add('toc-active');
            }
        });
    }, { rootMargin: '0px 0px -70% 0px', threshold: 0 });
 
    headings.forEach(h => observer.observe(h));
}
 
// Menu arborescent : ouverture/fermeture des groupes
function initTreeMenu() {
    document.querySelectorAll('.nav-group-title').forEach(title => {
        title.addEventListener('click', e => {
            e.preventDefault();
            const group = title.closest('.nav-group');
            const isOpen = group.classList.contains('open');
            document.querySelectorAll('.nav-group').forEach(g => g.classList.remove('open'));
            if (!isOpen) group.classList.add('open');
        });
    });
 
    // Ouvrir automatiquement le groupe contenant la page active
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-sub a').forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
            link.closest('.nav-group')?.classList.add('open');
        }
    });
}
 
document.addEventListener('DOMContentLoaded', () => {
    setActiveLink();
    buildTOC();
    initTreeMenu();
});