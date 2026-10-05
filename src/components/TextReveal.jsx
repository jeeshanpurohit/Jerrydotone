import React, { useEffect, useRef, useState } from "react";

/**
 * TextReveal — viewport-triggered text entrance animations
 * type: "slide-up" | "stagger-chars" | "tracking-expand" | "fade-up"
 */
export function TextReveal({ children, type = "slide-up", delay = 0, tag: Tag = "div", className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (type === "stagger-chars") {
    const text = typeof children === "string" ? children : "";
    return (
      <Tag ref={ref} className={`tr-stagger-chars${visible ? " visible" : ""} ${className}`} style={{ "--tr-delay": `${delay}ms` }}>
        {text.split("").map((ch, i) => (
          <span key={i} className="tr-char" style={{ "--i": i, "--total": text.length }}>
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </Tag>
    );
  }

  if (type === "tracking-expand") {
    return (
      <Tag ref={ref} className={`tr-tracking${visible ? " visible" : ""} ${className}`} style={{ "--tr-delay": `${delay}ms` }}>
        {children}
      </Tag>
    );
  }

  if (type === "fade-up") {
    return (
      <Tag ref={ref} className={`tr-fade-up${visible ? " visible" : ""} ${className}`} style={{ "--tr-delay": `${delay}ms` }}>
        {children}
      </Tag>
    );
  }

  // default: slide-up (clip mask)
  return (
    <Tag ref={ref} className={`tr-slide-up${visible ? " visible" : ""} ${className}`} style={{ "--tr-delay": `${delay}ms` }}>
      <span className="tr-inner">{children}</span>
    </Tag>
  );
}
