/**
 * Interactive Mask Reveal System
 * Blends between the developer's human portrait and the Spider-Man suit mask
 */

export function initMaskReveal() {
  const container = document.querySelector('.about-avatar-container');
  if (!container) return;

  // Toggle mask on click / tap (great for touch devices)
  container.addEventListener('click', () => {
    container.classList.toggle('mask-locked');
    const humanImg = container.querySelector('.avatar-human');
    const maskImg = container.querySelector('.avatar-mask');

    if (container.classList.contains('mask-locked')) {
      humanImg.style.opacity = '0';
      maskImg.style.opacity = '1';
    } else {
      humanImg.style.opacity = '1';
      maskImg.style.opacity = '0';
    }
  });

  // Reset when mouse leaves if not locked
  container.addEventListener('mouseleave', () => {
    if (!container.classList.contains('mask-locked')) {
      const humanImg = container.querySelector('.avatar-human');
      const maskImg = container.querySelector('.avatar-mask');
      humanImg.style.opacity = '';
      maskImg.style.opacity = '';
    }
  });
}
