/* ==========================================================================
   MAHESH BASARKOD — MODERN EDITORIAL DEVELOPER PORTFOLIO
   Interactive Client-side Engine (Vanilla JS)
   Features:
     1. Document Reading Progress Bar
     2. Sticky Header with Scroll Detection
     3. Mobile Navigation Drawer & Keyboard Handling
     4. Dynamic Section Spy (IntersectionObserver Navigation Highlighting)
     5. Typewriter Role Headline Animation
     6. Studio Projects Filter System
     7. 1-Click Clipboard Copy with Feedback Tooltips
     8. Direct Contact Dispatch Form Validation & Mailto Generator
     9. Scroll Reveal Animations (IntersectionObserver)
    10. Dynamic Copyright Year
========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================================================
  // 1. Dynamic Reading Progress Bar
  // ==========================================================================
  const readingProgress = document.getElementById('reading-progress');
  if (readingProgress) {
    window.addEventListener('scroll', () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progressPct = (window.scrollY / totalHeight) * 100;
        readingProgress.style.width = `${Math.min(100, Math.max(0, progressPct))}%`;
      }
    }, { passive: true });
  }


  // ==========================================================================
  // 2. Sticky Header Scroll State
  // ==========================================================================
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }, { passive: true });
  }


  // ==========================================================================
  // 3. Mobile Navigation Drawer & Keyboard Handling
  // ==========================================================================
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobilePanel = document.getElementById('mobile-nav-panel');
  const mobileClose = document.getElementById('mobile-nav-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    if (!mobilePanel || !mobileToggle) return;
    mobilePanel.classList.add('open');
    mobilePanel.setAttribute('aria-hidden', 'false');
    mobileToggle.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobilePanel || !mobileToggle) return;
    mobilePanel.classList.remove('open');
    mobilePanel.setAttribute('aria-hidden', 'true');
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      if (mobilePanel && mobilePanel.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobilePanel && mobilePanel.classList.contains('open')) {
      closeMobileMenu();
    }
  });


  // ==========================================================================
  // 4. Dynamic Section Spy (IntersectionObserver Navigation Highlighting)
  // ==========================================================================
  const trackedSections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-anchor');

  if ('IntersectionObserver' in window && trackedSections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            navAnchors.forEach((anchor) => {
              const href = anchor.getAttribute('href');
              if (href === `#${currentId}`) {
                anchor.classList.add('active');
              } else {
                anchor.classList.remove('active');
              }
            });
          }
        });
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: 0
      }
    );

    trackedSections.forEach((sec) => sectionObserver.observe(sec));
  }


  // ==========================================================================
  // 5. Typewriter Role Headline Animation
  // ==========================================================================
  const roleDynamicText = document.getElementById('role-dynamic-text');
  const rolePhrases = [
    'Full Stack Web Development',
    'Interactive UI & Responsive Web',
    'Scalable RESTful API Systems',
    'Modern Database Architectures',
    'Algorithmic Problem Solving'
  ];

  if (roleDynamicText && !prefersReducedMotion) {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 75;

    function runTypewriter() {
      const currentPhrase = rolePhrases[phraseIndex];

      if (isDeleting) {
        roleDynamicText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 35;
      } else {
        roleDynamicText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 75;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        typingSpeed = 2200; // Pause at completion
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % rolePhrases.length;
        typingSpeed = 400; // Brief pause before typing next
      }

      setTimeout(runTypewriter, typingSpeed);
    }

    setTimeout(runTypewriter, 600);
  }


  // ==========================================================================
  // 6. Studio Projects Filter System
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.editorial-filter-btn');
  const showcaseCards = document.querySelectorAll('.showcase-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter') || 'all';

      showcaseCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category') || '';
        if (filterCategory === 'all' || cardCategory.includes(filterCategory)) {
          card.style.display = 'block';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // ==========================================================================
  // 7. 1-Click Clipboard Copy with Feedback Tooltips
  // ==========================================================================
  function setupCopyButton(btnId, valId, tooltipId) {
    const btn = document.getElementById(btnId);
    const valElem = document.getElementById(valId);
    const tooltip = document.getElementById(tooltipId);
    if (!btn || !valElem || !tooltip) return;

    btn.addEventListener('click', async () => {
      const text = valElem.textContent.trim();
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback
          const tempInput = document.createElement('textarea');
          tempInput.value = text;
          tempInput.style.position = 'fixed';
          tempInput.style.opacity = '0';
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }
        tooltip.textContent = 'Copied!';
        tooltip.classList.add('show');
        setTimeout(() => tooltip.classList.remove('show'), 2000);
      } catch (err) {
        tooltip.textContent = 'Failed';
        tooltip.classList.add('show');
        setTimeout(() => tooltip.classList.remove('show'), 2000);
      }
    });
  }

  setupCopyButton('btn-copy-email', 'contact-email-val', 'tooltip-email');
  setupCopyButton('btn-copy-phone', 'contact-phone-val', 'tooltip-phone');


  // ==========================================================================
  // 8. Direct Contact Dispatch Form Validation & Mailto Generator
  // ==========================================================================
  const contactForm = document.getElementById('contact-dispatch-form');
  const inquiryButtons = document.querySelectorAll('.inquiry-btn');
  const inquiryInput = document.getElementById('inquiry_category');
  const feedbackBanner = document.getElementById('form-feedback-banner');

  inquiryButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      inquiryButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      if (inquiryInput) {
        inquiryInput.value = btn.getAttribute('data-category') || 'General Inquiry';
      }
    });
  });

  if (contactForm && feedbackBanner) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (document.getElementById('form-sender-name')?.value || '').trim();
      const email = (document.getElementById('form-sender-email')?.value || '').trim();
      const subject = (document.getElementById('form-subject')?.value || '').trim();
      const message = (document.getElementById('form-message')?.value || '').trim();
      const category = inquiryInput ? inquiryInput.value : 'General Inquiry';

      // Validation check
      if (!name || !email || !message) {
        feedbackBanner.className = 'form-feedback-banner error';
        feedbackBanner.innerHTML = '<strong>⚠️ Required fields missing:</strong> Please provide your name, valid email address, and message.';
        feedbackBanner.style.display = 'block';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        feedbackBanner.className = 'form-feedback-banner error';
        feedbackBanner.innerHTML = '<strong>⚠️ Invalid email:</strong> Please enter a correctly formatted email address (e.g. name@domain.com).';
        feedbackBanner.style.display = 'block';
        return;
      }

      // Generate direct mailto link
      const emailSubject = encodeURIComponent(`[Portfolio: ${category}] ${subject || 'Inquiry from ' + name}`);
      const emailBody = encodeURIComponent(
        `Hi Mahesh,\n\nName: ${name}\nEmail: ${email}\nInquiry Category: ${category}\n\nMessage:\n${message}\n\n---\nSent via Developer Portfolio`
      );
      const mailtoUrl = `mailto:maheshbasarakod05@gmail.com?subject=${emailSubject}&body=${emailBody}`;

      feedbackBanner.className = 'form-feedback-banner success';
      feedbackBanner.innerHTML = `
        <strong>✓ Thank you, ${name}! Your message details are verified.</strong><br>
        <span style="font-size:0.84rem; opacity:0.95; display:inline-block; margin-top:4px;">
          To dispatch this message directly to Mahesh's inbox, click the button below to launch your email client:
        </span><br>
        <a href="${mailtoUrl}" style="display:inline-flex; align-items:center; gap:6px; margin-top:10px; padding:8px 18px; background:#FF4F18; color:#ffffff; font-weight:700; border-radius:4px; text-decoration:none; font-size:0.86rem;">
          Open Email Client Now ↗
        </a>
      `;
      feedbackBanner.style.display = 'block';
    });
  }


  // ==========================================================================
  // 9. Subtle Scroll Reveal Animations
  // ==========================================================================
  const revealTargets = document.querySelectorAll(
    '.showcase-card, .skill-matrix-panel, .ledger-card, .cert-card, .milestone-card, .editorial-quote-card, .principles-panel, .coordinates-card, .dispatch-form-card'
  );

  revealTargets.forEach((el) => el.classList.add('editorial-reveal'));

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('revealed'));
  }


  // ==========================================================================
  // 10. Automatic Copyright Year
  // ==========================================================================
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }

});
