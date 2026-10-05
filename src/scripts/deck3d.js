/**
 * 3D Persona Deck Carousel & Parallax Engine
 * Recreates the 3D multi-layered card deck from Reference.MOV
 */

export class Deck3D {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.stage = this.container.querySelector('.deck3d-stage');
    this.cards = Array.from(this.container.querySelectorAll('.deck-card'));
    this.dots = Array.from(this.container.querySelectorAll('.deck-dot'));
    this.tabs = Array.from(document.querySelectorAll('.mode-tab-btn'));
    this.prevBtn = this.container.querySelector('.deck-nav-prev');
    this.nextBtn = this.container.querySelector('.deck-nav-next');

    this.currentIndex = 0;
    this.totalCards = this.cards.length;

    // Mouse tilt / parallax state
    this.targetRotateX = 0;
    this.targetRotateY = 0;
    this.currentRotateX = 0;
    this.currentRotateY = 0;
    this.isHovering = false;

    // Drag / swipe state
    this.startX = 0;
    this.isDragging = false;

    this.init();
  }

  init() {
    this.updateCardPositions();
    this.bindEvents();
    this.startParallaxLoop();
  }

  updateCardPositions() {
    this.cards.forEach((card, idx) => {
      card.classList.remove('is-active', 'is-prev', 'is-next', 'is-hidden');

      if (idx === this.currentIndex) {
        card.classList.add('is-active');
      } else if (idx === (this.currentIndex - 1 + this.totalCards) % this.totalCards) {
        card.classList.add('is-prev');
      } else if (idx === (this.currentIndex + 1) % this.totalCards) {
        card.classList.add('is-next');
      } else {
        card.classList.add('is-hidden');
      }
    });

    // Update pagination dots
    this.dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === this.currentIndex);
    });

    // Update mode tabs
    this.tabs.forEach((tab, idx) => {
      tab.classList.toggle('active', idx === this.currentIndex);
    });
  }

  goTo(index) {
    if (index < 0) {
      this.currentIndex = this.totalCards - 1;
    } else if (index >= this.totalCards) {
      this.currentIndex = 0;
    } else {
      this.currentIndex = index;
    }
    this.updateCardPositions();
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  prev() {
    this.goTo(this.currentIndex - 1);
  }

  bindEvents() {
    // Navigation buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.prev();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.next();
      });
    }

    // Pagination dots
    this.dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => this.goTo(idx));
    });

    // Mode tabs
    this.tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => this.goTo(idx));
    });

    // Card click navigation
    this.cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        if (card.classList.contains('is-prev')) {
          this.prev();
        } else if (card.classList.contains('is-next')) {
          this.next();
        }
      });
    });

    // Mouse move parallax on the stage wrapper
    const wrapper = this.container.querySelector('.deck3d-stage-wrapper');
    if (wrapper) {
      wrapper.addEventListener('mouseenter', () => {
        this.isHovering = true;
      });

      wrapper.addEventListener('mouseleave', () => {
        this.isHovering = false;
        this.targetRotateX = 0;
        this.targetRotateY = 0;
      });

      wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) / (rect.width / 2);
        const deltaY = (e.clientY - centerY) / (rect.height / 2);

        // Clamped tilt angles
        this.targetRotateY = deltaX * 14;  // -14 to +14 deg
        this.targetRotateX = -deltaY * 12; // -12 to +12 deg
      });

      // Touch / Swipe support
      wrapper.addEventListener('touchstart', (e) => {
        this.startX = e.touches[0].clientX;
        this.isDragging = true;
      }, { passive: true });

      wrapper.addEventListener('touchend', (e) => {
        if (!this.isDragging) return;
        this.isDragging = false;
        const endX = e.changedTouches[0].clientX;
        const diffX = endX - this.startX;

        if (Math.abs(diffX) > 40) {
          if (diffX > 0) {
            this.prev();
          } else {
            this.next();
          }
        }
      });
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.prev();
      } else if (e.key === 'ArrowRight') {
        this.next();
      }
    });

    // Tap on avatar to toggle mask on mobile
    const avatarDiscs = this.container.querySelectorAll('.deck-avatar-stage');
    avatarDiscs.forEach(avatar => {
      avatar.addEventListener('click', (e) => {
        e.stopPropagation();
        const parentCard = avatar.closest('.deck-card');
        if (parentCard) {
          parentCard.classList.toggle('is-mask-active');
        }
      });
    });
  }

  startParallaxLoop() {
    const animate = () => {
      // Smooth lerp damping
      const ease = 0.08;
      this.currentRotateX += (this.targetRotateX - this.currentRotateX) * ease;
      this.currentRotateY += (this.targetRotateY - this.currentRotateY) * ease;

      const activeCard = this.container.querySelector('.deck-card.is-active');
      if (activeCard && this.isHovering) {
        activeCard.style.transform = `translate3d(0, 0, 0) rotateX(${this.currentRotateX.toFixed(2)}deg) rotateY(${this.currentRotateY.toFixed(2)}deg)`;

        // Give floating widgets micro parallax offset based on rotation
        const widgets = activeCard.querySelectorAll('.floating-widget');
        widgets.forEach(widget => {
          const zDepth = widget.getAttribute('data-z') || '75';
          const shiftX = this.currentRotateY * 0.8;
          const shiftY = -this.currentRotateX * 0.8;
          widget.style.transform = `translateZ(${zDepth}px) translate3d(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px, 0)`;
        });
      } else if (activeCard && !this.isHovering) {
        activeCard.style.transform = `translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)`;
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }
}
