// Lightbox modal for photography gallery pages.
(function () {
  "use strict";

  var gallery = document.querySelector(".gallery");
  if (!gallery) return;

  var photos = Array.from(gallery.querySelectorAll("img"));
  if (!photos.length) return;

  // Build the modal once and append it to the document body.
  var modal = document.createElement("div");
  modal.className = "gallery-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("tabindex", "-1");
  modal.hidden = true;
  modal.innerHTML =
    '<div class="gallery-modal__backdrop" data-action="close"></div>' +
    '<figure class="gallery-modal__figure">' +
    '<img class="gallery-modal__image" src="" alt="" />' +
    "</figure>" +
    '<button class="gallery-modal__close" type="button" data-action="close" aria-label="Close">\u00d7</button>' +
    '<button class="gallery-modal__prev" type="button" data-action="prev" aria-label="Previous photo">\u2039</button>' +
    '<button class="gallery-modal__next" type="button" data-action="next" aria-label="Next photo">\u203a</button>';
  document.body.appendChild(modal);

  var image = modal.querySelector(".gallery-modal__image");
  var currentIndex = -1;

  function show(index) {
    currentIndex = (index + photos.length) % photos.length;
    var photo = photos[currentIndex];
    image.src = photo.getAttribute("src");
    image.alt = photo.getAttribute("alt") || "";
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.focus();
  }

  function hide() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  function showPrev() {
    show(currentIndex - 1);
  }

  function showNext() {
    show(currentIndex + 1);
  }

  photos.forEach(function (photo, index) {
    photo.classList.add("gallery-photo");
    photo.setAttribute("tabindex", "0");
    photo.setAttribute("role", "button");
    photo.addEventListener("click", function () {
      show(index);
    });
    photo.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        show(index);
      }
    });
  });

  modal.addEventListener("click", function (event) {
    var target = event.target.closest("[data-action]");
    if (!target) return;
    var action = target.getAttribute("data-action");
    if (action === "close") hide();
    else if (action === "prev") showPrev();
    else if (action === "next") showNext();
  });

  document.addEventListener("keydown", function (event) {
    if (modal.hidden) return;
    if (event.key === "Escape") hide();
    else if (event.key === "ArrowLeft") showPrev();
    else if (event.key === "ArrowRight") showNext();
  });
})();
