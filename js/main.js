(function () {
  "use strict";
  var root = document.documentElement;

  /* mobile drawer (768px breakpoint, same number as the CSS) */
  var toggle = document.querySelector(".nav-toggle");
  var drawer = document.getElementById("mob-drawer");
  var overlay = document.querySelector(".mob-overlay");
  function setDrawer(open) {
    if (!drawer || !toggle) { return; }
    drawer.classList.toggle("open", open);
    if (overlay) { overlay.classList.toggle("open", open); }
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    root.style.overflow = open ? "hidden" : "";
    if (open) {
      var first = drawer.querySelector("a,button");
      if (first) { first.focus(); }
    } else {
      toggle.focus();
    }
  }
  if (toggle && drawer) {
    toggle.addEventListener("click", function () { setDrawer(!drawer.classList.contains("open")); });
    var closeBtn = drawer.querySelector(".mob-close");
    if (closeBtn) { closeBtn.addEventListener("click", function () { setDrawer(false); }); }
    if (overlay) { overlay.addEventListener("click", function () { setDrawer(false); }); }
    drawer.addEventListener("click", function (e) {
      var t = e.target;
      while (t && t !== drawer) {
        if (t.tagName === "A") { root.style.overflow = ""; setDrawer(false); break; }
        t = t.parentNode;
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("open")) { setDrawer(false); }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768 && drawer.classList.contains("open")) { setDrawer(false); }
    });
  }

  /* desktop dropdown buttons (keyboard and touch) */
  var dropBtns = document.querySelectorAll(".navbtn");
  Array.prototype.forEach.call(dropBtns, function (b) {
    b.addEventListener("click", function () {
      var li = b.parentNode;
      var open = li.classList.toggle("open-drop");
      b.setAttribute("aria-expanded", open ? "true" : "false");
      var menu = li.querySelector(".dropmenu");
      if (menu) { menu.style.display = open ? (menu.classList.contains("mega") ? "grid" : "block") : ""; }
    });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest || e.target.closest(".has-drop")) { return; }
    Array.prototype.forEach.call(document.querySelectorAll(".has-drop.open-drop"), function (li) {
      li.classList.remove("open-drop");
      var btn = li.querySelector(".navbtn");
      if (btn) { btn.setAttribute("aria-expanded", "false"); }
      var menu = li.querySelector(".dropmenu");
      if (menu) { menu.style.display = ""; }
    });
  });

  /* FAQ accordion: max-height toggle */
  var qs = document.querySelectorAll(".faq-q");
  Array.prototype.forEach.call(qs, function (q) {
    q.addEventListener("click", function () {
      var a = document.getElementById(q.getAttribute("aria-controls"));
      if (!a) { return; }
      var open = q.getAttribute("aria-expanded") === "true";
      q.setAttribute("aria-expanded", open ? "false" : "true");
      a.style.maxHeight = open ? "0px" : a.scrollHeight + "px";
    });
  });
  window.addEventListener("resize", function () {
    Array.prototype.forEach.call(document.querySelectorAll(".faq-q[aria-expanded='true']"), function (q) {
      var a = document.getElementById(q.getAttribute("aria-controls"));
      if (a) { a.style.maxHeight = a.scrollHeight + "px"; }
    });
  });

  /* floating call button hides when the footer is in view */
  var fab = document.querySelector(".fab-call");
  var foot = document.querySelector(".site-footer");
  if (fab && foot && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { fab.classList.toggle("hide", en.isIntersecting); });
    }, { threshold: 0.05 }).observe(foot);
  }
})();
