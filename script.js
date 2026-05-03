// ============================================================
//  NextGen Analytics — VIP Main Script  (script.js)
//  Sections: Utils · Scroll Progress · Header · Theme
//            Cursor Glow · Hero Typing · Scroll Reveal
//            Profile Parallax · Skills · Experience
//            Certifications · Counters · Scroll-to-Top
//            Project Cards · SEO · Lazy Load · Glow Flash
//            Contact Form (EmailJS)
// ============================================================
(() => {
  "use strict";

  // ── 1. UTILITIES ─────────────────────────────────────────────
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const debounce = (fn, ms = 100) => {
    let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  };
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const lerp  = (a, b, t) => a + (b - a) * t;

  // run after DOM ready
  const ready = fn => {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  };


  // ── 2. SCROLL PROGRESS BAR ───────────────────────────────────
  (() => {
    const bar = document.createElement("div");
    bar.id = "scroll-progress";
    bar.style.cssText = `
      position:fixed; top:0; left:0; height:3px; width:0%;
      background:linear-gradient(90deg,#4b5fff,#6c5fff,#ff4bff);
      z-index:9999; transition:width .1s linear; pointer-events:none;
      box-shadow:0 0 8px rgba(108,95,255,.7);
    `;
    document.body.prepend(bar);

    window.addEventListener("scroll", () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + "%";
    }, { passive: true });
  })();


  // ── 3. HEADER — sticky, active links, mobile ─────────────────
  (() => {
    const header     = $("#header");
    const toggle     = $("#menu-toggle");
    const nav        = $("#nav-menu");
    const navLinks   = $$("#nav-menu a[href^='#']");
    if (!header) return;

    // ─ Sticky + active on scroll ─
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle("sticky", y > 50);

      // active link
      let current = "";
      $$("section[id]").forEach(sec => {
        if (y >= sec.offsetTop - header.offsetHeight - 10) current = sec.id;
      });
      navLinks.forEach(a => {
        a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // ─ Mobile toggle with animation ─
    toggle?.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = nav.classList.toggle("active");
      toggle.textContent = open ? "✕" : "☰";
      toggle.setAttribute("aria-expanded", open);
    });

    // ─ Close on outside click ─
    document.addEventListener("click", (e) => {
      if (nav?.classList.contains("active") &&
          !nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove("active");
        toggle.textContent = "☰";
      }
    });

    // ─ Smooth scroll for nav links ─
    navLinks.forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const target = document.getElementById(link.getAttribute("href").slice(1));
        if (target) {
          window.scrollTo({ top: target.offsetTop - header.offsetHeight, behavior: "smooth" });
          nav?.classList.remove("active");
          toggle && (toggle.textContent = "☰");
        }
      });
    });
  })();


  // ── 4. THEME TOGGLE ──────────────────────────────────────────
  (() => {
    const btn   = $("#theme-toggle-btn");
    const saved = localStorage.getItem("nga-theme") || "dark";
    document.documentElement.dataset.theme = saved;
    if (btn) btn.textContent = saved === "dark" ? "🌙" : "☀️";

    btn?.addEventListener("click", () => {
      const isDark = document.documentElement.dataset.theme === "dark";
      const next   = isDark ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      btn.textContent = isDark ? "☀️" : "🌙";
      localStorage.setItem("nga-theme", next);
    });
  })();


  // ── 5. CUSTOM CURSOR GLOW ────────────────────────────────────
  (() => {
    // skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = document.createElement("div");
    cursor.id = "cursor-glow";
    cursor.style.cssText = `
      position:fixed; width:28px; height:28px; border-radius:50%;
      background:radial-gradient(circle,rgba(108,95,255,.55),transparent 70%);
      pointer-events:none; z-index:99998; transform:translate(-50%,-50%);
      transition:transform .12s, opacity .3s, width .2s, height .2s;
      mix-blend-mode:screen;
    `;
    document.body.appendChild(cursor);

    let mx = -100, my = -100, cx = -100, cy = -100;

    document.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });

    // spring follow
    const loop = () => {
      cx = lerp(cx, mx, 0.18);
      cy = lerp(cy, my, 0.18);
      cursor.style.left = cx + "px";
      cursor.style.top  = cy + "px";
      requestAnimationFrame(loop);
    };
    loop();

    // grow on interactive elements
    document.addEventListener("mouseover", e => {
      if (e.target.matches("a,button,.btn,.chip-btn,.proj-btn,.cert-btn")) {
        cursor.style.width  = "50px";
        cursor.style.height = "50px";
        cursor.style.background = "radial-gradient(circle,rgba(255,75,255,.45),transparent 70%)";
      }
    });
    document.addEventListener("mouseout", e => {
      if (e.target.matches("a,button,.btn,.chip-btn,.proj-btn,.cert-btn")) {
        cursor.style.width  = "28px";
        cursor.style.height = "28px";
        cursor.style.background = "radial-gradient(circle,rgba(108,95,255,.55),transparent 70%)";
      }
    });

    document.addEventListener("mouseleave", () => { cursor.style.opacity = "0"; });
    document.addEventListener("mouseenter", () => { cursor.style.opacity = "1"; });
  })();


  // ── 6. HERO — TYPING EFFECT ───────────────────────────────────
  ready(() => {
    const el = $("#typing-text");
    if (!el) return;

    const roles = [
      "Data Analyst 📊",
      "Power BI Developer 📈",
      "Business Analyst 💼",
      "Python Enthusiast 🐍",
      "BI Consultant 🌐",
    ];
    let wi = 0, ci = 0, deleting = false;

    // blinking cursor
    const cur = document.createElement("span");
    cur.className = "type-cursor";
    cur.textContent = "|";
    cur.style.cssText = "animation:blink .7s step-end infinite;color:#6c5fff;font-weight:300;";
    el.after(cur);

    const style = document.createElement("style");
    style.textContent = `@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`;
    document.head.appendChild(style);

    const tick = () => {
      const word = roles[wi];
      if (!deleting) {
        ci++;
        el.textContent = word.slice(0, ci);
        if (ci === word.length) { deleting = true; return setTimeout(tick, 1800); }
        return setTimeout(tick, 100);
      } else {
        ci--;
        el.textContent = word.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % roles.length;
          return setTimeout(tick, 400);
        }
        return setTimeout(tick, 45);
      }
    };
    setTimeout(tick, 600);

    // hero buttons fade-in
    $$(".hero-buttons .btn").forEach((b, i) =>
      setTimeout(() => b.classList.add("visible"), 300 + i * 150)
    );
  });


  // ── 7. SCROLL REVEAL (Intersection Observer) ─────────────────
  ready(() => {
    const style = document.createElement("style");
    style.textContent = `
      .sr { opacity:0; transform:translateY(36px); transition:opacity .65s ease, transform .65s ease; }
      .sr.sr-left  { transform:translateX(-40px); }
      .sr.sr-right { transform:translateX(40px); }
      .sr.sr-scale { transform:scale(.92); }
      .sr.visible  { opacity:1; transform:none; }
    `;
    document.head.appendChild(style);

    // tag elements
    const map = [
      { sel: ".about-card",          cls: "sr",        delay: 100 },
      { sel: ".experience-card",     cls: "sr sr-left", delay: 0  },
      { sel: ".skill-circle",        cls: "sr sr-scale",delay: 0  },
      { sel: ".certification-card",  cls: "sr",         delay: 0  },
      { sel: ".project-card",        cls: "sr sr-right",delay: 0  },
      { sel: ".service-card",        cls: "sr sr-scale",delay: 0  },
      { sel: ".pricing-card",        cls: "sr",         delay: 0  },
    ];

    map.forEach(({ sel, cls }) =>
      $$(sel).forEach((el, i) => {
        el.classList.add(...cls.split(" "));
        el.style.transitionDelay = (i * 0.1) + "s";
      })
    );

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    $$(".sr").forEach(el => obs.observe(el));
  });


  // ── 8. PROFILE PIC — 3D PARALLAX WITH SPRING ─────────────────
  ready(() => {
    const wrapper = $(".profile-pic-wrapper");
    if (!wrapper || window.matchMedia("(pointer:coarse)").matches) return;

    let tx = 0, ty = 0, cx = 0, cy = 0;

    wrapper.addEventListener("mousemove", e => {
      const r  = wrapper.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width  - .5) * 22;
      ty = ((e.clientY - r.top)  / r.height - .5) * -22;
    });
    wrapper.addEventListener("mouseleave", () => { tx = 0; ty = 0; });

    const loop = () => {
      cx = lerp(cx, tx, 0.1);
      cy = lerp(cy, ty, 0.1);
      wrapper.style.transform = `perspective(600px) rotateY(${cx}deg) rotateX(${cy}deg)`;
      requestAnimationFrame(loop);
    };
    loop();
  });


  // ── 9. SKILLS — RING ANIMATION (on scroll enter) ──────────────
  ready(() => {
    const circles = $$(".skill-circle[data-percent]");
    if (!circles.length) return;

    circles.forEach(circle => {
      const target  = +circle.dataset.percent;
      const ring    = circle.querySelector(".ring-progress");
      const label   = circle.querySelector(".skill-percent");
      const pBox    = circle.querySelector(".skill-particles");
      if (!ring) return;

      const R = ring.r.baseVal.value;
      const C = 2 * Math.PI * R;
      ring.style.strokeDasharray  = C;
      ring.style.strokeDashoffset = C;
      ring.style.transition = "stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1)";

      // particle field
      if (pBox) {
        pBox.innerHTML = "";
        for (let i = 0; i < 14; i++) {
          const p = document.createElement("div");
          p.className = "particle";
          const sz = 2 + Math.random() * 4;
          p.style.cssText = `
            position:absolute;
            width:${sz}px;height:${sz}px;border-radius:50%;
            top:${Math.random()*100}%;left:${Math.random()*100}%;
            background:rgba(${75+~~(Math.random()*180)},${95+~~(Math.random()*160)},255,${.3+Math.random()*.5});
            animation:float ${4+Math.random()*5}s ease-in-out ${Math.random()*4}s infinite alternate;
            transition:transform .5s, opacity .5s;
          `;
          pBox.appendChild(p);
        }
      }

      // floating keyframe (once)
      if (!document.getElementById("float-kf")) {
        const s = document.createElement("style");
        s.id = "float-kf";
        s.textContent = `@keyframes float{from{transform:translateY(0)}to{transform:translateY(-8px)}}`;
        document.head.appendChild(s);
      }

      // hover explosion
      circle.addEventListener("mouseenter", () => {
        if (!pBox) return;
        [...pBox.children].forEach(p => {
          const a = Math.random() * Math.PI * 2;
          const d = 30 + Math.random() * 40;
          p.style.transform = `translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px)`;
          p.style.opacity   = "0";
        });
      });
      circle.addEventListener("mouseleave", () => {
        if (!pBox) return;
        [...pBox.children].forEach(p => {
          p.style.transform = "translate(0,0)";
          p.style.opacity   = "1";
        });
      });

      // trigger on scroll
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;

          // ring fill
          ring.style.strokeDashoffset = C - (target / 100) * C;

          // count-up number
          let n = 0;
          const step = () => {
            n = Math.min(n + 2, target);
            label && (label.textContent = n + "%");
            if (n < target) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);

          // hue-rotate glow
          let hue = Math.random() * 360;
          const glow = () => {
            hue = (hue + 0.8) % 360;
            ring.style.stroke      = `hsl(${hue},100%,62%)`;
            circle.style.boxShadow = `0 0 18px hsl(${hue},100%,62%)`;
            requestAnimationFrame(glow);
          };
          glow();

          obs.unobserve(e.target);
        });
      }, { threshold: 0.35 });
      obs.observe(circle);
    });
  });


  // ── 10. EXPERIENCE CARD PARTICLES ────────────────────────────
  ready(() => {
    $$(".experience-card").forEach(card => {
      const box = card.querySelector(".card-particles");
      if (!box) return;

      for (let i = 0; i < 18; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        p.style.cssText = `
          position:absolute;border-radius:50%;pointer-events:none;
          width:${2+Math.random()*5}px;height:${2+Math.random()*5}px;
          top:${Math.random()*100}%;left:${Math.random()*100}%;
          background:rgba(108,95,255,${.3+Math.random()*.5});
        `;
        box.appendChild(p);

        const move = () => {
          const nt = Math.random()*100, nl = Math.random()*100;
          const dur = 4000 + Math.random()*5000;
          p.animate([
            { top:p.style.top, left:p.style.left },
            { top:nt+"%",      left:nl+"%" }
          ], { duration:dur, easing:"ease-in-out", fill:"forwards" })
          .onfinish = () => { p.style.top=nt+"%"; p.style.left=nl+"%"; move(); };
        };
        move();
      }

      // card tilt on hover
      card.addEventListener("mousemove", e => {
        const r  = card.getBoundingClientRect();
        const tx = ((e.clientX - r.left) / r.width  - .5) * 10;
        const ty = ((e.clientY - r.top)  / r.height - .5) * -10;
        card.style.transform = `perspective(700px) rotateY(${tx}deg) rotateX(${ty}deg) translateY(-6px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  });


  // ── 11. CERTIFICATION CAROUSEL ───────────────────────────────
  ready(() => {
    const container = $(".carousel-container");
    const track     = $(".certifications-carousel");
    if (!container || !track) return;

    const cards   = $$(".certification-card", track);
    const prevBtn = $(".left-btn");
    const nextBtn = $(".right-btn");
    if (!cards.length) return;

    let index = 0, w = container.clientWidth, lock = false;

    track.style.cssText = "display:flex;transition:transform .55s cubic-bezier(.4,0,.2,1);will-change:transform;";
    cards.forEach(c => { c.style.flex = "0 0 100%"; c.style.maxWidth = "100%"; });

    // dot indicators
    const dots = document.createElement("div");
    dots.className = "carousel-dots";
    dots.style.cssText = "display:flex;justify-content:center;gap:8px;margin-top:16px;";
    cards.forEach((_, i) => {
      const d = document.createElement("button");
      d.style.cssText = `
        width:8px;height:8px;border-radius:50%;border:none;cursor:pointer;
        background:rgba(255,255,255,0.2);transition:all .3s;padding:0;
      `;
      d.addEventListener("click", () => goTo(i));
      dots.appendChild(d);
    });
    container.after(dots);

    const goTo = (i, animate = true) => {
      if (lock && animate) return;
      index = ((i % cards.length) + cards.length) % cards.length;
      track.style.transition = animate ? "transform .55s cubic-bezier(.4,0,.2,1)" : "none";
      track.style.transform  = `translateX(${-index * w}px)`;
      cards.forEach((c, n) => c.classList.toggle("active", n === index));
      [...dots.children].forEach((d, n) => {
        d.style.background = n === index ? "#6c5fff" : "rgba(255,255,255,0.2)";
        d.style.transform  = n === index ? "scale(1.3)" : "scale(1)";
      });
    };

    track.addEventListener("transitionstart", () => { lock = true; });
    track.addEventListener("transitionend",   () => { lock = false; });

    prevBtn?.addEventListener("click", () => goTo(index - 1));
    nextBtn?.addEventListener("click", () => goTo(index + 1));

    // swipe support
    let sx = 0;
    track.addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend",   e => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) goTo(dx < 0 ? index + 1 : index - 1);
    });

    // auto-play
    let auto = setInterval(() => goTo(index + 1), 5000);
    container.addEventListener("mouseenter", () => clearInterval(auto));
    container.addEventListener("mouseleave", () => { auto = setInterval(() => goTo(index + 1), 5000); });

    window.addEventListener("resize", debounce(() => { w = container.clientWidth; goTo(index, false); }));
    goTo(0, false);
  });


  // ── 12. STATS COUNTER ANIMATION ──────────────────────────────
  ready(() => {
    $$("[data-count]").forEach(el => {
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || "";

      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          let n = 0;
          const step = () => {
            n = Math.min(n + Math.ceil(target / 60), target);
            el.textContent = n + suffix;
            if (n < target) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          obs.unobserve(e.target);
        });
      }, { threshold: 0.5 });
      obs.observe(el);
    });
  });


  // ── 13. SCROLL TO TOP BUTTON ─────────────────────────────────
  ready(() => {
    const btn = $("#myBtn");
    if (!btn) return;

    btn.style.cssText += "transition:opacity .3s,transform .3s;opacity:0;pointer-events:none;";

    window.addEventListener("scroll", () => {
      const show = window.scrollY > 300;
      btn.style.opacity       = show ? "1" : "0";
      btn.style.pointerEvents = show ? "auto" : "none";
      btn.style.transform     = show ? "translateY(0)" : "translateY(10px)";
    }, { passive: true });
  });

  window.scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });


  // ── 14. PROJECT CARDS — TILT ON HOVER ────────────────────────
  ready(() => {
    $$(".project-card").forEach(card => {
      card.addEventListener("mousemove", e => {
        const r  = card.getBoundingClientRect();
        const tx = ((e.clientX - r.left) / r.width  - .5) * 8;
        const ty = ((e.clientY - r.top)  / r.height - .5) * -8;
        card.style.transform = `perspective(800px) rotateY(${tx}deg) rotateX(${ty}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  });


  // ── 15. ACTIVE SECTION HIGHLIGHT IN SIDEBAR ──────────────────
  // (fires on scroll — already handled in section 3 above)


  // ── 16. HIDDEN KEYWORDS (SEO) ────────────────────────────────
  ready(() => {
    $$(".hidden-keyword").forEach(el => {
      el.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;";
    });
  });


  // ── 17. LAZY LOAD IMAGES ─────────────────────────────────────
  ready(() => {
    if (!("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const img = e.target;
        if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
        obs.unobserve(img);
      });
    }, { rootMargin: "200px" });
    $$("img[data-src]").forEach(img => obs.observe(img));
  });


  // ── 18. SECTION ENTRY GLOW FLASH ─────────────────────────────
  ready(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const h2 = e.target.querySelector("h2");
        if (!h2) return;
        h2.style.transition   = "text-shadow .4s";
        h2.style.textShadow   = "0 0 24px rgba(108,95,255,.8)";
        setTimeout(() => { h2.style.textShadow = ""; }, 900);
      });
    }, { threshold: 0.3 });
    $$("section[id]").forEach(s => obs.observe(s));
  });


  // ── 19. CONTACT FORM — EmailJS ────────────────────────────────
  // ─────────────────────────────────────────────────────────────
  //  SETUP (one-time):
  //  1. Go to https://www.emailjs.com and create a free account.
  //  2. Add an Email Service (Gmail, Outlook, etc.) → copy your SERVICE ID.
  //  3. Create an Email Template → copy your TEMPLATE ID.
  //     Template variables to use: {{from_name}}, {{from_email}}, {{message}}
  //  4. Go to Account → copy your PUBLIC KEY.
  //  5. Replace the three placeholder strings below with your real IDs.
  //  6. In your index.html, add this line BEFORE script.js:
  //     <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
  // ─────────────────────────────────────────────────────────────

  const EMAILJS_PUBLIC_KEY  = "ILlSd42qf_3o8DE93";
  const EMAILJS_SERVICE_ID  = "service_q9049ro";
  const EMAILJS_TEMPLATE_ID = "template_wehotjb";

  ready(() => {
    // Initialise EmailJS with your public key
    if (typeof emailjs === "undefined") {
      console.warn("EmailJS SDK not loaded. Add the script tag to your HTML before script.js.");
      return;
    }
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

    const form      = $("#contactForm");
    const submitBtn = form?.querySelector("button[type='submit'], .submit-btn, #submitBtn");
    const modal     = $("#thankYouModal");
    const closeBtn  = $("#closeModal, .modal-close");

    if (!form) return;

    // ─ Form submit ─
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // basic validation
      const name    = (form.querySelector("[name='from_name']")?.value  || "").trim();
      const email   = (form.querySelector("[name='from_email']")?.value || "").trim();
      const message = (form.querySelector("[name='message']")?.value    || "").trim();

      if (!name || !email || !message) {
        showFormError("Please fill in all fields.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFormError("Please enter a valid email address.");
        return;
      }

      // loading state
      if (submitBtn) {
        submitBtn.disabled    = true;
        submitBtn.textContent = "Sending…";
      }

      try {
        await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);

        // success — show thank-you modal or fallback alert
        form.reset();
        if (modal) {
          modal.classList.add("active");
          modal.style.display = "flex";
        } else {
          showFormSuccess("✓ Thank You So Much! Your message has been sent successfully. I'll get back to you soon.");
        }
      } catch (err) {
        console.error("EmailJS error:", err);
        showFormError("Something went wrong. Please try again or email me directly.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled    = false;
          submitBtn.textContent = "Send Message";
        }
      }
    });

    // ─ Close thank-you modal ─
    const closeModal = () => {
      if (!modal) return;
      modal.classList.remove("active");
      modal.style.display = "none";
    };

    closeBtn && $$("#closeModal, .modal-close").forEach(b => b.addEventListener("click", closeModal));

    // close on backdrop click
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    // close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal?.classList.contains("active")) closeModal();
    });

    // ─ Inline helpers ─
    function showFormError(msg) {
      let notice = form.querySelector(".form-notice");
      if (!notice) {
        notice = document.createElement("p");
        notice.className = "form-notice";
        notice.style.cssText = `
          margin-top:10px; padding:10px 14px; border-radius:8px;
          font-size:.9rem; font-weight:500;
        `;
        form.appendChild(notice);
      }
      notice.style.background = "rgba(255,75,75,.15)";
      notice.style.color      = "#ff6b6b";
      notice.style.border     = "1px solid rgba(255,75,75,.3)";
      notice.textContent      = msg;
      notice.style.display    = "block";
      setTimeout(() => { notice.style.display = "none"; }, 5000);
    }

    function showFormSuccess(msg) {
      let notice = form.querySelector(".form-notice");
      if (!notice) {
        notice = document.createElement("p");
        notice.className = "form-notice";
        notice.style.cssText = `
          margin-top:10px; padding:10px 14px; border-radius:8px;
          font-size:.9rem; font-weight:500;
        `;
        form.appendChild(notice);
      }
      notice.style.background = "rgba(75,255,108,.15)";
      notice.style.color      = "#4bff6c";
      notice.style.border     = "1px solid rgba(75,255,108,.3)";
      notice.textContent      = msg;
      notice.style.display    = "block";
    }
  });

})();
