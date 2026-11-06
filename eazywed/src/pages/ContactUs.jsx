import { BETA_MODE } from "../data/laayoune";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";
import EstimateSidebar from "./common/EstimateSidebar";
import "./Contact.css";

const isDemo = BETA_MODE || import.meta.env.VITE_DEMO_MODE === "true";

export default function ContactUs() {
  const [values, setValues] = useState({ name: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    document.title = "Contact us | Monasebty";
  }, []);

  const update = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setFeedback(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    const phone = values.phone
      .replace(/[\s()-]/g, "")
      .replace(/^00/, "+")
      .replace(/^0/, "+212");
    const nextErrors = {};
    if (!/^[\p{L}\p{M}\s'-]{2,}$/u.test(values.name.trim()))
      nextErrors.name =
        "Use at least two letters. Spaces and hyphens are welcome.";
    if (!/^\+212[67]\d{8}$/.test(phone))
      nextErrors.phone =
        "Enter a Moroccan mobile number, such as 0612345678 or +212612345678.";
    if (values.message.trim().length < 10)
      nextErrors.message = "Add a little more detail — at least 10 characters.";
    if (values.message.trim().length > 500)
      nextErrors.message = "Keep your message within 500 characters.";
    setErrors(nextErrors);
    setFeedback(null);
    if (Object.keys(nextErrors).length) {
      formRef.current
        ?.querySelector(`[name="${Object.keys(nextErrors)[0]}"]`)
        ?.focus();
      return;
    }
    if (isDemo) {
      setFeedback({
        type: "success",
        message:
          "Preview complete. Your message stayed in this browser and was not sent or saved to a server.",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/public/contact`,
        {
          name: values.name.trim(),
          phone,
          message: values.message.trim(),
        },
        { withCredentials: true, timeout: 15000 },
      );
      if (response.status >= 200 && response.status < 300) {
        setFeedback({
          type: "success",
          message: isDemo
            ? "Preview complete. This demo message was not saved or sent. Your draft is still here."
            : "Your message has been received. You can keep exploring while our team reviews it.",
        });
        if (!isDemo) setValues({ name: "", phone: "", message: "" });
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "Your message could not be sent. Your draft is safe here — check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <EstimateSidebar />
      <main className="ew-contact" id="main-content">
        <nav className="ew-contact-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Contact us</span>
        </nav>
        <div className="ew-contact-layout">
          <section className="ew-contact-intro" aria-labelledby="contact-title">
            <p className="ew-contact-eyebrow">A little help along the way</p>
            <h1 id="contact-title">
              Every lovely day
              <br />
              starts with
              <br />
              <em>a conversation.</em>
            </h1>
            <p>
              Have a question about planning, finding a vendor, or using
              Monasebty? Tell us what you need a hand with.
            </p>
            <div className="ew-contact-guide">
              <span className="ew-contact-guide-icon" aria-hidden="true">
                ✧
              </span>
              <div>
                <h2>Looking for a vendor?</h2>
                <p>
                  Explore services, compare packages, and contact vendors from
                  their listing.
                </p>
                <Link to="/services">
                  Explore wedding services <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          </section>
          <section className="ew-contact-panel" aria-labelledby="message-title">
            <h2 id="message-title">How can we help?</h2>
            <p className="ew-contact-panel-note">All fields are required.</p>
            {isDemo && (
              <p className="ew-contact-preview">
                You’re exploring a local preview. Messages won’t be saved or
                sent.
              </p>
            )}
            <form ref={formRef} onSubmit={handleSubmit} noValidate>
              <div className="ew-contact-field">
                <label htmlFor="contact-name">Your name</label>
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  value={values.name}
                  onChange={update}
                  aria-invalid={!!errors.name}
                  aria-describedby={
                    errors.name ? "contact-name-error" : undefined
                  }
                  placeholder="Your full name"
                  required
                />
                {errors.name && (
                  <p className="ew-contact-field-error" id="contact-name-error">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="ew-contact-field">
                <label htmlFor="contact-phone">Phone number</label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={update}
                  aria-invalid={!!errors.phone}
                  aria-describedby={
                    errors.phone ? "contact-phone-error" : "contact-phone-help"
                  }
                  placeholder="06 12 34 56 78"
                  required
                />
                {errors.phone ? (
                  <p
                    className="ew-contact-field-error"
                    id="contact-phone-error"
                  >
                    {errors.phone}
                  </p>
                ) : (
                  <p className="ew-contact-field-help" id="contact-phone-help">
                    Use your Moroccan mobile number (+212).
                  </p>
                )}
              </div>
              <div className="ew-contact-field">
                <label htmlFor="contact-message">Your message</label>
                <textarea
                  className="resize-none"
                  id="contact-message"
                  name="message"
                  value={values.message}
                  onChange={update}
                  aria-invalid={!!errors.message}
                  aria-describedby={
                    errors.message
                      ? "contact-message-error"
                      : "contact-message-count"
                  }
                  placeholder="Tell us a little about your question…"
                  rows={5}
                  maxLength={500}
                  required
                />
                {errors.message && (
                  <p
                    className="ew-contact-field-error"
                    id="contact-message-error"
                  >
                    {errors.message}
                  </p>
                )}
                <p
                  id="contact-message-count"
                  className="ew-contact-character-count"
                >
                  {values.message.length} / 500
                </p>
              </div>
              {feedback && (
                <div
                  className={`ew-contact-feedback ew-contact-feedback-${feedback.type}`}
                  role={feedback.type === "error" ? "alert" : "status"}
                >
                  {feedback.message}
                </div>
              )}
              <button
                className="ew-contact-submit"
                type="submit"
                disabled={loading}
                aria-busy={loading}
              >
                {loading
                  ? "Sending message…"
                  : isDemo
                    ? "Preview message"
                    : "Send message"}
                <span aria-hidden="true">↗</span>
              </button>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
