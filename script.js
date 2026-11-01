/* ============================================================
   Portfolio interactions: nav, scroll reveal, active link,
   back-to-top, contact form validation.
   Profile links are written directly in index.html.
   ============================================================ */
(function () {
  "use strict";

  var CONTACT_EMAIL = "hemanth.s28925@gmail.com";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- 1. Footer year ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- 2. Mobile menu ---------- */
  var toggle = $("#navToggle");
  var navLinks = $("#navLinks");
  function setMenu(open) {
    navLinks.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.firstElementChild.className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  }
  toggle.addEventListener("click", function () { setMenu(!navLinks.classList.contains("open")); });
  $$(".nav-link").forEach(function (l) { l.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navLinks.classList.contains("open")) { setMenu(false); toggle.focus(); }
  });

  /* ---------- 3. Navbar background, back-to-top, active link ---------- */
  var navbar = $("#navbar");
  var topBtn = $("#backToTop");
  var sections = $$("main section[id]");
  var links = $$(".nav-link");

  function onScroll() {
    var y = window.scrollY;
    navbar.classList.toggle("scrolled", y > 30);
    topBtn.classList.toggle("show", y > 500);

    // Highlight the link of the section currently under the header
    var current = sections[0].id;
    sections.forEach(function (s) { if (y + 120 >= s.offsetTop) current = s.id; });
    if (window.innerHeight + y >= document.body.scrollHeight - 4) current = sections[sections.length - 1].id;
    links.forEach(function (l) { l.classList.toggle("active", l.getAttribute("href") === "#" + current); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  topBtn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* ---------- 4. Scroll reveal ---------- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 80 + "ms"; // small stagger
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- 5. Contact form ---------- */
  var form = $("#contactForm");
  var status = $("#formStatus");
  var rules = {
    name: function (v) { return v.trim().length >= 2 ? "" : "Please enter your name (at least 2 characters)."; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address."; },
    subject: function (v) { return v.trim().length >= 3 ? "" : "Please enter a subject (at least 3 characters)."; },
    message: function (v) { return v.trim().length >= 10 ? "" : "Message should be at least 10 characters."; }
  };

  function validateField(id) {
    var input = $("#" + id);
    var msg = rules[id](input.value);
    $("#" + id + "Error").textContent = msg;
    input.parentElement.classList.toggle("invalid", !!msg);
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }
  Object.keys(rules).forEach(function (id) {
    $("#" + id).addEventListener("blur", function () { validateField(id); });
    $("#" + id).addEventListener("input", function () {
      if ($("#" + id).parentElement.classList.contains("invalid")) validateField(id);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "";
    var ok = Object.keys(rules).map(validateField).every(Boolean);
    if (!ok) {
      var firstBad = $(".field.invalid input, .field.invalid textarea");
      if (firstBad) firstBad.focus();
      return;
    }
    // No backend: open the visitor's email app with the message pre-filled
    var body = "Name: " + $("#name").value.trim() + "\nEmail: " + $("#email").value.trim() + "\n\n" + $("#message").value.trim();
    window.location.href = "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent($("#subject").value.trim()) +
      "&body=" + encodeURIComponent(body);
    status.textContent = "Opening your email app. If nothing opens, email me directly at " + CONTACT_EMAIL + ".";
    form.reset();
  });
})();   