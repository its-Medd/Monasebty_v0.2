import { usePageTitle } from "../i18n/usePageTitle";
import { useLocale } from "../i18n/useLocale";
import { BETA_MODE } from "../data/laayoune";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import "./AuthExperience.css";
const phonePattern = /^\+212[67][0-9]{8}$/;
const normalizePhone = (value) => {
  const compact = value.replace(/[\s()-]/g, "");
  return /^0[67][0-9]{8}$/.test(compact) ? `+212${compact.slice(1)}` : compact;
};
const isDemo = BETA_MODE || import.meta.env.VITE_DEMO_MODE === "true";

// Both customer journeys use one phone-verification experience.
export function AuthExperience({ createAccount = false }) {
  usePageTitle("Your account");
  const { t } = useLocale();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+212");
  const [otp, setOtp] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const requestPending = useRef(false);
  const phoneRef = useRef(null);
  const nameRef = useRef(null);
  const otpRef = useRef(null);
  const { signIn, signUp, verifySignInOtp, verifySignUpOtp, loading } =
    useAuth();
  const busy = pending || loading;
  async function requestCode(event) {
    event.preventDefault();
    if (requestPending.current || isDemo) return;
    const normalizedPhone = normalizePhone(phone);
    const nextErrors = {};
    if (createAccount && !fullName.trim())
      nextErrors.name = "Enter your full name.";
    if (!phonePattern.test(normalizedPhone))
      nextErrors.phone =
        "Use a Moroccan mobile number: 0612345678 or +212612345678.";
    setErrors(nextErrors);
    setMessage("");
    if (Object.keys(nextErrors).length) {
      (nextErrors.name ? nameRef : phoneRef).current?.focus();
      return;
    }
    requestPending.current = true;
    setPending(true);
    try {
      const success = createAccount
        ? await signUp(fullName.trim(), normalizedPhone)
        : await signIn(normalizedPhone);
      if (success) {
        setPhone(normalizedPhone);
        setOtp("");
        setShowCode(false);
        setShowOtp(true);
      } else
        setMessage(
          "We couldn’t send a code. Check your number and connection, then try again.",
        );
    } catch {
      setMessage(
        "We couldn’t connect. Check your internet connection and try again.",
      );
    } finally {
      requestPending.current = false;
      setPending(false);
    }
  }
  async function verifyCode(event) {
    event.preventDefault();
    if (requestPending.current) return;
    if (!/^\d{6}$/.test(otp)) {
      setErrors({
        otp: "Enter the six-digit code.",
      });
      otpRef.current?.focus();
      return;
    }
    requestPending.current = true;
    setPending(true);
    setErrors({});
    try {
      const success = createAccount
        ? await verifySignUpOtp(fullName.trim(), phone, otp)
        : await verifySignInOtp(phone, otp);
      if (success) setShowOtp(false);
      else
        setErrors({
          otp: "That code couldn’t be verified. Check the code or request a new one.",
        });
    } catch {
      setErrors({
        otp: "We couldn’t connect. Your code is still here; please try again.",
      });
    } finally {
      requestPending.current = false;
      setPending(false);
    }
  }
  function closeVerification() {
    if (busy) return;
    setShowOtp(false);
    setErrors({});
    setOtp("");
  }
  return (
    <main className="ew-auth-page" id="main-content">
      <section
        className="ew-auth-story"
        aria-label={t("Your wedding starts here")}
      >
        <Link className="ew-auth-brand" to="/" aria-label={t("Monasebty home")}>
          monasebty<span>✦</span>
        </Link>
        <div className="ew-auth-story-copy">
          <span className="ew-auth-eyebrow">
            {t("A little less planning. A lot more joy.") + " "}
          </span>
          <h1>
            {t("Your day.") + " "}
            <br />
            {t("Your people.") + " "}
            <br />
            <em>{t("Your kind of magic.")}</em>
          </h1>
          <p>
            {t(
              "Find the people and details that make your celebration feel like you.",
            ) + " "}
          </p>
        </div>
        <div className="ew-auth-story-bottom">
          <span>{t("Made for celebrations in Morocco")}</span>
          <span aria-hidden="true">✦</span>
        </div>
      </section>
      <section className="ew-auth-form-panel" aria-labelledby="auth-heading">
        <Link className="ew-auth-back" to="/">
          <FiArrowLeft aria-hidden="true" />
          {t("Back to exploring") + " "}
        </Link>
        <div className="ew-auth-form-wrap">
          <span className="ew-auth-kicker">
            {createAccount ? t("Let’s begin") : t("A familiar place")}
          </span>
          <h2 id="auth-heading">
            {createAccount
              ? t("Make room for your big day.")
              : t("Welcome back.")}
          </h2>
          <p className="ew-auth-intro">
            {createAccount
              ? t(
                  "Create your account with a mobile number. We’ll send a code to verify it.",
                )
              : t(
                  "Sign in with your mobile number. A verification code keeps it simple.",
                )}
          </p>
          {isDemo && (
            <div className="ew-auth-notice" role="note" id="auth-demo-note">
              <strong>{t("You’re exploring a preview.")}</strong>
              <p>
                {t(
                  "This Laayoune beta works without an account. You can still browse all the local directory.",
                ) + " "}
              </p>
              <Link to="/services">
                {t("Explore services") + " "}
                <FiArrowRight aria-hidden="true" />
              </Link>
            </div>
          )}
          <form
            className="ew-auth-form"
            noValidate
            onSubmit={requestCode}
            aria-busy={busy}
          >
            {message && (
              <p className="ew-auth-error ew-auth-form-error" role="alert">
                {message}
              </p>
            )}
            {createAccount && (
              <div className="ew-auth-field">
                <label htmlFor="auth-name">{t("Full name")}</label>
                <input
                  ref={nameRef}
                  id="auth-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder={t("Your full name")}
                  value={fullName}
                  onChange={(event) => {
                    setFullName(event.target.value);
                    setErrors((current) => ({
                      ...current,
                      name: undefined,
                    }));
                  }}
                  disabled={busy}
                  required
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "auth-name-error" : undefined}
                />
                {errors.name && (
                  <p className="ew-auth-error" id="auth-name-error">
                    {errors.name}
                  </p>
                )}
              </div>
            )}
            <div className="ew-auth-field">
              <label htmlFor="auth-phone">{t("Mobile number")}</label>
              <input
                ref={phoneRef}
                id="auth-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0612345678"
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                  setErrors((current) => ({
                    ...current,
                    phone: undefined,
                  }));
                }}
                disabled={busy}
                required
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={
                  errors.phone ? "auth-phone-error" : "auth-phone-help"
                }
              />
              {errors.phone ? (
                <p className="ew-auth-error" id="auth-phone-error">
                  {errors.phone}
                </p>
              ) : (
                <p className="ew-auth-help" id="auth-phone-help">
                  {t("Moroccan mobile number starting with 06, 07, or +212.") +
                    " "}
                </p>
              )}
            </div>
            <button
              className="ew-auth-submit"
              type="submit"
              disabled={busy || isDemo}
              aria-describedby={isDemo ? "auth-demo-note" : undefined}
            >
              <span>
                {busy ? t("Sending code…") : t("Send verification code")}
              </span>
              <FiArrowRight aria-hidden="true" />
            </button>
            <p className="ew-auth-reassurance">
              <FiCheck aria-hidden="true" />
              {t("No password to remember.") + " "}
            </p>
          </form>
          <p className="ew-auth-switch">
            {createAccount
              ? t("Already have an account?")
              : t("New to Monasebty?")}{" "}
            <Link to={createAccount ? "/signin" : "/signup"}>
              {createAccount ? t("Sign in") : t("Create an account")}
            </Link>
          </p>
          <div className="ew-auth-vendor">
            <span>{t("Here for your business?")}</span>
            <Link to="/vendor/login">
              {t("Vendor sign in") + " "}
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
        <span className="ew-auth-bottom-note">
          {t("A thoughtful beginning to a beautiful celebration.") + " "}
        </span>
      </section>
      <Modal
        show={showOtp}
        onHide={closeVerification}
        centered
        className="ew-auth-modal"
        aria-labelledby="auth-verify-title"
        onEntered={() => otpRef.current?.focus()}
        backdrop={busy ? "static" : true}
        keyboard={!busy}
      >
        <Modal.Header closeButton={!busy}>
          <Modal.Title id="auth-verify-title">
            {t("Check your messages")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {t("Enter the six-digit code sent to") + " "}
            <strong>{phone}</strong>
            {t(". Your code is valid for 10 minutes.") + " "}
          </p>
          <form
            className="ew-auth-form"
            noValidate
            onSubmit={verifyCode}
            aria-busy={busy}
          >
            <div className="ew-auth-field">
              <label htmlFor="auth-code">{t("Verification code")}</label>
              <div className="ew-auth-code-control">
                <input
                  ref={otpRef}
                  id="auth-code"
                  name="otp"
                  type={showCode ? "text" : "password"}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(event) => {
                    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
                    setErrors({});
                  }}
                  disabled={busy}
                  required
                  aria-invalid={Boolean(errors.otp)}
                  aria-describedby={errors.otp ? "auth-code-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  aria-label={
                    showCode
                      ? "Hide verification code"
                      : "Show verification code"
                  }
                  aria-pressed={showCode}
                >
                  {showCode ? (
                    <FiEyeOff aria-hidden="true" />
                  ) : (
                    <FiEye aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.otp && (
                <p className="ew-auth-error" id="auth-code-error" role="alert">
                  {errors.otp}
                </p>
              )}
            </div>
            <button type="submit" className="ew-auth-submit" disabled={busy}>
              {busy
                ? t("Verifying…")
                : createAccount
                  ? t("Verify and create account")
                  : t("Verify and sign in")}
              <FiArrowRight aria-hidden="true" />
            </button>
            <button
              type="button"
              className="ew-auth-change-number"
              onClick={closeVerification}
              disabled={busy}
            >
              {t("Change number or request a new code") + " "}
            </button>
          </form>
        </Modal.Body>
      </Modal>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </main>
  );
}
export default function SignIn() {
  return <AuthExperience />;
}
