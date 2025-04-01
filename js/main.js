document.addEventListener('DOMContentLoaded', function () {
  // 1) Obscure email
  const emailLink = document.getElementById('email-link');
  const user = 'hello.mattiadelotto';
  const domain = 'gmail.com';
  emailLink.href = `mailto:${user}@${domain}`;

  // 2) Toggle Archive / Collapsed
  const archiveBtn = document.getElementById('archive-btn');
  const catalogue = document.getElementById('catalogue');
  const searchContainer = document.getElementById('search-container');
  window.toggleArchive = function () {
    document.body.classList.toggle('collapsed');
    archiveBtn.classList.toggle('active');
    const isActive = catalogue.classList.toggle('active');

    if (isActive) {
      catalogue.style.display = 'block';
      requestAnimationFrame(() => {
        catalogue.style.opacity = '1';
        catalogue.style.transform = 'translateY(0)';
      });
      searchContainer.style.display = 'flex';
    } else {
      catalogue.style.opacity = '0';
      catalogue.style.transform = 'translateY(80px)';
      setTimeout(() => (catalogue.style.display = 'none'), 600);
      searchContainer.style.display = 'none';
    }
  };

  // 3) Expand .details
  window.toggleDetails = function (row) {
    row.classList.toggle('expanded');
  };

  // 4) Sorting
  let currentSort = { column: null, ascending: true };
  window.sortTable = function (colIndex) {
    const rows = Array.from(catalogue.querySelectorAll('.table-row:not(.table-head)'));
    if (currentSort.column === colIndex) {
      currentSort.ascending = !currentSort.ascending;
    } else {
      currentSort.column = colIndex;
      currentSort.ascending = true;
    }
    const sorted = rows.sort((a, b) => {
      const aText = a.children[colIndex].textContent.trim().toLowerCase();
      const bText = b.children[colIndex].textContent.trim().toLowerCase();
      return currentSort.ascending
        ? aText.localeCompare(bText, undefined, { numeric: true })
        : bText.localeCompare(aText, undefined, { numeric: true });
    });
    sorted.forEach((row) => catalogue.appendChild(row));
    for (let i = 0; i < 5; i++) {
      const arrow = document.getElementById(`arrow-${i}`);
      arrow.textContent = i === colIndex ? (currentSort.ascending ? '↑' : '↓') : '';
    }
  };

  // 5) Search/Filter
  window.filterCatalogue = function () {
    const input = document.getElementById('search-input');
    const filter = input.value.toLowerCase();
    const rows = document.querySelectorAll('.table-row:not(.table-head)');
    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(filter) ? '' : 'none';
    });
  };

  // 6) Toggling the search input
  document.getElementById('search-toggle').addEventListener('click', () => {
    const input = document.getElementById('search-input');
    input.style.display = input.style.display === 'inline-block' ? 'none' : 'inline-block';
    if (input.style.display === 'inline-block') input.focus();
  });

  // 7) Lightbox overlay for .image-gallery images
  const overlay = document.getElementById('lightbox-overlay');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');
  const lbImg = document.getElementById('lightbox-img');

let images = [];
let currentIndex = 0;

document.querySelectorAll('.image-gallery img').forEach((img) => {
  img.addEventListener('click', (e) => {
    e.stopPropagation();

    const gallery = img.closest('.image-gallery');
    images = Array.from(gallery.querySelectorAll('img'));
    currentIndex = images.indexOf(img);

    showLightbox();
  });
});

  function showLightbox() {
    lbImg.src = images[currentIndex].src;
    overlay.style.display = 'flex';
  }

  function hideLightbox() {
    overlay.style.display = 'none';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lbImg.src = images[currentIndex].src;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lbImg.src = images[currentIndex].src;
  }

  lbClose.addEventListener('click', hideLightbox);
  lbPrev.addEventListener('click', showPrev);
  lbNext.addEventListener('click', showNext);

  overlay.addEventListener('click', (e) => {
    if (overlay.style.display === 'none') return;
    const imgRect = lbImg.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    if (mouseX < imgRect.left || mouseX > imgRect.right || mouseY < imgRect.top || mouseY > imgRect.bottom) {
      hideLightbox();
    } else {
      const midpointX = (imgRect.left + imgRect.right) / 2;
      if (mouseX < midpointX) {
        showPrev();
      } else {
        showNext();
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.keyCode === 27) {
      hideLightbox();
    } else if (e.key === 'ArrowRight') {
      showNext();
    } else if (e.key === 'ArrowLeft') {
      showPrev();
    }
  });

  overlay.addEventListener('mousemove', (e) => {
    if (overlay.style.display === 'none') return;
    const imgRect = lbImg.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const escCursor = "url('img/esc-lightbox.png') 15 15, pointer";
    const leftCursor = "url('img/arrow-left-lightbox.png') 15 15, pointer";
    const rightCursor = "url('img/arrow-right-lightbox.png') 15 15, pointer";

    if (mouseX < imgRect.left || mouseX > imgRect.right || mouseY < imgRect.top || mouseY > imgRect.bottom) {
      overlay.style.cursor = escCursor;
    } else {
      const midpointX = (imgRect.left + imgRect.right) / 2;
      overlay.style.cursor = mouseX < midpointX ? leftCursor : rightCursor;
    }
  });
});
