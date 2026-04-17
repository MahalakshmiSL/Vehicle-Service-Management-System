import { Link } from 'react-router-dom';
import './Landing.css';

const services = [
  {
    icon: '🔧',
    title: 'Engine Diagnostics',
    desc: 'Advanced OBD scanning and full engine health checks for all makes and models.',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  },
  {
    icon: '🛞',
    title: 'Tires & Wheels',
    desc: 'Balancing, rotation, alignment and replacement with premium tyre brands.',
    img: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=600&q=80',
  },
  {
    icon: '🪟',
    title: 'Windscreen Repair',
    desc: 'Chip filling, crack repair and full windscreen replacement with OEM glass.',
    img: 'https://images.unsplash.com/photo-1591293836027-e05b48473b67?w=600&q=80',
  },
  {
    icon: '⚡',
    title: 'Electrical Systems',
    desc: 'Wiring, battery, alternator, starter motor and full electrical diagnostics.',
    img: 'https://images.unsplash.com/photo-1609429019995-8c40f49535a5?w=600&q=80',
  },
  {
    icon: '🧊',
    title: 'AC & Cooling',
    desc: 'Refrigerant recharge, compressor service and radiator flush & fill.',
    img: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&q=80',
  },
  {
    icon: '🛡️',
    title: 'Brakes & Safety',
    desc: 'Pad replacement, disc machining, brake fluid flush and ABS diagnostics.',
    img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',
  },
];

const stats = [
  { icon: '🚗', value: '10K+', label: 'Vehicles Served' },
  { icon: '🏆', value: '25+', label: 'Years Experience' },
  { icon: '🤝', value: '128', label: 'Dealers Served' },
  { icon: '⭐', value: '98%', label: 'Satisfaction Rate' },
];

const features = [
  {
    icon: '🔩',
    title: 'Qualified Technicians',
    desc: 'Certified mechanics with 10+ years of hands-on experience across all makes.',
  },
  {
    icon: '📦',
    title: 'Genuine Spare Parts',
    desc: 'OEM and premium aftermarket parts with full warranty and documentation.',
  },
  {
    icon: '💰',
    title: 'Transparent Pricing',
    desc: 'No hidden charges. Detailed invoices with itemised parts and labour costs.',
  },
  {
    icon: '⏱️',
    title: 'Fast Turnaround',
    desc: 'Same-day service for most repairs. Real-time status tracking on your dashboard.',
  },
];

const whyCards = [
  {
    icon: '🏁',
    title: 'Race-Grade Precision',
    desc: 'Every repair follows OEM service specifications and is double-checked before delivery.',
  },
  
  {
    icon: '🛠️',
    title: 'Full-Spectrum Service',
    desc: 'From a quick oil change to a full engine rebuild — we handle it all under one roof.',
  },
  {
    icon: '🌐',
    title: 'Smart Management',
    desc: 'Our system auto-generates invoices, tracks components, and flags overdue services.',
  },
];

export default function Landing() {
  return (
    <div className="landing">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-photo" />
        <div className="hero-photo-overlay" />
        <div className="hero-grid-overlay" />

        <div className="hero-slide-counter">01 / 05</div>

        <div className="hero-body">
          <div className="hero-left">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Professional Auto Service
            </div>
            <h1 className="hero-title">
              Where Your Car Gets
              <span className="hero-title-accent">The Attention</span>
              It Deserves.
            </h1>
            <p className="hero-sub">
              Complete vehicle service management — from diagnostics to delivery.
              Track repairs, manage components, and handle payments in one place.
            </p>
            <div className="hero-actions">
              <Link to="/vehicles" className="btn-primary">
                Register a Vehicle
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/dashboard" className="btn-ghost">View Revenue</Link>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-client-card">
              <div className="hcc-label">10K+ Satisfied Clients</div>
              <div className="hcc-avatars">
                {['M', 'R', 'S', 'K'].map((l, i) => (
                  <div className="hcc-avatar" key={i}
                    style={{ background: ['linear-gradient(135deg,#cc2200,#e05020)', 'linear-gradient(135deg,#1d4ed8,#3b82f6)', 'linear-gradient(135deg,#065f46,#10b981)', 'linear-gradient(135deg,#92400e,#f59e0b)'][i] }}>
                    {l}
                  </div>
                ))}
              </div>
              <div className="hcc-count">10K+</div>
              <div className="hcc-sub">65 years of reliable service</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="hero-stats-bar">
        {stats.map(s => (
          <div className="hero-stat" key={s.label}>
            <div className="hs-icon">{s.icon}</div>
            <div>
              <div className="hs-value">{s.value}</div>
              <div className="hs-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── ABOUT ── */}
      <section className="about">
        <div className="about-inner">

          {/* Photo mosaic */}
          <div className="about-visual">
            <div className="av-main">
              <img
                src="https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=900&q=85"
                alt="Mechanic working on engine"
              />
              <div className="av-main-overlay" />
            </div>

            <div className="av-secondary">
              <img
                src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=85"
                alt="Car interior dashboard"
              />
            </div>

            {/* 25 years badge */}
            <div className="av-badge">
              <span className="av-badge-num">25</span>
              <span className="av-badge-text">Years of<br/>Excellence</span>
            </div>

            {/* Floating satisfaction card */}
            <div className="av-stat-card">
              <div className="av-stat-icon">⭐</div>
              <div>
                <div className="av-stat-num">98%</div>
                <div className="av-stat-lbl">Client Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="about-text">
            <div className="about-tag">Who We Are</div>
            <h2 className="about-title">
              Expert Care for<br/>
              <span>Every Vehicle</span>
            </h2>
            <p className="about-desc">
              Our garage management system gives your workshop the tools to deliver
              fast, transparent, professional service — every time. Register vehicles,
              log issues, assign parts, and generate invoices all from one dashboard.
              Proudly serving Bengaluru's auto industry since 1999.
            </p>

            <div className="about-features">
              {features.map(f => (
                <div className="about-feature" key={f.title}>
                  <div className="af-icon">{f.icon}</div>
                  <div>
                    <div className="af-title">{f.title}</div>
                    <div className="af-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="about-cta">
              <Link to="/vehicles" className="btn-primary">
                Register a Vehicle
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/dashboard" className="about-cta-link">
                View Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="why">
        <div className="why-bg-img" />
        <div className="why-inner">
          <div className="why-header">
            <div className="why-tag">Why Choose Us</div>
            <h2 className="why-title">Built for Pros. Trusted by Hundreds.</h2>
            <p className="why-desc">
              We combine decades of mechanical expertise with modern digital tools to
              deliver a service experience that's fast, honest, and thorough.
            </p>
            <div className="why-phone">
              <span className="why-phone-label">Call Us Now</span>
              <span className="why-phone-num">+91 98765 43210</span>
            </div>
          </div>

          <div className="why-cards">
            {whyCards.map(c => (
              <div className="why-card" key={c.title}>
                <span className="wc-icon">{c.icon}</span>
                <div className="wc-title">{c.title}</div>
                <div className="wc-desc">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="services">
        <div className="services-header">
          <div className="section-tag">What We Do</div>
          <h2 className="section-title">Auto Repair Services</h2>
          <p className="section-sub">Comprehensive care for every part of your vehicle</p>
        </div>
        <div className="services-grid">
          {services.map(s => (
            <div className="service-card" key={s.title}>
              <div className="service-card-img">
                <img className="service-card-img-bg" src={s.img} alt={s.title} />
                <div className="service-card-img-overlay" />
                <span className="service-card-img-icon">{s.icon}</span>
              </div>
              <div className="service-body">
                <h3 className="service-title">{s.title}</h3>
                <p className="service-desc">{s.desc}</p>
                <div className="service-link">Learn More →</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <div className="cta-bg" />
        <div className="cta-overlay" />
        <div className="cta-content">
          <h2 className="cta-title">Ready to Manage Your Garage?</h2>
          <p className="cta-sub">Start adding vehicles, logging issues, and tracking revenue today.</p>
          <div className="cta-actions">
            <Link to="/components" className="btn-primary">⚙ Manage Components</Link>
            <Link to="/vehicles" className="btn-white">🚗 Add Vehicle</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                <rect width="36" height="36" rx="8" fill="#cc2200"/>
                <path d="M9 26 L13 14 L18 21 L23 11 L27 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <circle cx="18" cy="18" r="3.5" fill="white" opacity="0.9"/>
              </svg>
              <span className="footer-brand-name">GARAGE</span>
            </div>
            <p className="footer-brand-desc">Professional vehicle service management system. Built for garages that take their craft seriously.</p>
          </div>
          <div className="footer-links-group">
            <h4>Management</h4>
            <Link to="/components">Components</Link>
            <Link to="/vehicles">Vehicles</Link>
            <Link to="/issues">Issues</Link>
            <Link to="/payments">Invoices</Link>
            <Link to="/dashboard">Revenue</Link>
          </div>
          <div className="footer-links-group">
            <h4>Services</h4>
            <span>Engine Diagnostics</span>
            <span>Tires & Wheels</span>
            <span>Brake Service</span>
            <span>AC & Cooling</span>
            <span>Electrical</span>
          </div>
          <div className="footer-links-group">
            <h4>Contact</h4>
            <span>📍 Bengaluru, Karnataka</span>
            <span>📞 +91 98765 43210</span>
            <span>✉️ service@garage.in</span>
            <span>🕐 Mon–Sat: 8AM – 6PM</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Garage Service Management. Built with React + Django.</span>
          <span className="footer-tech">
            <span className="tech-pill">React</span>
            <span className="tech-pill">Django REST</span>
            <span className="tech-pill">SQLite</span>
          </span>
        </div>
      </footer>

    </div>
  );
}