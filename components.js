async function loadComponent(containerId, filePath) {
  const container = document.getElementById(containerId);

  if (!container) {
    return;
  }

  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Failed to load component: ${filePath}`);
    }

    container.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
}

function setActiveNavigation() {
  const currentPage = document.body.dataset.page;

  if (!currentPage) {
    return;
  }

  document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
    link.classList.remove("active");

    if (link.dataset.page === currentPage) {
      link.classList.add("active");
    }
  });
}

function setCurrentYear() {
  const yearElement = document.getElementById("current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadComponent("site-header", "components/header.html"),
    loadComponent("site-footer", "components/footer.html"),
  ]);

  setActiveNavigation();
  setCurrentYear();
});