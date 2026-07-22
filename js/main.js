// Remove no-js class immediately for JS-enabled users
document.documentElement.classList.remove('no-js');

document.addEventListener('DOMContentLoaded', () => {
  const mainElement = document.querySelector('main');

  // Fade in main content on load
  if (mainElement) {
    mainElement.classList.add('fade-in');
  }

  // Handle smooth page exit transitions
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    const target = link.getAttribute('target');
    
    // Only intercept local, non-empty, non-hash, non-mail links that don't open in a new tab
    if (
      href &&
      !href.startsWith('http') &&
      !href.startsWith('#') &&
      !href.startsWith('mailto:') &&
      target !== '_blank'
    ) {
      link.addEventListener('click', (e) => {
        // Skip if browser supports view transitions natively to avoid conflicts
        if (document.startViewTransition) {
          return;
        }

        if (mainElement) {
          e.preventDefault();
          mainElement.classList.remove('fade-in');
          mainElement.classList.add('fade-out');
          
          setTimeout(() => {
            window.location.href = href;
          }, 300);
        }
      });
    }
  });

  const navbar = document.querySelector('.navbar');

  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };

  // Initial check on load
  handleScroll();

  // Listen for scroll events
  window.addEventListener('scroll', handleScroll);

  // Mobile Menu Logic
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
});
