document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Highlight Active Nav Link
    // Detects the current page to apply the 'active' style in the navbar
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // 2. Dynamic Footer Year
    // Automatically updates the copyright year in the footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 3. Mobile Menu Toggle Logic
    // Handles the opening and closing of the hamburger menu on mobile devices
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            // Toggle the 'active' class to slide the mobile menu in/out
            navLinksContainer.classList.toggle('active');
            
            // Switch the icon between hamburger (bars) and close (times)
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // 4. Close mobile menu when a link is clicked
    // Ensures the menu disappears when navigating to a new section
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
                const icon = hamburger.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
    });
});