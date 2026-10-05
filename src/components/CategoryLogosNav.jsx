import React from "react";

export const CATEGORIES_DATA = [
  {
    id: "graphic-design",
    domain: "jerry.art",
    title: "Graphic Design & Flyers",
    logo: "/assets/logos/Jerrydotart.svg",
    badge: "Flyers & Posts"
  },
  {
    id: "video-editing",
    domain: "jerry.mov",
    title: "Commercial Videos & Reels",
    logo: "/assets/logos/Jerrydotmov.svg",
    badge: "Commercial Films"
  },
  {
    id: "photography",
    domain: "jerry.dng",
    title: "Photography & RAW",
    logo: "/assets/logos/Jerrydotdng.svg",
    badge: "35mm RAW Series"
  },
  {
    id: "case-studies",
    domain: "jerry.one",
    title: "UX Case Studies",
    logo: "/assets/logos/Jerrydotone.svg",
    badge: "Case Studies"
  }
];

export default function CategoryLogosNav({
  activeCategory,
  onSelectCategory,
  categoryCounts = {}
}) {
  const currentCat = CATEGORIES_DATA.find(c => c.id === activeCategory) || CATEGORIES_DATA[0];

  return (
    <div className="sp-logo-dock-wrap">
      {/* 4 Brand Logo Buttons */}
      <div className="sp-logo-dock">
        {CATEGORIES_DATA.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`sp-logo-tab-btn ${isActive ? "active" : ""}`}
              title={`${cat.domain} / ${cat.title}`}
              aria-label={`${cat.domain} / ${cat.title}`}
            >
              <img src={cat.logo} alt={cat.domain} />
              {isActive && <span className="sp-tab-active-dot" />}
            </button>
          );
        })}
      </div>

      {/* Sub-label under the dock showing active discipline */}
      <div className="sp-active-discipline-label">
        <span>{currentCat.domain}</span>
        <span className="sp-dot-sep">•</span>
        <span>{currentCat.title}</span>
        {categoryCounts[currentCat.id] !== undefined && (
          <span className="sp-count-pill">
            {categoryCounts[currentCat.id]} {categoryCounts[currentCat.id] === 1 ? "Item" : "Items"}
          </span>
        )}
      </div>
    </div>
  );
}
