/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC (VANILLA JS)
   Reference: Modern Glassmorphic Dark Tech Portfolio
   Features:
     1. Automatic Copyright Year
     2. Canvas Ambient Particles System
     3. Smooth Custom Cursor (Desktop Only)
     4. Sticky Header & Mobile Drawer
     5. Active Nav Link Highlighting (IntersectionObserver)
     6. Animated Rotating / Typewriter Role Headline
     7. About Me Interactive Tab Switcher
     8. Experience & Skills Category Filter
     9. Interactive Projects Horizontal Slider with Touch & Keyboard
    10. Skill Progress Bars Animation on Scroll
    11. One-Click Copy to Clipboard with Tooltip
    12. Contact Form Validation with Direct Mailto Fallback
    13. Scroll Reveal Animations (IntersectionObserver)
========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================================================
  // 1. Automatic Copyright Year
  // ==========================================================================
  const copyrightYearElem = document.getElementById('copyright-year');
  if (copyrightYearElem) {
    copyrightYearElem.textContent = new Date().getFullYear();
  }

  // ==========================================================================
  // 2. High-Performance Canvas Particles Background
  // ==========================================================================
  const canvas = document.getElementById('particles-canvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    // Particle pool
    const particleCount = Math.min(Math.floor(window.innerWidth / 16), 75);
    const particles = [];
    const colors = [
      'rgba(56, 189, 248, ',   // Cyan
      'rgba(168, 85, 247, ',   // Purple
      'rgba(129, 140, 248, ',  // Indigo
      'rgba(52, 211, 153, '    // Emerald
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        colorBase: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45
      });
    }

    let mouse = { x: null, y: null, maxDist: 120 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    }, { passive: true });

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse gentle interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.maxDist) {
            const force = (1 - dist / mouse.maxDist) * 0.6;
            p.x += (dx / dist) * force * 2;
            p.y += (dy / dist) * force * 2;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.colorBase + p.alpha + ')';
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const lineAlpha = (1 - dist / 100) * 0.14;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(renderParticles);
    }

    renderParticles();

    // Pause canvas when document hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        renderParticles();
      }
    });
  }

  // ==========================================================================
  // 3. Custom Cursor (Desktop Only)
  // ==========================================================================
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  if (!isTouchDevice && cursorDot && cursorRing && !prefersReducedMotion) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }, { passive: true });

    function animateCursorRing() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();

    // Add scale/glow class on interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, .project-card, .metric-stat-tile, .about-stat-card, .skill-category-card, .experience-card'
    );
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  } else {
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
  }

  // ==========================================================================
  // 4. Header Scroll State & Mobile Navigation Drawer
  // ==========================================================================
  const siteHeader = document.getElementById('site-header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }, { passive: true });

  if (hamburgerBtn && mobileNavDrawer) {
    function toggleMobileMenu() {
      const isOpen = hamburgerBtn.classList.toggle('active');
      mobileNavDrawer.classList.toggle('open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    }

    hamburgerBtn.addEventListener('click', toggleMobileMenu);

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        mobileNavDrawer.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (
        mobileNavDrawer.classList.contains('open') &&
        !mobileNavDrawer.contains(e.target) &&
        !hamburgerBtn.contains(e.target)
      ) {
        hamburgerBtn.classList.remove('active');
        mobileNavDrawer.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavDrawer.classList.contains('open')) {
        hamburgerBtn.classList.remove('active');
        mobileNavDrawer.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ==========================================================================
  // 5. Active Navigation Link Highlighting (IntersectionObserver)
  // ==========================================================================
  const trackedSections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-menu .nav-link');

  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            desktopNavLinks.forEach((link) => {
              const href = link.getAttribute('href');
              if (href === `#${currentId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });

            mobileNavLinks.forEach((link) => {
              const href = link.getAttribute('href');
              if (href === `#${currentId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      {
        rootMargin: '-25% 0px -60% 0px',
        threshold: 0
      }
    );

    trackedSections.forEach((section) => navObserver.observe(section));
  }

  // ==========================================================================
  // 6. Rotating / Typewriter Headline Effect
  // ==========================================================================
  const typedRoleElem = document.getElementById('typed-role-text');
  const roles = [
    'Full Stack Developer',
    'Software Engineer',
    'UI/UX & Web Specialist',
    'Problem Solver & Builder',
    'Computer Science Student'
  ];

  if (typedRoleElem && !prefersReducedMotion) {
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function typeRoles() {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        typedRoleElem.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        typingSpeed = 45;
      } else {
        typedRoleElem.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        typingSpeed = 2200; // Pause at full word
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typingSpeed = 400; // Pause before typing next
      }

      setTimeout(typeRoles, typingSpeed);
    }

    setTimeout(typeRoles, 800);
  }

  // ==========================================================================
  // 7. About Me Interactive Tab Switcher
  // ==========================================================================
  const tabButtons = document.querySelectorAll('.about-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetPane = document.getElementById(`tab-${targetTab}`);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // ==========================================================================
  // 8. Experience Category Filtering
  // ==========================================================================
  const expFilterButtons = document.querySelectorAll('.filter-btn[data-filter]');
  const expCards = document.querySelectorAll('.experience-card');

  expFilterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      expFilterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      expCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================================================
  // 9. Projects Category Filtering & Horizontal Slider System
  // ==========================================================================
  const projectFilterButtons = document.querySelectorAll('.filter-btn[data-project-filter]');
  const projectCards = document.querySelectorAll('.project-card');
  const sliderTrack = document.getElementById('projects-slider-track');
  const sliderViewport = document.getElementById('projects-slider-viewport');
  const prevBtn = document.getElementById('slider-arrow-prev');
  const nextBtn = document.getElementById('slider-arrow-next');
  const dotsRow = document.getElementById('slider-dots-row');

  let currentSlideIndex = 0;
  let visibleCardsCount = 3;

  function updateVisibleCardsCount() {
    const w = window.innerWidth;
    if (w <= 640) {
      visibleCardsCount = 1;
    } else if (w <= 1120) {
      visibleCardsCount = 2;
    } else {
      visibleCardsCount = 3;
    }
  }
  updateVisibleCardsCount();
  window.addEventListener('resize', () => {
    updateVisibleCardsCount();
    updateSliderPosition();
    generateSliderDots();
  }, { passive: true });

  // Get currently displayed project cards (filter-aware)
  function getActiveProjectCards() {
    return Array.from(projectCards).filter((c) => c.style.display !== 'none');
  }

  function getMaxSlideIndex() {
    const active = getActiveProjectCards();
    return Math.max(0, active.length - visibleCardsCount);
  }

  function updateSliderPosition() {
    if (!sliderTrack) return;
    const active = getActiveProjectCards();
    if (active.length === 0) return;

    const maxIdx = getMaxSlideIndex();
    if (currentSlideIndex > maxIdx) currentSlideIndex = maxIdx;
    if (currentSlideIndex < 0) currentSlideIndex = 0;

    // Calculate percentage shift based on visible count
    const cardGap = 24;
    const viewportWidth = sliderViewport ? sliderViewport.clientWidth : 900;
    const cardWidth = (viewportWidth - cardGap * (visibleCardsCount - 1)) / visibleCardsCount;
    const shift = currentSlideIndex * (cardWidth + cardGap);

    sliderTrack.style.transform = `translateX(-${shift}px)`;

    // Update active dots
    const dots = dotsRow.querySelectorAll('.slider-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlideIndex);
    });
  }

  function generateSliderDots() {
    if (!dotsRow) return;
    dotsRow.innerHTML = '';
    const active = getActiveProjectCards();
    const count = getMaxSlideIndex() + 1;

    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${i === currentSlideIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => {
        currentSlideIndex = i;
        updateSliderPosition();
      });
      dotsRow.appendChild(dot);
    }
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      const maxIdx = getMaxSlideIndex();
      currentSlideIndex = currentSlideIndex <= 0 ? maxIdx : currentSlideIndex - 1;
      updateSliderPosition();
    });

    nextBtn.addEventListener('click', () => {
      const maxIdx = getMaxSlideIndex();
      currentSlideIndex = currentSlideIndex >= maxIdx ? 0 : currentSlideIndex + 1;
      updateSliderPosition();
    });
  }

  // Touch Swipe on Project Slider
  if (sliderViewport) {
    let startX = 0;
    let endX = 0;

    sliderViewport.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    sliderViewport.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          // Swiped left -> next
          const maxIdx = getMaxSlideIndex();
          currentSlideIndex = currentSlideIndex >= maxIdx ? 0 : currentSlideIndex + 1;
        } else {
          // Swiped right -> prev
          const maxIdx = getMaxSlideIndex();
          currentSlideIndex = currentSlideIndex <= 0 ? maxIdx : currentSlideIndex - 1;
        }
        updateSliderPosition();
      }
    }, { passive: true });
  }

  // Project Category Filter Handler
  projectFilterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      projectFilterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-project-filter');

      projectCards.forEach((card) => {
        const catString = card.getAttribute('data-pcat') || '';
        if (filterCategory === 'all' || catString.includes(filterCategory)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });

      currentSlideIndex = 0;
      generateSliderDots();
      updateSliderPosition();
    });
  });

  generateSliderDots();
  updateSliderPosition();

  // ==========================================================================
  // 10. Skills Category Filtering & Animated Progress Bars
  // ==========================================================================
  const skillFilterButtons = document.querySelectorAll('.filter-btn[data-skill-filter]');
  const skillCategoryCards = document.querySelectorAll('.skill-category-card');

  skillFilterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      skillFilterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-skill-filter');

      skillCategoryCards.forEach((card) => {
        const cat = card.getAttribute('data-scat');
        if (filterVal === 'all' || cat === filterVal) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Trigger skill bar animation when skills section enters viewport
  const skillProgressFills = document.querySelectorAll('.skill-progress-fill');
  if ('IntersectionObserver' in window) {
    const skillsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            skillProgressFills.forEach((fill) => {
              const targetWidth = fill.getAttribute('data-progress');
              if (targetWidth) {
                fill.style.width = targetWidth;
              }
            });
            skillsObserver.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      skillsObserver.observe(skillsSection);
    }
  } else {
    // Fallback if IntersectionObserver is not available
    skillProgressFills.forEach((fill) => {
      fill.style.width = fill.getAttribute('data-progress') || '80%';
    });
  }

  // ==========================================================================
  // 11. One-Click Copy to Clipboard with Tooltip
  // ==========================================================================
  function setupCopyButton(btnId, textSelector, tooltipId) {
    const btn = document.getElementById(btnId);
    const tooltip = document.getElementById(tooltipId);
    if (!btn || !tooltip) return;

    btn.addEventListener('click', async () => {
      const textElem = document.querySelector(textSelector);
      if (!textElem) return;

      const textToCopy = textElem.textContent.trim();

      try {
        await navigator.clipboard.writeText(textToCopy);
        tooltip.textContent = 'Copied!';
        tooltip.classList.add('show');
        setTimeout(() => tooltip.classList.remove('show'), 2000);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        tooltip.textContent = 'Copied!';
        tooltip.classList.add('show');
        setTimeout(() => tooltip.classList.remove('show'), 2000);
      }
    });
  }

  setupCopyButton('copy-email-btn', '#contact-email-text', 'email-tooltip');
  setupCopyButton('copy-phone-btn', '#contact-phone-text', 'phone-tooltip');

  // ==========================================================================
  // 12. Contact Form Validation with Direct Mailto Fallback
  // ==========================================================================
  const contactForm = document.getElementById('portfolio-contact-form');
  const categoryPills = document.querySelectorAll('.category-pill');
  const inquiryInput = document.getElementById('inquiry-category-input');
  const statusAlert = document.getElementById('form-status-alert');

  categoryPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      categoryPills.forEach((p) => p.classList.remove('selected'));
      pill.classList.add('selected');
      if (inquiryInput) {
        inquiryInput.value = pill.getAttribute('data-category');
      }
    });
  });

  if (contactForm && statusAlert) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();
      const category = inquiryInput ? inquiryInput.value : 'General Inquiry';

      // Validation
      if (!name || !email || !message) {
        statusAlert.className = 'form-feedback-alert error';
        statusAlert.innerHTML = '⚠️ Please fill out all required fields marked with an asterisk (*).';
        statusAlert.style.display = 'block';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        statusAlert.className = 'form-feedback-alert error';
        statusAlert.innerHTML = '⚠️ Please provide a valid email address (e.g. name@domain.com).';
        statusAlert.style.display = 'block';
        return;
      }

      // Success feedback & direct fallback helper
      const mailtoSubject = encodeURIComponent(`[Portfolio: ${category}] ${subject || 'Inquiry from ' + name}`);
      const mailtoBody = encodeURIComponent(`Hi Mahesh,\n\nName: ${name}\nEmail: ${email}\nCategory: ${category}\n\nMessage:\n${message}`);
      const mailtoUrl = `mailto:maheshbasarakod05@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

      statusAlert.className = 'form-feedback-alert success';
      statusAlert.innerHTML = `
        <strong>✓ Thank you, ${name}! Your form details are valid.</strong><br>
        <span style="font-size:0.82rem; opacity:0.9;">
          Note: This static portfolio does not connect to a live backend database yet. 
          To dispatch your message immediately, click below to open your preferred mail app:
        </span><br>
        <a href="${mailtoUrl}" style="display:inline-block; margin-top:8px; padding:6px 14px; background:#10b981; color:#fff; border-radius:9999px; font-weight:600; text-decoration:none;">
          Launch Email Client Now ✉️
        </a>
      `;
      statusAlert.style.display = 'block';
    });
  }

  // ==========================================================================
  // 13. Scroll Reveal Animations (IntersectionObserver)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

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

    revealElements.forEach((elem) => revealObserver.observe(elem));
  } else {
    // If reduced motion is preferred or IntersectionObserver unsupported
    revealElements.forEach((elem) => elem.classList.add('revealed'));
  }

});
