// Dropdown (desktop)
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        const parent = this.parentElement;
        const isActive = parent.classList.contains('active');
        document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
        if (!isActive) {
            e.preventDefault();
            parent.classList.add('active');
        }
    });
});
window.addEventListener('scroll', function() {
    const header = document.getElementById('main-header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Burger menu (mobile)
var burger = document.getElementById("menu-burger");
var openBtn = document.getElementById("openBtn");
var closeBtn = document.getElementById("closeBtn");

if (openBtn && closeBtn && burger) {
    openBtn.onclick = openNav;
    closeBtn.onclick = closeNav;
}

function openNav() {
    burger.classList.add("active");
}
function closeNav() {
    burger.classList.remove("active");
    // Réinitialise l'affichage des menus
    document.querySelectorAll('.burger-submenu').forEach(sub => sub.classList.remove('active'));
    var mainMenu = document.getElementById('burger-main-menu');
    if (mainMenu) mainMenu.style.display = 'block';
}

// Gestion des sous-menus dans le burger menu
document.querySelectorAll('.burger-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('burger-main-menu').style.display = 'none';
        document.querySelectorAll('.burger-submenu').forEach(sub => sub.classList.remove('active'));
        document.getElementById('submenu-' + this.dataset.target).classList.add('active');
    });
});
document.querySelectorAll('.burger-back').forEach(back => {
    back.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.burger-submenu').forEach(sub => sub.classList.remove('active'));
        document.getElementById('burger-main-menu').style.display = 'block';
    });
});