import React from 'react';
import { Link } from 'react-router-dom';
import { personalInfo, brandIdentities } from '../data/portfolioData';

export function Footer() {
  const identitiesList = Object.values(brandIdentities);

  return (
    <footer className="monolith-footer">
      <div className="footer-inner">
        {/* Top Atelier Row: 4 Sister Brands */}
        <div className="footer-identities-section">
          <div className="footer-identities-label">// ATELIER MARKS &amp; DISCIPLINES</div>
          <div className="footer-identities-grid">
            {identitiesList.map((brand) => (
              <Link
                key={brand.slug}
                to="/projects"
                className="footer-brand-chip"
                title={`${brand.name} / ${brand.discipline}`}
              >
                <div className="footer-brand-chip-icon-wrap">
                  <img src={brand.logo} alt={brand.name} className="footer-brand-svg" />
                </div>
                <div className="footer-brand-chip-info">
                  <span className="footer-brand-chip-name">{brand.name}</span>
                  <span className="footer-brand-chip-role">{brand.role}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Middle Brand & Links Row */}
        <div className="footer-main-row">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
              <img src="/assets/logos/Jerrydotone.svg" alt="Jerrydotone" style={{ width: '28px', height: '28px' }} />
              <span style={{ fontFamily: 'var(--font-grotesque)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--near-white)' }}>
                JEESHAN PUROHIT<span className="brand-dot">.</span>
              </span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--near-white-muted)', fontFamily: 'var(--font-mono)' }}>
              STAFF DESIGN TECHNOLOGIST &amp; UI ARCHITECT &bull; JAIPUR &amp; JODHPUR
            </div>
          </div>

          {/* Quick Page Links */}
          <div className="footer-nav-links" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/" style={{ color: 'var(--near-white-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Home</Link>
            <Link to="/projects" style={{ color: 'var(--near-white-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Projects</Link>
            <Link to="/services" style={{ color: 'var(--near-white-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Services</Link>
            <Link to="/experience" style={{ color: 'var(--near-white-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Experience</Link>
            <Link to="/contact" style={{ color: 'var(--near-white-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>Contact</Link>
          </div>

          <div className="footer-socials">
            <a href={personalInfo.behance} target="_blank" rel="noopener noreferrer" className="footer-social-btn">
              BEHANCE &rarr;
            </a>
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="footer-social-btn">
              LINKEDIN &rarr;
            </a>
            <a href={`mailto:${personalInfo.email}`} className="footer-social-btn">
              EMAIL &rarr;
            </a>
            <a href={`tel:${personalInfo.phone}`} className="footer-social-btn">
              +91-9413564618
            </a>
          </div>
        </div>

        {/* Bottom Minimal Copyright */}
        <div className="footer-copy">
          <div>
            &copy; {new Date().getFullYear()} JEESHAN PUROHIT. JERRYDOTONE ATELIER. ALL RIGHTS RESERVED.
          </div>
          <div style={{ marginTop: '0.4rem', color: 'var(--primary)' }}>
            "Bridging cognitive interaction design, interface aesthetics, and raw computational efficiency."
          </div>
        </div>
      </div>
    </footer>
  );
}
