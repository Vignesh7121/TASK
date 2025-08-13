// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Smooth scrolling for anchor links
const anchorLinks = document.querySelectorAll('a[href^="#"]');
anchorLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Add fixed header on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    }
});

// Before/After Comparison Slider
function setupComparisonSlider() {
    const comparisonContainer = document.querySelector('.comparison-container');
    const beforeImage = document.querySelector('.before-image');
    const comparisonSlider = document.querySelector('.comparison-slider');
    if (!(comparisonContainer && beforeImage && comparisonSlider)) return;
    let isDragging = false;
    function moveSlider(e) {
        if (!isDragging) return;
        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let containerRect = comparisonContainer.getBoundingClientRect();
        let xPosition = clientX - containerRect.left;
        xPosition = Math.max(0, Math.min(xPosition, containerRect.width));
        let percentage = (xPosition / containerRect.width) * 100;
        beforeImage.style.width = percentage + '%';
        comparisonSlider.style.left = percentage + '%';
    }
    comparisonSlider.addEventListener('mousedown', function() {
        isDragging = true;
    });
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
    document.addEventListener('mousemove', moveSlider);
    // Touch support for mobile devices
    comparisonSlider.addEventListener('touchstart', function() {
        isDragging = true;
    });
    document.addEventListener('touchend', function() {
        isDragging = false;
    });
    document.addEventListener('touchmove', function(e) {
        if (e.touches && e.touches.length === 1) {
            moveSlider(e);
        }
    });
}
document.addEventListener('DOMContentLoaded', setupComparisonSlider);

// Contact Form Submission
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    if (!contactForm) return;
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        try {
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
            }
            // Real AJAX form submission to Flask endpoint
            const response = await fetch('/submit-form', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Show success message
            if (successMessage) {
                successMessage.style.display = 'block';
            }
            contactForm.reset();
            // Hide success message after 5 seconds
            if (successMessage) {
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting your form. Please try again.');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        }
    });
}
document.addEventListener('DOMContentLoaded', setupContactForm);

// Example real implementation for AJAX form submission (commented out)
/*
async function submitForm(formData) {
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData)),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
*/