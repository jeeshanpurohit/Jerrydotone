import '../styles/main.css';
import '../styles/deck3d.css';
import '../styles/animations.css';
import '../styles/responsive.css';

import { Deck3D } from './deck3d.js';
import { initMaskReveal } from './maskReveal.js';
import { initPortfolio } from './portfolio.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize 3D Persona Deck
  new Deck3D('.deck3d-section');

  // Initialize Mask Reveal in About section
  initMaskReveal();

  // Initialize Portfolio general logic
  initPortfolio();

  console.log('Spider-Hero Persona Portfolio initialized successfully.');
});
