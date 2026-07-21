document.addEventListener('DOMContentLoaded', () => {
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
