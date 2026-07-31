/* RoleCircuit landing — interaction layer (light theme) */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function sleep(ms) {
    return new Promise(function (resolve) { window.setTimeout(resolve, ms); });
  }

  /* ============ Header shrink + scroll progress + scroll spy ============ */
  var header = document.getElementById("site-header");
  var progressBar = document.getElementById("scroll-progress-bar");
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll("[data-spy]"));
  var spySections = spyLinks
    .map(function (link) { return document.getElementById(link.getAttribute("data-spy")); })
    .filter(Boolean);

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.scrollY || window.pageYOffset;
      header.classList.toggle("is-scrolled", y > 24);

      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      progressBar.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";

      var activeId = null;
      for (var i = 0; i < spySections.length; i++) {
        var rect = spySections[i].getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom > 140) {
          activeId = spySections[i].id;
          break;
        }
      }
      spyLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("data-spy") === activeId);
      });

      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ============ Mobile menu ============ */
  var menuToggle = document.querySelector(".menu-toggle");
  var primaryNav = document.querySelector(".primary-nav");
  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = primaryNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
    primaryNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        primaryNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ============ Visibility helper ============ */
  function whenVisible(el, callback, threshold) {
    if (!("IntersectionObserver" in window)) { callback(); return; }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          callback();
          obs.disconnect();
        }
      });
    }, { threshold: threshold || 0.3 });
    obs.observe(el);
  }

  /* ============ Scroll reveals (cards, masked headings, timeline) ============ */
  var revealEls = document.querySelectorAll(".reveal, .masked");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ============ Typing effect (hero shortlist card) ============ */
  var typingEl = document.getElementById("typing-role");
  if (typingEl) {
    var roles = ["product engineer roles", "founding frontend roles", "ML platform roles", "design-engineer roles"];
    if (prefersReducedMotion) {
      typingEl.textContent = roles[0];
    } else {
      var roleIndex = 0;
      var charIndex = 0;
      var deleting = false;
      var typeLoop = function () {
        var word = roles[roleIndex];
        if (!deleting) {
          charIndex++;
          typingEl.textContent = word.slice(0, charIndex);
          if (charIndex === word.length) {
            deleting = true;
            window.setTimeout(typeLoop, 2100);
            return;
          }
          window.setTimeout(typeLoop, 55 + Math.random() * 50);
        } else {
          charIndex--;
          typingEl.textContent = word.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            window.setTimeout(typeLoop, 420);
            return;
          }
          window.setTimeout(typeLoop, 26);
        }
      };
      window.setTimeout(typeLoop, 900);
    }
  }

  /* ============ How it works — tab stepper ============ */
  var loopContent = {
    scan: {
      kicker: "STEP 01 / IT SCANS",
      heading: "Every board, checked hourly.",
      description:
        "RoleCircuit watches LinkedIn, Indeed, and thousands of company career pages for you — automatically, every hour. New postings that match what you're after land in one place. You never open twelve tabs again.",
      tags: ["LinkedIn", "Indeed", "Company boards", "Hourly"],
      artKicker: "WHILE YOU SLEEP",
      artValue: "Fresh openings, sorted",
      artSub: "waiting in your shortlist by morning"
    },
    shortlist: {
      kicker: "STEP 02 / IT SHORTLISTS",
      heading: "Know what's worth your hour.",
      description:
        "For every opening, RoleCircuit reads the posting line by line and tells you plainly: why it fits you, what's missing, or why you should skip it — always citing your own experience. No black-box scores, no guessing.",
      tags: ["Why it fits", "Honest gaps", "Skip with reasons"],
      artKicker: "SHORTLIST / TODAY",
      artValue: "Worth a look vs. skip it",
      artSub: "every call comes with its reasons"
    },
    prepare: {
      kicker: "STEP 03 / IT PREPARES",
      heading: "A tailored resume, every time.",
      description:
        "For the roles you pick, it writes a one-page resume that leads with your most relevant projects, a cover letter mapped to the posting, and interview-prep notes. No more renaming resume_final_v9.pdf.",
      tags: ["One-page resume", "Cover letter", "Prep notes"],
      artKicker: "PREPARE / DOCUMENTS",
      artValue: "Resume + cover letter ready",
      artSub: "mapped to this posting's requirements"
    },
    decide: {
      kicker: "STEP 04 / YOU DECIDE",
      heading: "You review. You click submit.",
      description:
        "The browser extension fills the application form for you — then stops. You check it, you hit submit. After that, every reply, interview, and follow-up is tracked for you, with nudges before anything goes cold.",
      tags: ["Autofill ≠ submit", "One timeline", "Follow-up nudges"],
      artKicker: "AFTER YOU APPLY",
      artValue: "Everything tracked",
      artSub: "replies · interviews · follow-ups"
    }
  };

  var loopTabs = Array.prototype.slice.call(document.querySelectorAll(".loop-tab"));
  var loopPanel = document.getElementById("loop-panel");
  var loopKicker = document.getElementById("loop-kicker");
  var loopHeading = document.getElementById("loop-heading");
  var loopDescription = document.getElementById("loop-description");
  var loopTags = document.getElementById("loop-tags");
  var artKicker = document.getElementById("art-kicker");
  var artValue = document.getElementById("art-value");
  var artSub = document.getElementById("art-sub");

  function applyLoopContent(content) {
    loopKicker.textContent = content.kicker;
    loopHeading.textContent = content.heading;
    loopDescription.textContent = content.description;
    loopTags.innerHTML = "";
    content.tags.forEach(function (tag) {
      var span = document.createElement("span");
      span.textContent = tag;
      loopTags.appendChild(span);
    });
    artKicker.textContent = content.artKicker;
    artValue.textContent = content.artValue;
    artSub.textContent = content.artSub;
  }

  function setLoopStep(step, focusTab) {
    var content = loopContent[step];
    if (!content || !loopPanel) return;

    loopTabs.forEach(function (tab) {
      var isActive = tab.getAttribute("data-step") === step;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
      if (isActive) {
        loopPanel.setAttribute("aria-labelledby", tab.id);
        if (focusTab) tab.focus();
      }
    });

    if (prefersReducedMotion) {
      applyLoopContent(content);
      return;
    }
    loopPanel.classList.add("is-changing");
    window.setTimeout(function () {
      applyLoopContent(content);
      loopPanel.classList.remove("is-changing");
    }, 240);
  }

  loopTabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      setLoopStep(tab.getAttribute("data-step"), false);
    });
    tab.addEventListener("keydown", function (event) {
      var nextIndex = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % loopTabs.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + loopTabs.length) % loopTabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = loopTabs.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      setLoopStep(loopTabs[nextIndex].getAttribute("data-step"), true);
    });
  });

  /* ============ Autofill form — self-filling loop ============ */
  var formCard = document.getElementById("form-card");
  if (formCard) {
    var formValues = {
      name: "Jordan Lee",
      email: "jordan@mailbox.com",
      why: "I spent three years building design-system infrastructure — the exact problem this role owns.",
      eeo: "Decline to self-identify"
    };
    var formOrder = ["name", "email", "why", "eeo"];
    var formCursor = document.getElementById("form-cursor");
    var formSubmit = document.getElementById("form-submit");

    function formField(key) {
      return formCard.querySelector('[data-field="' + key + '"]');
    }

    function setFieldValue(key, value) {
      var field = formField(key);
      field.querySelector(".field-value").textContent = value;
    }

    function moveCursorTo(el) {
      var cardRect = formCard.getBoundingClientRect();
      var rect = el.getBoundingClientRect();
      var x = rect.left - cardRect.left + 14;
      var y = rect.top - cardRect.top + rect.height / 2 - 2;
      formCursor.style.transform = "translate(" + x + "px, " + y + "px)";
    }

    function typeInto(key, value) {
      return new Promise(function (resolve) {
        var valueEl = formField(key).querySelector(".field-value");
        var i = 0;
        var speed = key === "why" ? 18 : 34;
        (function tick() {
          i++;
          valueEl.textContent = value.slice(0, i);
          if (i < value.length) {
            window.setTimeout(tick, speed + Math.random() * 24);
          } else {
            resolve();
          }
        })();
      });
    }

    function resetForm() {
      formOrder.forEach(function (key) {
        var field = formField(key);
        field.classList.remove("is-active", "is-filled");
        setFieldValue(key, "");
      });
      formCard.classList.remove("at-submit");
    }

    function runFormLoop() {
      (async function cycle() {
        resetForm();
        await sleep(500);
        formCursor.classList.add("is-on");

        for (var k = 0; k < formOrder.length; k++) {
          var key = formOrder[k];
          var field = formField(key);
          var input = field.querySelector(".form-input");
          moveCursorTo(input);
          await sleep(620);
          field.classList.add("is-active");
          await sleep(220);
          if (key === "eeo") {
            await sleep(500);
            setFieldValue(key, formValues[key]);
          } else {
            await typeInto(key, formValues[key]);
          }
          field.classList.remove("is-active");
          field.classList.add("is-filled");
          await sleep(420);
        }

        moveCursorTo(formSubmit);
        await sleep(650);
        formCard.classList.add("at-submit");
        await sleep(3000);
        formCard.classList.remove("at-submit");
        formCursor.classList.remove("is-on");
        await sleep(1100);
        cycle();
      })();
    }

    if (prefersReducedMotion) {
      /* Static, fully-filled state */
      formCard.classList.add("is-static", "at-submit");
      formOrder.forEach(function (key) {
        setFieldValue(key, formValues[key]);
        formField(key).classList.add("is-filled");
      });
    } else {
      whenVisible(formCard, runFormLoop, 0.35);
    }
  }

  /* ============ Receipts rows — light up on scroll ============ */
  var receiptRows = document.querySelectorAll(".receipt-row");
  if (receiptRows.length) {
    whenVisible(receiptRows[0].parentElement, function () {
      receiptRows.forEach(function (row, i) {
        window.setTimeout(function () {
          row.classList.add("is-lit");
          window.setTimeout(function () { row.classList.remove("is-lit"); }, 1500);
        }, prefersReducedMotion ? 0 : 400 + i * 450);
      });
    }, 0.35);
  }

  /* ============ Card tilt (pain cards) ============ */
  if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".pain-card").forEach(function (card) {
      var rafId = null;
      card.addEventListener("pointermove", function (event) {
        if (rafId) return;
        rafId = window.requestAnimationFrame(function () {
          var rect = card.getBoundingClientRect();
          var px = (event.clientX - rect.left) / rect.width;
          var py = (event.clientY - rect.top) / rect.height;
          card.style.transform =
            "perspective(700px) rotateX(" + (0.5 - py) * 4 + "deg) rotateY(" + (px - 0.5) * 4 + "deg) translateY(-5px)";
          rafId = null;
        });
      });
      card.addEventListener("pointerleave", function () {
        if (rafId) { window.cancelAnimationFrame(rafId); rafId = null; }
        card.style.transform = "";
      });
    });

    /* Magnetic buttons */
    document.querySelectorAll(".magnetic").forEach(function (btn) {
      btn.addEventListener("pointermove", function (event) {
        var rect = btn.getBoundingClientRect();
        var dx = event.clientX - (rect.left + rect.width / 2);
        var dy = event.clientY - (rect.top + rect.height / 2);
        btn.style.transform = "translate(" + dx * 0.12 + "px, " + dy * 0.18 + "px)";
      });
      btn.addEventListener("pointerleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* ============ Hero canvas: light circuit network ============ */
  var canvas = document.getElementById("circuit-canvas");
  if (canvas && !prefersReducedMotion) {
    var ctx = canvas.getContext("2d");
    var nodes = [];
    var pulses = [];
    var mouse = { x: -9999, y: -9999 };
    var W = 0;
    var H = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var LINK_DIST = 150;
    var running = true;
    var rafHandle = null;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedNodes();
    }

    function seedNodes() {
      var count = Math.min(85, Math.floor((W * H) / 17000));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.26,
          vy: (Math.random() - 0.5) * 0.26,
          r: 1.2 + Math.random() * 1.6
        });
      }
    }

    function spawnPulse() {
      if (nodes.length < 2 || pulses.length > 7) return;
      var a = nodes[Math.floor(Math.random() * nodes.length)];
      var best = null;
      var bestDist = Infinity;
      for (var i = 0; i < nodes.length; i++) {
        var b = nodes[i];
        if (b === a) continue;
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK_DIST && d < bestDist) {
          bestDist = d;
          best = b;
        }
      }
      if (!best) return;
      pulses.push({ a: a, b: best, t: 0, speed: 0.012 + Math.random() * 0.012 });
    }

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);

      var i, j, n;
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        /* gentle mouse repulsion */
        var mdx = n.x - mouse.x;
        var mdy = n.y - mouse.y;
        var md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 120 && md > 0.01) {
          var force = (120 - md) / 120;
          n.x += (mdx / md) * force * 1.3;
          n.y += (mdy / md) * force * 1.3;
        }

        if (n.x < -20) n.x = W + 20;
        if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20;
        if (n.y > H + 20) n.y = -20;
      }

      /* links */
      for (i = 0; i < nodes.length; i++) {
        for (j = i + 1; j < nodes.length; j++) {
          var a = nodes[i];
          var b = nodes[j];
          var dx = a.x - b.x;
          var dy = a.y - b.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            var alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.13;
            ctx.strokeStyle = "rgba(101, 163, 13, " + alpha.toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      /* nodes */
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        ctx.fillStyle = "rgba(20, 23, 18, 0.28)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      /* pulses traveling along links */
      for (i = pulses.length - 1; i >= 0; i--) {
        var p = pulses[i];
        p.t += p.speed;
        if (p.t >= 1) {
          pulses.splice(i, 1);
          continue;
        }
        var x = p.a.x + (p.b.x - p.a.x) * p.t;
        var y = p.a.y + (p.b.y - p.a.y) * p.t;
        var glow = ctx.createRadialGradient(x, y, 0, x, y, 10);
        glow.addColorStop(0, "rgba(101, 163, 13, 0.6)");
        glow.addColorStop(1, "rgba(101, 163, 13, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(77, 124, 15, 0.85)";
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (Math.random() < 0.05) spawnPulse();
      rafHandle = window.requestAnimationFrame(draw);
    }

    var hero = canvas.parentElement;
    hero.addEventListener("pointermove", function (event) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    });
    hero.addEventListener("pointerleave", function () {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        running = false;
        if (rafHandle) window.cancelAnimationFrame(rafHandle);
        rafHandle = null;
      } else if (!running) {
        running = true;
        rafHandle = window.requestAnimationFrame(draw);
      }
    });

    var resizeTimer = null;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    });

    resize();
    rafHandle = window.requestAnimationFrame(draw);
  }
})();
