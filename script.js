/* ==========================================================================
   MAHESH BASARKHODA — PERSONAL PORTFOLIO
   Theme: Command Center / Futuristic Dark Glassmorphism
   Client-side Interactive Engine (Vanilla JS)
========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================================================
  // 1. Live Bangalore Clock
  // ==========================================================================
  const liveTimeElem = document.getElementById('live-time');
  function updateLiveTime() {
    if (!liveTimeElem) return;
    try {
      const now = new Date();
      // Format time in Indian Standard Time (Asia/Kolkata)
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      liveTimeElem.textContent = new Intl.DateTimeFormat('en-US', options).format(now);
    } catch (e) {
      liveTimeElem.textContent = new Date().toLocaleTimeString();
    }
  }
  updateLiveTime();
  setInterval(updateLiveTime, 1000);


  // ==========================================================================
  // 2. Typewriter Role Headline Animation
  // ==========================================================================
  const roleTypewriterElem = document.getElementById('role-typewriter');
  const rolePhrases = [
    'Data Science & Machine Learning',
    'Backend Systems & REST APIs',
    'Computer Vision with OpenCV',
    'Database Architecture & Analytics',
    'Autonomous AI & Smart Solutions'
  ];

  if (roleTypewriterElem && !prefersReducedMotion) {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 65;

    function handleTypewriter() {
      const currentPhrase = rolePhrases[phraseIndex];

      if (isDeleting) {
        roleTypewriterElem.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 30;
      } else {
        roleTypewriterElem.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 65;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        typingSpeed = 2200; // Pause when word is completely typed
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % rolePhrases.length;
        typingSpeed = 400; // Pause before typing next word
      }

      setTimeout(handleTypewriter, typingSpeed);
    }

    setTimeout(handleTypewriter, 500);
  }


  // ==========================================================================
  // 3. Mobile Navigation Drawer & Hamburger Menu
  // ==========================================================================
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileNavPanel = document.getElementById('mobile-nav-panel');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-item');

  function openMobileNav() {
    if (!mobileNavPanel || !mobileToggleBtn) return;
    mobileNavPanel.classList.add('open');
    mobileNavPanel.setAttribute('aria-hidden', 'false');
    mobileToggleBtn.classList.add('active');
    mobileToggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMobileNav() {
    if (!mobileNavPanel || !mobileToggleBtn) return;
    mobileNavPanel.classList.remove('open');
    mobileNavPanel.setAttribute('aria-hidden', 'true');
    mobileToggleBtn.classList.remove('active');
    mobileToggleBtn.setAttribute('aria-expanded', 'false');
  }

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', () => {
      const isOpen = mobileNavPanel.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavPanel && mobileNavPanel.classList.contains('open')) {
      closeMobileNav();
    }
  });

  // Close when clicking outside header
  document.addEventListener('click', (e) => {
    const mobileHeader = document.getElementById('mobile-header');
    if (mobileNavPanel && mobileNavPanel.classList.contains('open') && mobileHeader && !mobileHeader.contains(e.target)) {
      closeMobileNav();
    }
  });


  // ==========================================================================
  // 4. Section Scroll Spy (Floating Dock & Active Links)
  // ==========================================================================
  const trackedSections = document.querySelectorAll('section[id]');
  const dockLinks = document.querySelectorAll('.dock-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-item');

  function updateActiveSection(currentId) {
    let activeTarget = currentId;
    if (currentId === 'hero') {
      activeTarget = 'about';
    }

    dockLinks.forEach((link) => {
      const sectionName = link.getAttribute('data-section');
      if (sectionName === activeTarget) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    mobileLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${activeTarget}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Set initial active state to 'about' immediately
  updateActiveSection('about');

  if ('IntersectionObserver' in window && trackedSections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -55% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          updateActiveSection(currentId);
        }
      });
    }, observerOptions);

    trackedSections.forEach((sec) => sectionObserver.observe(sec));
  } else {
    // Scroll fallback
    window.addEventListener('scroll', () => {
      let currentSection = 'about';
      trackedSections.forEach((sec) => {
        const top = sec.offsetTop - 150;
        if (window.scrollY >= top) {
          currentSection = sec.getAttribute('id');
        }
      });
      updateActiveSection(currentSection);
    }, { passive: true });
  }


  // ==========================================================================
  // 5. Project Hub Filter System
  // ==========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filterCategory = tab.getAttribute('data-filter') || 'all';

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category') || '';
        if (filterCategory === 'all' || cardCategory.includes(filterCategory)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });


  // ==========================================================================
  // 6. 1-Click Clipboard Copy with Feedback Tooltips
  // ==========================================================================
  function setupClipboardCopy(buttonId, valueId, tooltipId) {
    const btn = document.getElementById(buttonId);
    const valElem = document.getElementById(valueId);
    const tooltip = document.getElementById(tooltipId);
    if (!btn || !valElem || !tooltip) return;

    btn.addEventListener('click', async () => {
      const textToCopy = valElem.textContent.trim();
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          const tempArea = document.createElement('textarea');
          tempArea.value = textToCopy;
          tempArea.style.position = 'fixed';
          tempArea.style.opacity = '0';
          document.body.appendChild(tempArea);
          tempArea.select();
          document.execCommand('copy');
          document.body.removeChild(tempArea);
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

  setupClipboardCopy('btn-copy-email', 'contact-email-val', 'tooltip-email');
  setupClipboardCopy('btn-copy-phone', 'contact-phone-val', 'tooltip-phone');


  // ==========================================================================
  // 7. Interactive Contact Dispatch Form
  // ==========================================================================
  const inquiryButtons = document.querySelectorAll('.inquiry-pill');
  const inquiryInput = document.getElementById('inquiry-category-input');
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  inquiryButtons.forEach((pill) => {
    pill.addEventListener('click', () => {
      inquiryButtons.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      if (inquiryInput) {
        inquiryInput.value = pill.getAttribute('data-val') || 'General Discussion';
      }
    });
  });

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (document.getElementById('form-name')?.value || '').trim();
      const email = (document.getElementById('form-email')?.value || '').trim();
      const subject = (document.getElementById('form-subject')?.value || '').trim();
      const message = (document.getElementById('form-message')?.value || '').trim();
      const category = inquiryInput ? inquiryInput.value : 'General Discussion';

      // Validation
      if (!name || !email || !message) {
        formFeedback.className = 'form-feedback-box error';
        formFeedback.innerHTML = '⚠️ <strong>Required fields missing:</strong> Please provide your name, email address, and message.';
        formFeedback.style.display = 'block';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formFeedback.className = 'form-feedback-box error';
        formFeedback.innerHTML = '⚠️ <strong>Invalid email format:</strong> Please enter a valid email address (e.g. name@domain.com).';
        formFeedback.style.display = 'block';
        return;
      }

      // Generate direct mailto link to maheshbasarakod05@gmail.com
      const mailSubject = encodeURIComponent(`[Portfolio Inquiry: ${category}] ${subject || 'New Message from ' + name}`);
      const mailBody = encodeURIComponent(
        `Hi Mahesh,\n\nName: ${name}\nEmail: ${email}\nPurpose: ${category}\n\nMessage:\n${message}\n\n---\nSent via Mahesh Basarkhoda Portfolio Website`
      );
      const mailtoUrl = `mailto:maheshbasarakod05@gmail.com?subject=${mailSubject}&body=${mailBody}`;

      formFeedback.className = 'form-feedback-box success';
      formFeedback.innerHTML = `
        <strong>✓ Thank you, ${name}! Your message is prepared.</strong><br>
        <span style="font-size: 0.82rem; opacity: 0.95; display: inline-block; margin-top: 4px;">
          Click the button below to send directly via your mail client to <strong>maheshbasarakod05@gmail.com</strong>:
        </span><br>
        <a href="${mailtoUrl}" style="display: inline-flex; align-items: center; gap: 6px; margin-top: 10px; padding: 8px 18px; background: #0ea5e9; color: #0e1217; font-weight: 700; border-radius: 6px; text-decoration: none; font-size: 0.85rem;">
          <span>Open Email Client &amp; Send</span>
          <span>↗</span>
        </a>
      `;
      formFeedback.style.display = 'block';
    });
  }


  // ==========================================================================
  // 8. Scroll Reveal Animations (GPU Accelerated)
  // ==========================================================================
  const cardsToReveal = document.querySelectorAll(
    '.glass-card, .hero-bio-lead, .hero-pills-wrap, .hero-actions-row'
  );

  cardsToReveal.forEach((el) => el.classList.add('reveal-on-scroll'));

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    cardsToReveal.forEach((el) => revealObserver.observe(el));
  } else {
    cardsToReveal.forEach((el) => el.classList.add('revealed'));
  }


  // ==========================================================================
  // 9. Dynamic Copyright Year
  // ==========================================================================
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }

});
