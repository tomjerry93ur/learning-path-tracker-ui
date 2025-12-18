import { Link } from "react-router-dom";
import "../App.css";

const structureHighlights = [
  {
    icon: "↗",
    title: "Define Clear Paths",
    description:
      "Structure your learning or projects into coherent, easy-to-follow paths and see the bigger picture."
  },
  {
    icon: "☰",
    title: "Break into Sections",
    description: "Divide complex paths into manageable modules and keep momentum without feeling overwhelmed."
  },
  {
    icon: "✔",
    title: "Complete Actionable Tasks",
    description: "Each section includes precise tasks so you can track every win and celebrate steady progress."
  }
];

const keyFeatures = [
  "Intuitive drag-and-drop interface for path creation",
  "Collaborative tools for team learning and projects",
  "Integrated resource library for quick access",
  "Performance analytics and insights",
  "Real-time progress tracking dashboards",
  "Customizable templates for various industries",
  "Automated reminders and deadline management",
  "Secure cloud storage and synchronization"
];

const testimonials = [
  {
    quote:
      "PathProgress transformed how my team approaches project management. Complex workflows now feel incredibly simple.",
    name: "Sarah Chen",
    title: "Project Manager, Innovate Solutions"
  },
  {
    quote:
      "As an educator, I struggled to keep students engaged. PathProgress dramatically improved comprehension and completion rates.",
    name: "Dr. Alex Johnson",
    title: "Professor of Data Science"
  },
  {
    quote:
      "Navigating career development was daunting. PathProgress broke everything into achievable steps. Highly recommended!",
    name: "Maria Rodriguez",
    title: "Software Developer, TechCorp"
  }
];

const pricingPlans = [
  {
    name: "Basic Plan",
    price: "$9",
    description: "Unlimited paths & sections with standard support.",
    perks: ["Unlimited Paths & Sections", "Up to 5 collaborators", "Basic progress tracking", "Standard support"],
    cta: "Start Basic"
  },
  {
    name: "Pro Plan",
    price: "$29",
    description: "Everything in Basic plus advanced analytics and priority service.",
    perks: ["All Basic features", "Unlimited collaborators", "Advanced analytics", "Priority support", "Custom branding"],
    cta: "Go Pro"
  }
];

export default function HomePage() {
  return (
    <div className="landing">
      <header className="top-nav">
        <div className="brand">PathProgress</div>
        <div className="nav-actions">
          <Link to="/login" className="ghost-link-button">
            Login
          </Link>
          <Link to="/register" className="primary-link-button">
            Sign Up
          </Link>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">PathProgress</p>
            <h1>Navigate your learning journey with clarity and purpose.</h1>
            <p>
              Build roadmaps, break them into sections, and stay consistent with intuitive progress tracking tailored
              for modern learners and teams.
            </p>
            <div className="hero-ctas">
              <Link to="/register" className="primary-button large link-reset">
                Get Started
              </Link>
              <Link to="/login" className="ghost-button large link-reset">
                Login
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card">Visual dashboards</div>
            <div className="floating-card secondary">Automated reminders</div>
            <div className="floating-card tertiary">Team insights</div>
          </div>
        </section>

        <section className="structure-section">
          <h2>Structure Your Progress</h2>
          <div className="structure-grid">
            {structureHighlights.map((item) => (
              <article key={item.title} className="structure-card">
                <div className="structure-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="features">
          <h2>Key Features Designed for You</h2>
          <div className="feature-lists">
            <ul>
              {keyFeatures.slice(0, 4).map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <ul>
              {keyFeatures.slice(4).map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="testimonials">
          <h2>What Our Users Say</h2>
          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <article key={item.name} className="testimonial-card">
                <p className="quote">“{item.quote}”</p>
                <div>
                  <p className="name">{item.name}</p>
                  <p className="title">{item.title}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="pricing">
          <h2>Choose Your Ideal Plan</h2>
          <div className="pricing-grid">
            {pricingPlans.map((plan) => (
              <article key={plan.name} className="pricing-card">
                <h3>{plan.name}</h3>
                <p className="price">
                  {plan.price}
                  <span>/month</span>
                </p>
                <p className="plan-desc">{plan.description}</p>
                <ul>
                  {plan.perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
                <Link to={plan.name === "Pro Plan" ? "/register" : "/register"} className="primary-button full-width link-reset">
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <span>© {new Date().getFullYear()} PathProgress. All rights reserved.</span>
        </div>
        <nav>
          <a>About Us</a>
          <a>Contact</a>
          <a>Privacy Policy</a>
          <a>Terms of Service</a>
        </nav>
      </footer>
    </div>
  );
}
