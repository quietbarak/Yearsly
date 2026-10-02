const fs = require('fs');
const path = require('path');

const root = path.join('G:', 'My Drive', 'Projects', 'Yearsly-main', 'Age Calculator');

// 1. Update style.css
const cssPath = path.join(root, 'css', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Replace Root Tokens
css = css.replace(/:root\s*\{[^}]+\}/m, `:root {
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 24px;
  --spacing-6: 32px;
  --spacing-8: 48px;
  --spacing-10: 64px;
  --spacing-12: 80px;

  --bg:            #f8fafc;
  --bg-card:       #ffffff;
  --bg-card-hover: #f1f5f9;
  --border:        #e2e8f0;
  --border-subtle: #f1f5f9;
  --accent:        #4f46e5;
  --accent-hover:  #4338ca;
  --accent-light:  #e0e7ff;
  --accent-glow:   rgba(79, 70, 229, 0.25);
  --success:       #16a34a;
  --success-light: #dcfce7;
  --error:         #ef4444;
  --error-light:   #fee2e2;
  --text:          #0f172a;
  --text-light:    #334155;
  --text-muted:    #64748b;
  --radius:        16px;
  --radius-sm:     8px;
  --shadow-sm:     0 1px 3px rgba(0,0,0,0.05);
  --shadow-card:   0 10px 25px -5px rgba(0,0,0,0.04), 0 8px 10px -6px rgba(0,0,0,0.01);
  --shadow-hover:  0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01);
  --t:             0.2s cubic-bezier(0.4, 0, 0.2, 1);
}`);

// Add Global Reveal animations and better Typography
css = css.replace(/body\s*\{[^}]+\}/m, `body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  font-size: 16px;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Animations */
.reveal {
  opacity: 0;
  transform: translateY(15px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
.reveal.active {
  opacity: 1;
  transform: translateY(0);
}
.reveal-d1 { transition-delay: 100ms; }
.reveal-d2 { transition-delay: 200ms; }
.reveal-d3 { transition-delay: 300ms; }
`);

// Header styles
css = css.replace(/\.header\s*\{[^}]+\}/m, `.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  transition: box-shadow var(--t);
}
.header.scrolled {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}`);

css = css.replace(/\.nav-links a\s*\{[^}]+\}/m, `.nav-links a {
  color: var(--text-light);
  font-size: 14.5px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  transition: background var(--t), color var(--t), transform var(--t);
  display: inline-block;
}`);

css = css.replace(/\.nav-links a:hover\s*\{[^}]+\}/m, `.nav-links a:hover { 
  background: var(--bg-card-hover); 
  color: var(--text);
  transform: translateY(-1px);
}`);

// Hero styles
css = css.replace(/\.hero\s*\{[^}]+\}/m, `.hero {
  padding: var(--spacing-8) 0 var(--spacing-5);
  text-align: center;
}`);

css = css.replace(/\.hero h1\s*\{[^}]+\}/m, `.hero-eyebrow {
  display: block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent);
  margin-bottom: var(--spacing-3);
}
.hero h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: var(--text);
  margin-bottom: var(--spacing-4);
  letter-spacing: -0.02em;
  line-height: 1.1;
}`);

// Layout
css = css.replace(/\.calc-layout\s*\{[^}]+\}/m, `.calc-layout {
  display: grid;
  grid-template-columns: 240px minmax(auto, 500px) 240px;
  justify-content: center;
  gap: var(--spacing-6);
  align-items: start;
}`);

css = css.replace(/\.calc-section\s*\{[^}]+\}/m, `.calc-section { padding: var(--spacing-4) 0 var(--spacing-10); }`);

// Card
css = css.replace(/\.calculator-card\s*\{[^}]+\}/m, `.calculator-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--t);
}
.calculator-card:hover {
  box-shadow: var(--shadow-hover);
}`);

// Side panels
css = css.replace(/\.side-panel\s*\{[^}]+\}/m, `.side-panel {
  background: transparent;
  border: none;
  padding: 0;
}`);

css = css.replace(/\.side-panel h3\s*\{[^}]+\}/m, `.side-panel h3 {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: var(--spacing-4);
}`);

css = css.replace(/\.side-panel ul li\s*\{[^}]+\}/m, `.side-panel ul li {
  font-size: 14px;
  color: var(--text-light);
  padding-left: 28px;
  position: relative;
  line-height: 1.5;
  margin-bottom: var(--spacing-4);
}
.side-panel ul li strong {
  display: block;
  color: var(--text);
  font-size: 14.5px;
  margin-bottom: 2px;
}`);

css = css.replace(/\.side-panel ul li::before\s*\{[^}]+\}/m, `.side-panel ul li::before {
  content: url('data:image/svg+xml;utf8,<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="%2316a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>');
  position: absolute;
  left: 0;
  top: 0;
}`);

// Inputs
css = css.replace(/\.form-group input\[type="date"\],[\s\S]*?\{[^}]+\}/m, `.form-group input[type="date"],
.form-group input[type="text"],
.form-group input[type="email"],
.form-group textarea {
  width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  font-size: 15px;
  font-family: inherit;
  color: var(--text);
  outline: none;
  transition: border-color var(--t), box-shadow var(--t);
  -webkit-appearance: none;
  appearance: none;
  color-scheme: light;
  box-shadow: var(--shadow-sm);
}`);

css = css.replace(/\.form-group input\[type="date"\]:focus,[\s\S]*?\{[^}]+\}/m, `.form-group input[type="date"]:focus,
.form-group input[type="text"]:focus,
.form-group input[type="email"]:focus,
.form-group textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-glow);
}`);

// Buttons
css = css.replace(/\.btn\s*\{[^}]+\}/m, `.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 16px 24px;
  background: var(--accent);
  color: #fff;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: transform var(--t), box-shadow var(--t), background var(--t);
  box-shadow: 0 4px 14px var(--accent-glow);
  margin-top: var(--spacing-2);
}`);
css = css.replace(/\.btn:hover\s*\{\s*transform:\s*translateY\(-2px\)[^}]+\}/m, `.btn:hover  { transform: translateY(-2px); box-shadow: 0 6px 20px var(--accent-glow); background: var(--accent-hover); }`);
css = css.replace(/\.btn:active\s*\{\s*transform:\s*translateY\(0\)[^}]+\}/m, `.btn:active { transform: translateY(1px); }`);

// Result Area
css = css.replace(/\.result-box\.active\s*\{[^}]+\}/m, `.result-box.active {
  opacity: 1;
  max-height: 700px;
  margin-top: var(--spacing-5);
}`);

css = css.replace(/\.result-age\s*\{[^}]+\}/m, `.result-age {
  font-size: clamp(1.4rem, 3vw, 1.8rem);
  font-weight: 800;
  color: var(--accent);
  text-align: center;
  padding: var(--spacing-5) var(--spacing-4) var(--spacing-4);
  background: var(--accent-light);
  border: 1px solid var(--accent-light);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  letter-spacing: -0.02em;
  line-height: 1.2;
}`);

css = css.replace(/\.result-details\s*\{[^}]+\}/m, `.result-details {
  padding: var(--spacing-4) var(--spacing-5);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-top: none;
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
}`);

css = css.replace(/\.result-details p\s*\{[^}]+\}/m, `.result-details p {
  font-size: 14.5px;
  color: var(--text-light);
  padding: 10px 0;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
}`);

// Tools Section
css = css.replace(/\.tools-grid\s*\{[^}]+\}/m, `.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-6);
  margin-top: var(--spacing-6);
}`);

css = css.replace(/\.tool-card\s*\{[^}]+\}/m, `.tool-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--spacing-6);
  text-align: left;
  transition: transform var(--t), box-shadow var(--t), border-color var(--t);
  display: flex;
  flex-direction: column;
}
.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
  border-color: var(--accent-light);
}`);

css = css.replace(/\.tool-card h3\s*\{[^}]+\}/m, `.tool-card h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: var(--spacing-2);
}`);

css = css.replace(/\.tool-card p\s*\{[^}]+\}/m, `.tool-card p {
  font-size: 14.5px;
  color: var(--text-light);
  margin-bottom: var(--spacing-5);
  flex-grow: 1;
}`);

css = css.replace(/\.tool-link\s*\{[^}]+\}/m, `.tool-link {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--accent);
}
.tool-link::after {
  content: '→';
  margin-left: 6px;
  transition: transform var(--t);
}
.tool-card:hover .tool-link::after {
  transform: translateX(4px);
}`);

// Footer
css = css.replace(/\.footer\s*\{[^}]+\}/m, `.footer {
  background: var(--bg-card);
  border-top: 1px solid var(--border);
  padding: var(--spacing-10) 0 var(--spacing-6);
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--spacing-8);
  margin-bottom: var(--spacing-8);
}
.footer-brand p {
  color: var(--text-light);
  font-size: 14.5px;
  margin-top: var(--spacing-3);
  max-width: 300px;
}
.footer-col h4 {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text);
  margin-bottom: var(--spacing-4);
}
.footer-col ul {
  list-style: none;
}
.footer-col ul li {
  margin-bottom: var(--spacing-3);
}
.footer-col ul a {
  color: var(--text-light);
  font-size: 14px;
}
.footer-col ul a:hover {
  color: var(--accent);
}
.footer-bottom {
  padding-top: var(--spacing-6);
  border-top: 1px solid var(--border-subtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: var(--text-muted);
}`);

// Media Queries
css = css.replace(/@media \(max-width: 768px\) \{[\s\S]*?\}\s*$/m, `@media (max-width: 900px) {
  .calc-layout {
    grid-template-columns: 1fr;
  }
  .side-panel { display: none; } /* Hide on tablet/mobile for simpler layout */
}
@media (max-width: 768px) {
  .hero { padding: var(--spacing-6) 0 var(--spacing-4); }
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .footer-brand { grid-column: 1 / -1; }
  .footer-bottom { flex-direction: column; gap: var(--spacing-3); text-align: center; }
}`);

fs.writeFileSync(cssPath, css);

// 2. Update HTML Files
const htmlFiles = ['index.html', 'age-calculator.html', 'date-difference.html', 'age-difference.html', 'birthday-countdown.html'];

for (const file of htmlFiles) {
  const fp = path.join(root, file);
  if (!fs.existsSync(fp)) continue;
  let html = fs.readFileSync(fp, 'utf8');

  // Add scroll listener to JS
  // Done via separate update in calculator.js

  // Update Hero Section
  html = html.replace(/<h1>([^<]+)<\/h1>/, `<span class="hero-eyebrow reveal">Free Utility Tool</span>\n            <h1 class="reveal reveal-d1">$1</h1>`);
  html = html.replace(/<p>([^<]+)<\/p>/, `<p class="reveal reveal-d2">$1</p>`);

  // Wrap section containers
  html = html.replace(/<section class="calc-section">/g, `<section class="calc-section reveal reveal-d3">`);
  html = html.replace(/<section class="tools-section">/g, `<section class="tools-section reveal">`);

  // Update side panel "Why Yearsly"
  html = html.replace(/<aside class="side-panel why-panel">[\s\S]*?<\/aside>/, `<aside class="side-panel why-panel">
                <h3>Why Yearsly?</h3>
                <ul>
                    <li><strong>100% Free</strong>No hidden costs.</li>
                    <li><strong>No Sign-up</strong>Start instantly.</li>
                    <li><strong>Accurate</strong>Precise math.</li>
                    <li><strong>Private</strong>Runs in browser.</li>
                    <li><strong>Leap Years</strong>Handled correctly.</li>
                </ul>
            </aside>`);

  // Update Footer
  html = html.replace(/<footer class="footer">[\s\S]*?<\/footer>/, `<footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <img src="images/logo.svg" alt="Yearsly" style="height: 32px">
                    <p>Free, fast, and accurate online calculators for everyday date calculations.</p>
                </div>
                <div class="footer-col">
                    <h4>Tools</h4>
                    <ul>
                        <li><a href="age-calculator.html">Age Calculator</a></li>
                        <li><a href="date-difference.html">Date Difference</a></li>
                        <li><a href="birthday-countdown.html">Birthday Countdown</a></li>
                        <li><a href="age-difference.html">Age Difference</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="about.html">About</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Legal</h4>
                    <ul>
                        <li><a href="privacy-policy.html">Privacy Policy</a></li>
                        <li><a href="terms.html">Terms</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Yearsly. All rights reserved.</p>
            </div>
        </div>
    </footer>`);

  fs.writeFileSync(fp, html);
}

// 3. Update calculator.js for intersection observer
const jsPath = path.join(root, 'js', 'calculator.js');
let js = fs.readFileSync(jsPath, 'utf8');
if (!js.includes('IntersectionObserver')) {
  js += `\n
// Scroll reveal observer
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Header scroll shadow
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });
});
`;
  fs.writeFileSync(jsPath, js);
}
