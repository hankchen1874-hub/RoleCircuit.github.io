const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      primaryNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const workflowContent = {
  discover: {
    kicker: "STEP 01 / DISCOVER",
    heading: "Find the jobs worth your time.",
    description: "RoleCircuit runs scans against your target roles, bringing source, timing, and requirements into one signal board.",
    source: "SCAN / LINKEDIN FEED",
    query: "Applied AI Engineer",
    badge: "NEW",
    result: "14 matching signals collected",
  },
  evaluate: {
    kicker: "STEP 02 / EVALUATE",
    heading: "See the fit — and the gaps.",
    description: "Put the job description and your CV in the same evidence lane. A score is not a verdict; it is a reason you can inspect.",
    source: "EVALUATE / JD + CV",
    query: "Northstar Labs / 92 fit",
    badge: "EVIDENCE",
    result: "3 strong matches · 1 gap found",
  },
  prepare: {
    kicker: "STEP 03 / PREPARE",
    heading: "Make preparation less repetitive.",
    description: "Generate role-aware documents and let the browser extension map answers into forms while you keep the review step.",
    source: "PREPARE / APPLICATION",
    query: "resume-v3 + cover-note",
    badge: "READY",
    result: "application surface mapped",
  },
  review: {
    kicker: "STEP 04 / REVIEW",
    heading: "Leave a signal you can learn from.",
    description: "Connect applications, email signals, and outcomes in the tracker so each search teaches the next one what to do better.",
    source: "REVIEW / OUTCOME LOOP",
    query: "Northstar Labs / in review",
    badge: "TRACKED",
    result: "next follow-up in 2 days",
  },
};

const workflowTabs = document.querySelectorAll(".workflow-tab");
const workflowKicker = document.querySelector("#workflow-kicker");
const workflowHeading = document.querySelector("#workflow-heading");
const workflowDescription = document.querySelector("#workflow-description");
const artSource = document.querySelector("#art-source");
const artQueryValue = document.querySelector("#art-query-value");
const artResultBadge = document.querySelector("#art-result-badge");
const artResultText = document.querySelector("#art-result-text");

function setWorkflowStep(step) {
  const content = workflowContent[step];
  if (!content) return;

  workflowTabs.forEach((tab) => {
    const isActive = tab.dataset.step === step;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  [workflowKicker, workflowHeading, workflowDescription, artSource, artQueryValue, artResultBadge, artResultText].forEach((element) => {
    if (element) element.classList.add("is-changing");
  });

  window.setTimeout(() => {
    workflowKicker.textContent = content.kicker;
    workflowHeading.textContent = content.heading;
    workflowDescription.textContent = content.description;
    artSource.textContent = content.source;
    artQueryValue.textContent = content.query;
    artResultBadge.textContent = content.badge;
    artResultText.textContent = content.result;
    [workflowKicker, workflowHeading, workflowDescription, artSource, artQueryValue, artResultBadge, artResultText].forEach((element) => {
      if (element) element.classList.remove("is-changing");
    });
  }, 130);
}

workflowTabs.forEach((tab) => {
  tab.addEventListener("click", () => setWorkflowStep(tab.dataset.step));
  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const currentIndex = [...workflowTabs].indexOf(tab);
    const nextIndex = event.key === "ArrowRight"
      ? (currentIndex + 1) % workflowTabs.length
      : (currentIndex - 1 + workflowTabs.length) % workflowTabs.length;
    const nextTab = workflowTabs[nextIndex];
    nextTab.focus();
    setWorkflowStep(nextTab.dataset.step);
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

document.querySelectorAll(".feature-card, .capability-card, .trust-item, .workflow-shell, .operator-step, .closing-grid").forEach((element) => {
  element.classList.add("scroll-reveal");
  observer.observe(element);
});
