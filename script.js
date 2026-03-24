// Header Scroll Effect
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });
}

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.replace('fa-times', 'fa-bars');
    });
});

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Modal Logic
const modal = document.getElementById('pdf-modal');
const openModalBtn = document.querySelector('.open-modal-btn');
const closeModalBtn = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');

if (openModalBtn) {
    openModalBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    });
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

// Lead Form Validation & Submission
const leadForm = document.getElementById('main-lead-form');
const successMsg = document.querySelector('.success-message');

if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const formData = new FormData(leadForm);
        const nome = formData.get('nome');
        const email = formData.get('email');
        const whatsapp = formData.get('whatsapp');

        // Reset errors
        leadForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

        // Validate Name (at least two words)
        if (nome.trim().split(' ').length < 2) {
            leadForm.querySelector('input[name="nome"]').parentElement.classList.add('error');
            isValid = false;
        }

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            leadForm.querySelector('input[name="email"]').parentElement.classList.add('error');
            isValid = false;
        }

        // Validate WhatsApp (at least 10 digits)
        const phoneDigits = whatsapp.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
            leadForm.querySelector('input[name="whatsapp"]').parentElement.classList.add('error');
            isValid = false;
        }

        if (isValid) {
            // Success state
            leadForm.style.display = 'none';
            successMsg.style.display = 'block';
            
            // In a real scenario, you would send data to your backend here
            console.log('Lead captured:', { nome, email, whatsapp });

            setTimeout(() => {
                closeModal();
                // Reset for next time
                setTimeout(() => {
                    leadForm.style.display = 'block';
                    successMsg.style.display = 'none';
                    leadForm.reset();
                }, 500);
            }, 5000);
        }
    });
}

// Global Contact Form Submission (keeping existing one)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Enviado com sucesso!';
        btn.style.background = '#25d366';
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = '';
            contactForm.reset();
        }, 3000);
    });
}
