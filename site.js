function setupMenu() {
    const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("site-menu");

    const setOpen = (open) => {
        menu.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    toggle.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
    for (const link of menu.querySelectorAll("a")) {
        link.addEventListener("click", () => setOpen(false));
    }
}

function setupReveal() {
    const elements = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
        elements.forEach((element) => element.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        }
    }, {threshold: 0.15});
    elements.forEach((element) => observer.observe(element));
}

setupMenu();
setupReveal();
