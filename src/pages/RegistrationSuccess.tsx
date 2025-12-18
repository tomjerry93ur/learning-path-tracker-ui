import { Link, useLocation } from "react-router-dom";
import "../App.css";

export default function RegistrationSuccessPage() {
  const location = useLocation<{ username?: string }>();
  const username = location.state?.username ?? null;

  return (
    <div className="success-page">
      <div className="success-card">
        <CelebrationArt />
        <h1>Registration Successful!</h1>
        <p>
          {username ? (
            <>
              Welcome, <strong>{username}</strong>! Your account is now active. Please proceed to login to
              personalize your profile and start exploring.
            </>
          ) : (
            "Thank you for joining our community! Your account is now active. Please proceed to login to personalize your profile and start exploring."
          )}
        </p>

        <section className="success-info">
          <span className="status-pill">⏳</span>
          <p>Your account setup is almost complete! Some features may take a moment to activate.</p>
        </section>

        <div className="success-actions">
          <Link to="/login" className="primary-button large link-reset">
            Go to Login
          </Link>
          <Link to="/" className="inline-link">
            Explore Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

function CelebrationArt() {
  return (
    <svg
      className="celebration-art"
      viewBox="0 0 260 180"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Celebration"
    >
      <rect width="260" height="180" rx="24" fill="#FFF6EC" />
      <path
        d="M65 120C55 95 65 60 90 45C115 30 145 35 165 52C185 69 190 95 175 110C160 125 135 130 110 130C85 130 70 145 65 120Z"
        fill="#FDB5A2"
      />
      <circle cx="188" cy="125" r="32" fill="#F78B38" />
      <circle cx="85" cy="125" r="22" fill="#FCD4BF" />
      <path
        d="M120 65C132 60 150 62 164 75"
        stroke="#fff"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <text x="75" y="95" fill="#fff" fontSize="32" fontFamily="Poppins, sans-serif">
        Happ.y
      </text>
      <g fill="#F78B38">
        <circle cx="40" cy="45" r="4" />
        <circle cx="210" cy="45" r="4" />
        <circle cx="230" cy="75" r="3" />
        <circle cx="30" cy="80" r="3" />
      </g>
    </svg>
  );
}
