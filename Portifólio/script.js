const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-nav]");
const navLinks = [...document.querySelectorAll(".main-nav a")];
const revealItems = document.querySelectorAll(".reveal");
const sections = [...document.querySelectorAll("main section[id]")];

const updateHeader = () => {
  header?.classList.toggle("scrolled", window.scrollY > 28);
};

const closeMenu = () => {
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "Abrir menu");
  navigation?.classList.remove("open");
  document.body.classList.remove("menu-open");
};

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  navigation?.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -30px" },
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const current = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!current) return;
    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current.target.id}`,
      );
    });
  },
  { threshold: [0.25, 0.45, 0.65], rootMargin: "-20% 0px -45%" },
);

sections.forEach((section) => sectionObserver.observe(section));

const timeElement = document.querySelector("#local-time");
const yearElement = document.querySelector("#year");

const updateClock = () => {
  if (!timeElement) return;
  const time = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
  timeElement.textContent = `Brasil · ${time}`;
};

if (yearElement) yearElement.textContent = String(new Date().getFullYear());
updateClock();
setInterval(updateClock, 60_000);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
