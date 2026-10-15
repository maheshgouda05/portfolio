
/* ========================================
   1. AUTOMATIC COPYRIGHT YEAR
======================================== */

const yearElement = document.getElementById("current-year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* ========================================
   2. SMOOTH NAVIGATION
======================================== */

const navigationLinks = document.querySelectorAll(
    'nav a[href^="#"], .footer-links a[href^="#"]'
);

navigationLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            event.preventDefault();

            targetElement.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });

            history.replaceState(null, "", targetId);
        }
    });
});


/* ========================================
   3. ACTIVE NAVIGATION LINK
======================================== */

const pageSections = document.querySelectorAll(
    "main section[id]"
);

const navSectionLinks = document.querySelectorAll(
    'nav ul a[href^="#"]'
);

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                navSectionLinks.forEach((link) => {
                    const isActive =
                        link.getAttribute("href") ===
                        `#${entry.target.id}`;

                    if (isActive) {
                        link.setAttribute("aria-current", "location");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            });
        },
        {
            rootMargin: "-25% 0px -60% 0px",
            threshold: 0
        }
    );

    pageSections.forEach((section) => {
        sectionObserver.observe(section);
    });
}


/* ========================================
   4. REVEAL SECTIONS ON SCROLL
======================================== */

// Reveal elements when they enter the viewport.
// The effect is disabled for users who prefer reduced motion.

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

const revealElements = document.querySelectorAll(
    ".section-heading, .about-content, .skill-card, " +
    ".project-card, .education-card, .achievement-card, " +
    ".contact-container"
);

if ("IntersectionObserver" in window && !reduceMotion) {
    revealElements.forEach((element) => {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition =
            "opacity 0.6s ease, transform 0.6s ease";
    });

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";

                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
}


/* ========================================
   5. IMAGE FALLBACK
======================================== */

// If an image fails to load, show a clear fallback.

const portfolioImages = document.querySelectorAll("img");

portfolioImages.forEach((image) => {
    image.addEventListener("error", () => {
        image.alt = image.alt || "Image unavailable";
        image.style.objectFit = "contain";
        image.style.padding = "20px";
        image.style.backgroundColor = "#151923";
    });
});


/* ========================================
   6. CONTACT FORM VALIDATION
======================================== */

// This validates the form in the browser.
// It does NOT send an email or save the message.

const contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!contactForm.reportValidity()) {
            return;
        }

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !subject || !message) {
            alert("Please fill in all the fields.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        alert(
            "Thank you, " + name + "!\n\n" +
            "Your form is valid, but this portfolio does not " +
            "have a message-sending service connected yet."
        );

        // Keep the user's message available for editing.
        // Connect a backend or form service when ready.
    });
}


/* ========================================
   7. EXTERNAL LINKS
======================================== */

// Open external portfolio links in a new tab.
// HTML links should also include rel="noopener noreferrer".

const externalLinks = document.querySelectorAll(
    'a[target="_blank"]'
);

externalLinks.forEach((link) => {
    link.setAttribute("rel", "noopener noreferrer");
});


/* ========================================
   8. CONSOLE MESSAGE
======================================== */

console.log(
    "%cWelcome to my portfolio!",
    "color: #a78bfa; font-size: 18px; font-weight: bold;"
);

console.log(
    "Thanks for checking out the website."
);
