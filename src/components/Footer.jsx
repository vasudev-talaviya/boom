export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer" id="footer">
      <div className="footer-border-top"></div>

      <div className="footer-content">
        <h2 className="footer-brand blood-text-glow">यह कुछ नहीं मिलता</h2>
        <p className="footer-tagline">
          ⚠️ Enter at your own risk — अपनी ज़िम्मेदारी पर आएं ⚠️
        </p>

        <div className="footer-socials">
          <a
            className="social-tomb"
            href="#"
            aria-label="Instagram"
            id="social-instagram"
            title="Instagram"
          >
            📸
          </a>
          <a
            className="social-tomb"
            href="#"
            aria-label="YouTube"
            id="social-youtube"
            title="YouTube"
          >
            🎬
          </a>
          <a
            className="social-tomb"
            href="#"
            aria-label="Twitter"
            id="social-twitter"
            title="Twitter"
          >
            🐦‍⬛
          </a>
          <a
            className="social-tomb"
            href="#"
            aria-label="WhatsApp"
            id="social-whatsapp"
            title="WhatsApp"
          >
            💬
          </a>
          <a
            className="social-tomb"
            href="#"
            aria-label="Facebook"
            id="social-facebook"
            title="Facebook"
          >
            📘
          </a>
        </div>

        <p className="footer-bottom">
          ☠️ © {currentYear} यह कुछ नहीं मिलता — No soul leaves unscathed ☠️
        </p>
      </div>
    </footer>
  )
}
