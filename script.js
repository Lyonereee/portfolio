// Wait for DOM to fully load before executing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initTypingEffect();
    initSmoothScrolling();
    initNavHighlighting();
    initProjectModals();
    initFormValidation();
    initBackToTop();
    initMobileNav();
});

// Typing effect in hero section
function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    
    // COSMIC VERIFICATION: Ensure the element exists before proceeding
    if (!typingElement) {
        console.error('COSMIC ERROR: The typing-text element does not exist in the DOM!');
        return; // Exit the function if element doesn't exist
    }
    
    const phrases = [
        'Data-Driven Marketer',
        'SEO Specialist',
        'Web Analyst',
        'Digital Marketing Enthusiast'
    ];
    let phraseIndex = 0;
    let letterIndex = 0;
    let currentPhrase = '';
    let isDeleting = false;
    let isEnd = false;

    // Function to type letters
    function type() {
        // Set end of phrase delay longer than other delays
        const delayTime = isEnd ? 1000 : isDeleting ? 50 : 100;
        
        // Current phrase being typed
        currentPhrase = phrases[phraseIndex];
        
        // If in deleting state, remove last character, else add next character
        if (isDeleting) {
            letterIndex--;
        } else {
            letterIndex++;
        }
        
        // Get the substring of the current phrase
        const displayText = currentPhrase.substring(0, letterIndex);
        
        // Update the typing text with the current text
        typingElement.textContent = displayText;
        
        // If completed typing current phrase
        if (!isDeleting && letterIndex === currentPhrase.length) {
            isEnd = true;
            isDeleting = true;
            setTimeout(type, 1000); // Pause at the end of phrase
            return;
        } else if (isDeleting && letterIndex === 0) {
            isDeleting = false;
            isEnd = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }
        
        // Call type function recursively
        setTimeout(type, delayTime);
    }
    
    // Start the typing effect
    setTimeout(type, 1000);
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    const ctaButtons = document.querySelectorAll('.cta-buttons a');
    const allScrollLinks = [...navLinks, ...ctaButtons];
    
    allScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close mobile menu if open
                const navLinks = document.getElementById('navLinks');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
                
                // Scroll to target section
                window.scrollTo({
                    top: targetSection.offsetTop - 80, // Adjust for navbar height
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Highlight active navigation link based on scroll position
function initNavHighlighting() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        // Add scrolled class to navbar for background change
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Show/hide back to top button
        const backToTop = document.getElementById('backToTop');
        if (window.scrollY > 500) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });
}

// Project modals functionality
function initProjectModals() {
    const projectButtons = document.querySelectorAll('.project-details-btn');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Open modal when project button is clicked
    projectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            const modal = document.getElementById(`${projectId}Modal`);
            
            if (modal) {
                modal.style.display = 'block';
                // Add a small delay before adding the active class for the animation
                setTimeout(() => {
                    modal.classList.add('active');
                }, 10);
                document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
            }
        });
    });
    
    // Close modal when close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.classList.remove('active');
            // Wait for the fade out animation to complete before hiding
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Re-enable scrolling
            }, 300); // Match this with the CSS transition time
        });
    });
    
    // Close modal when clicking outside of modal content
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                // Wait for the fade out animation to complete before hiding
                setTimeout(() => {
                    this.style.display = 'none';
                    document.body.style.overflow = 'auto'; // Re-enable scrolling
                }, 300); // Match this with the CSS transition time
            }
        });
    });
    
    // Close modal when ESC key is pressed
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                modal.classList.remove('active');
                // Wait for the fade out animation to complete before hiding
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300); // Match this with the CSS transition time
            });
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }
    });
}

// Form validation for contact form
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            // Simple validation
            let isValid = true;
            
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Nama tidak boleh kosong');
                isValid = false;
            } else {
                removeError(nameInput);
            }
            
            if (emailInput.value.trim() === '') {
                showError(emailInput, 'Email tidak boleh kosong');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Format email tidak valid');
                isValid = false;
            } else {
                removeError(emailInput);
            }
            
            if (messageInput.value.trim() === '') {
                showError(messageInput, 'Pesan tidak boleh kosong');
                isValid = false;
            } else {
                removeError(messageInput);
            }
            
            // If form is valid, show success message (in real app, would send data to server)
            if (isValid) {
                // Simulate form submission
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.disabled = true;
                submitButton.textContent = 'Mengirim...';
                
                // Simulate API call delay
                setTimeout(() => {
                    // Reset form
                    contactForm.reset();
                    
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.textContent = 'Pesan Anda telah berhasil dikirim. Terima kasih!';
                    successMessage.style.color = 'var(--secondary-color)';
                    successMessage.style.marginTop = '15px';
                    successMessage.style.padding = '10px';
                    successMessage.style.borderRadius = '4px';
                    successMessage.style.backgroundColor = 'rgba(100, 255, 218, 0.1)';
                    
                    // Add success message after form
                    contactForm.appendChild(successMessage);
                    
                    // Reset button
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    
                    // Remove success message after 5 seconds
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                }, 1500);
            }
        });
    }
    
    // Helper function to show error message
    function showError(input, message) {
        const formGroup = input.parentElement;
        let errorElement = formGroup.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.color = '#ff6b6b';
            errorElement.style.fontSize = '0.8rem';
            errorElement.style.marginTop = '5px';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.style.borderColor = '#ff6b6b';
    }
    
    // Helper function to remove error message
    function removeError(input) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        input.style.borderColor = '';
    }
    
    // Helper function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Back to top button functionality
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        // Show/hide back to top button with throttling for performance
        let lastScrollPosition = 0;
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            lastScrollPosition = window.pageYOffset;
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (lastScrollPosition > 300) {
                        backToTopButton.classList.add('active');
                    } else {
                        backToTopButton.classList.remove('active');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Smooth scroll to top with easing
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add a class for click animation
            backToTopButton.classList.add('clicked');
            
            // Remove the class after animation completes
            setTimeout(() => {
                backToTopButton.classList.remove('clicked');
            }, 300);
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Mobile navigation toggle
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
}