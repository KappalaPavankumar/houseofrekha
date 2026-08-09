// document.addEventListener("DOMContentLoaded", function () {
//   const topbar = document.querySelector(".topbar");
//   const header = document.querySelector("header");
//   let lastScroll = 0;

//   window.addEventListener("scroll", function () {
//     const currentScroll = window.pageYOffset;

//     if (currentScroll > 60) {
//       topbar.classList.add("topbar-hidden");
//       header.classList.add("is-stuck");
//     } else {
//       topbar.classList.remove("topbar-hidden");
//       header.classList.remove("is-stuck");
//     }

//     lastScroll = currentScroll;
//   });
// });


// document.addEventListener("DOMContentLoaded", function () {
//   const dropdown = document.querySelector(".nav-item.dropdown");
//   const toggle = dropdown.querySelector(".dropdown-toggle");

//   dropdown.addEventListener("mouseenter", () => toggle.setAttribute("aria-expanded", "true"));
//   dropdown.addEventListener("mouseleave", () => toggle.setAttribute("aria-expanded", "false"));
// });

/* ---------------- 8. LIGHTBOX ---------------- */
 document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll(".filter-btn");

  const galleryItems = Array.from(
    document.querySelectorAll(".gallery-item")
  );

  const galleryColumns = Array.from(
    document.querySelectorAll(".gallery-column")
  );

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  let currentIndex = 0;
  let lastFocusedItem = null;

  /*
   * Stop the script when gallery elements are not available.
   */
  if (
    galleryItems.length === 0 ||
    !lightbox ||
    !lightboxImg ||
    !lightboxClose ||
    !lightboxPrev ||
    !lightboxNext
  ) {
    return;
  }

  /*
   * Return currently visible gallery items.
   */
  function getVisibleItems() {
    return galleryItems.filter(function (item) {
      return !item.classList.contains("hide");
    });
  }

  /*
   * Hide columns that do not contain any visible images.
   */
  function updateVisibleColumns() {
    galleryColumns.forEach(function (column) {
      const visibleItem = column.querySelector(
        ".gallery-item:not(.hide)"
      );

      column.classList.toggle(
        "column-hidden",
        !visibleItem
      );
    });
  }

  /*
   * Gallery filtering.
   */
  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedCategory = button.dataset.filter;

      filterButtons.forEach(function (filterButton) {
        filterButton.classList.remove("active");
      });

      button.classList.add("active");

      galleryItems.forEach(function (item) {
        const itemCategory = item.dataset.category;

        const shouldShow =
          selectedCategory === "all" ||
          itemCategory === selectedCategory;

        item.classList.toggle("hide", !shouldShow);
      });

      updateVisibleColumns();
      closeLightbox();
    });
  });

  /*
   * Update the lightbox image.
   */
  function showCurrentImage() {
    const visibleItems = getVisibleItems();

    if (visibleItems.length === 0) {
      closeLightbox();
      return;
    }

    if (currentIndex < 0) {
      currentIndex = visibleItems.length - 1;
    }

    if (currentIndex >= visibleItems.length) {
      currentIndex = 0;
    }

    const image =
      visibleItems[currentIndex].querySelector("img");

    if (!image) {
      return;
    }

    lightboxImg.src = image.currentSrc || image.src;
    lightboxImg.alt = image.alt;
  }

  /*
   * Open lightbox.
   */
  function openLightbox(item) {
    const visibleItems = getVisibleItems();

    currentIndex = visibleItems.indexOf(item);

    if (currentIndex === -1) {
      return;
    }

    lastFocusedItem = item;

    showCurrentImage();

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    lightboxClose.focus();
  }

  /*
   * Close lightbox.
   */
  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    if (lastFocusedItem) {
      lastFocusedItem.focus();
    }
  }

  /*
   * Open selected gallery image.
   */
  galleryItems.forEach(function (item) {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", "Open gallery image");

    item.addEventListener("click", function () {
      openLightbox(item);
    });

    item.addEventListener("keydown", function (event) {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        openLightbox(item);
      }
    });
  });

  /*
   * Previous image.
   */
  lightboxPrev.addEventListener("click", function (event) {
    event.stopPropagation();

    currentIndex -= 1;
    showCurrentImage();
  });

  /*
   * Next image.
   */
  lightboxNext.addEventListener("click", function (event) {
    event.stopPropagation();

    currentIndex += 1;
    showCurrentImage();
  });

  /*
   * Close button.
   */
  lightboxClose.addEventListener("click", function () {
    closeLightbox();
  });

  /*
   * Prevent image clicks from closing the lightbox.
   */
  lightboxImg.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  /*
   * Close when clicking the dark background.
   */
  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  /*
   * Keyboard navigation.
   */
  document.addEventListener("keydown", function (event) {
    if (!lightbox.classList.contains("active")) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      currentIndex -= 1;
      showCurrentImage();
    }

    if (event.key === "ArrowRight") {
      currentIndex += 1;
      showCurrentImage();
    }
  });

  /*
   * Initial column check.
   */
  updateVisibleColumns();
});

 /* ---------------- 10. CONTACT FORM VALIDATION ---------------- */
document.addEventListener('DOMContentLoaded', function () {

  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async function (e) {

    e.preventDefault();

    // Bootstrap validation
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated');
      return;
    }

    form.classList.add('was-validated');

    const formData = new FormData(form);
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {

      const response = await fetch(
        'https://api.web3forms.com/submit',
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      if (data.success) {

        // Clear all form fields
        form.reset();

        // Remove Bootstrap validation styles
        form.classList.remove('was-validated');

        alert('Success! Your enquiry has been sent.');

        // Redirect to home page
        window.location.href = 'https://www.rekhadesigns.in/';

      } else {

        alert(
          data.message ||
          'Something went wrong. Please try again.'
        );

      }

    } catch (error) {

      console.error('Web3Forms error:', error);

      alert(
        'Something went wrong. Please try again.'
      );

    } finally {

      submitBtn.textContent = originalText;
      submitBtn.disabled = false;

    }

  });

});
    /* ---------------- 11. BACK TO TOP ---------------- */


document.addEventListener("DOMContentLoaded", function () {
    const backToTopButton = document.getElementById("backToTop");

    if (!backToTopButton) return;

    function toggleBackToTopButton() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add("show");
        } else {
            backToTopButton.classList.remove("show");
        }
    }

    window.addEventListener("scroll", toggleBackToTopButton);

    backToTopButton.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    toggleBackToTopButton();
});

// Counter
document.addEventListener("DOMContentLoaded", function () {
    const aboutSection = document.getElementById("about");

    if (!aboutSection) return;

    const counters = aboutSection.querySelectorAll(".stat-num[data-count]");
    let countersStarted = false;

    function animateCounter(counter) {
        const target = Number(counter.getAttribute("data-count"));
        const duration = 1800;
        const startTime = performance.now();

        if (Number.isNaN(target)) return;

        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            /* Smooth animation */
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(target * easedProgress);

            counter.textContent = currentValue.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(updateCounter);
    }

    function startCounters() {
        if (countersStarted) return;

        countersStarted = true;

        counters.forEach(function (counter) {
            animateCounter(counter);
        });
    }

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            function (entries, observerInstance) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        startCounters();
                        observerInstance.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.25
            }
        );

        observer.observe(aboutSection);
    } else {
        /* Fallback for older browsers */
        startCounters();
    }
});



// Modal

document.addEventListener("DOMContentLoaded", function () {
    const offerModalElement = document.getElementById("offerPopupModal");

    if (!offerModalElement || typeof bootstrap === "undefined") {
        return;
    }

    const offerModal = new bootstrap.Modal(offerModalElement);

    setTimeout(function () {
        offerModal.show();
    }, 1500);
});


// Special Offer
(function(){
    const tab      = document.getElementById('specialTab');
    const panel    = document.getElementById('specialPanel');
    const backdrop = document.getElementById('specialBackdrop');
    const closeBtn = document.getElementById('specialClose');
 
    let lastFocused = null;
 
function openPanel(){
  lastFocused = document.activeElement;
  panel.classList.add('is-open');
  backdrop.classList.add('is-open');
  tab.classList.add('is-hidden');
  tab.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  closeBtn.focus();

  // reset the before/after slider each time the panel opens
  const handle = document.getElementById('baHandle');
  const before = document.getElementById('baBefore');
  if (handle && before){
    before.style.clipPath = 'inset(0 50% 0 0)';
    handle.style.left = '50%';
    handle.setAttribute('aria-valuenow', 50);
  }
}
 
    function closePanel(){
      panel.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      tab.classList.remove('is-hidden');
      tab.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }
 
    tab.addEventListener('click', openPanel);
    closeBtn.addEventListener('click', closePanel);
    backdrop.addEventListener('click', closePanel);
 
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && panel.classList.contains('is-open')){
        closePanel();
      }
    });
  })();

  // before and after image slider

  // Before/After drag slider
(function(){
  const slider = document.getElementById('baSlider');
  const before = document.getElementById('baBefore');
  const handle = document.getElementById('baHandle');
  if (!slider || !before || !handle) return;

  let dragging = false;

  function setPosition(percent){
    percent = Math.max(0, Math.min(100, percent));
    before.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    handle.style.left = percent + '%';
    handle.setAttribute('aria-valuenow', Math.round(percent));
  }

  function percentFromClientX(clientX){
    const rect = slider.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  function onPointerDown(e){
    dragging = true;
    handle.setPointerCapture(e.pointerId);
    setPosition(percentFromClientX(e.clientX));
  }

  function onPointerMove(e){
    if (!dragging) return;
    setPosition(percentFromClientX(e.clientX));
  }

  function onPointerUp(e){
    dragging = false;
    if (handle.hasPointerCapture(e.pointerId)){
      handle.releasePointerCapture(e.pointerId);
    }
  }

  // Drag from the handle
  handle.addEventListener('pointerdown', onPointerDown);
  handle.addEventListener('pointermove', onPointerMove);
  handle.addEventListener('pointerup', onPointerUp);
  handle.addEventListener('pointercancel', onPointerUp);

  // Also allow clicking/dragging anywhere on the image to jump the slider
  slider.addEventListener('pointerdown', function(e){
    dragging = true;
    handle.setPointerCapture(e.pointerId);
    setPosition(percentFromClientX(e.clientX));
  });
  slider.addEventListener('pointermove', onPointerMove);
  slider.addEventListener('pointerup', onPointerUp);
  slider.addEventListener('pointercancel', onPointerUp);

  // Keyboard support (left/right arrows) for accessibility
  handle.addEventListener('keydown', function(e){
    const current = parseFloat(handle.style.left) || 50;
    if (e.key === 'ArrowLeft'){ setPosition(current - 5); e.preventDefault(); }
    if (e.key === 'ArrowRight'){ setPosition(current + 5); e.preventDefault(); }
  });

  // Start centered
  setPosition(50);
})();