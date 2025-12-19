document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Highlight Active Nav Link
    // Gets current page filename (e.g., "projects.html")
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        // Checks if the link href matches the current page
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // 2. Dynamic Footer Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 3. Contact Form Submission Simulation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btn = this.querySelector('button');
            const originalText = btn.textContent;
            
            btn.textContent = 'Sending...';
            btn.style.opacity = '0.7';
            
            setTimeout(() => {
                alert('Message Sent Successfully!');
                this.reset();
                btn.textContent = originalText;
                btn.style.opacity = '1';
            }, 1500);
        });
    }
});