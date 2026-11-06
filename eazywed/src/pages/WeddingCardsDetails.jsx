"use client";

import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";
import EstimateSidebar from "./common/EstimateSidebar";
import { fetchCardDetails, checkCardAvailability } from "../services/api";
import { useEstimate } from "../context/EstimateContext";
import { useAuth } from "../context/AuthContext";
import "./details-page.css";

const formatMoney = (value) =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const WeddingCardsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToEstimate } = useEstimate();
  const { user } = useAuth();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(0);
  const [activePhoto, setActivePhoto] = useState(0);
  const [showImage, setShowImage] = useState(false);
  const [demoNotice, setDemoNotice] = useState("");
  const isDemo =
    import.meta.env.VITE_DEMO_MODE === "true" || id?.startsWith("demo-");
  const preventDemoAction = () => {
    if (!isDemo) return false;
    setDemoNotice(
      "This is a sample invitation. Contact, availability, estimates, and bookings become available when the live service is connected.",
    );
    return true;
  };
  const [activeTab, setActiveTab] = useState("Details");
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState("");
  const [reviewsPage, setReviewsPage] = useState(1);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [booking, setBooking] = useState(false);
  const reviewsPerPage = 5;
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    let current = true;
    setLoading(true);
    setError(null);
    setActivePhoto(0);
    const loadCard = async () => {
      try {
        const data = await fetchCardDetails(id);
        if (!current) return;
        setCard(data);
        document.title = `${data.name} - Card Details | Monasebty`;
      } catch {
        if (!current) return;
        setError("Failed to load card details.");
        toast.error("Failed to load card details.");
      } finally {
        if (current) setLoading(false);
      }
    };
    loadCard();
    return () => {
      current = false;
    };
  }, [id, retry]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    document
      .getElementById(`dp-section-${tab.toLowerCase()}`)
      ?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  };

  const validateDate = () => date && new Date(date) >= new Date(today);

  const handleBook = async () => {
    if (booking) return;
    if (preventDemoAction()) return;
    if (!user) {
      toast.error("Please sign in to book a card");
      navigate("/signin");
      return;
    }

    if (!validateDate()) {
      toast.error("Please select a valid delivery date.");
      return;
    }
    setBooking(true);
    try {
      const payload = { card_template_id: id, date_time: date, quantity };
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/dashboard/user/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast.error("Please sign in to book");
          navigate("/signin");
        } else {
          throw new Error("Booking failed");
        }
      } else {
        const data = await response.json();
        setShowBookingModal(false);
        toast.success(
          `Booking created! Booking ID: ${data.booking.booking_id}`,
        );
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error(err.message || "Booking failed.");
    } finally {
      setBooking(false);
    }
  };

  const handleAddToEstimate = async () => {
    if (preventDemoAction()) return;
    try {
      const item = {
        type: "card",
        id: card.id,
        quantity,
        name: card.name,
        subtotal: card.pricePerCard * quantity,
      };
      await addToEstimate(item);
    } catch (err) {
      console.error("Add to estimate failed:", err);
      toast.error("Failed to add to estimate.");
    }
  };

  const handleCustomize = async () => {
    if (card.type !== "editable") {
      toast.error("This card is not customizable");
      return;
    }

    try {
      navigate(`/public-editor/${id}`);
    } catch (err) {
      console.error("Navigation to editor failed:", err);
      toast.error("Failed to load editor.");
    }
  };

  const handleAvailabilityCheck = async () => {
    if (preventDemoAction()) return;
    if (!validateDate()) {
      toast.error("Please select a valid delivery date.");
      return;
    }
    try {
      const payload = { date, quantity };
      const { whatsappLink } = await checkCardAvailability(id, payload);
      window.open(whatsappLink, "_blank");
      toast.success("WhatsApp inquiry opened!");
    } catch (err) {
      console.error("Availability check failed:", err);
      toast.error("Failed to check availability.");
    }
  };

  const handleWhatsAppContact = () => {
    if (preventDemoAction()) return;
    if (!card?.vendorPhone) {
      toast.error("Vendor contact not available.");
      return;
    }
    const whatsappLink = `https://wa.me/${card.vendorPhone.replace("+", "")}`;
    window.open(whatsappLink, "_blank");
  };

  const loadMoreReviews = () => setReviewsPage((prev) => prev + 1);

  const calculateRatingBars = () => {
    if (!card?.reviews.length) return Array(5).fill(0);
    const counts = Array(5).fill(0);
    card.reviews.forEach((r) => counts[5 - r.stars]++);
    return counts.map((count) => (count / card.reviews.length) * 100);
  };

  const getDetailIcon = (key) => {
    const icons = {
      Type: "fa-tag",
      Format: "fa-file-alt",
      "Design Time": "fa-clock",
      Dimensions: "fa-ruler-combined",
    };
    return icons[key] || "fa-info";
  };

  if (loading || error || !card)
    return (
      <>
        <Navbar />
        <main className="dp-container dp-state" id="main-content">
          <p className="dp-state-eyebrow">Wedding invitations</p>
          <h1>
            {loading
              ? "Something lovely is on its way…"
              : "This invitation could not be loaded."}
          </h1>
          <p role={error ? "alert" : "status"}>
            {loading
              ? "Loading photos, pricing, and details."
              : error || "The invitation may no longer be available."}
          </p>
          {!loading && (
            <button
              className="dp-btn"
              onClick={() => setRetry((value) => value + 1)}
            >
              Try again
            </button>
          )}
          <Link to="/services?category=Wedding%20Cards">
            Back to wedding invitations
          </Link>
        </main>
        <Footer />
      </>
    );

  const displayedReviews = card.reviews.slice(0, reviewsPage * reviewsPerPage);
  const ratingBars = calculateRatingBars();
  const photos = [
    ...new Set([card.frontImage, ...(card.gallery || [])].filter(Boolean)),
  ];

  return (
    <>
      <Navbar />
      <EstimateSidebar />
      <main className="dp-container" id="main-content">
        {isDemo && (
          <div className="dp-demo-notice" role="note">
            <strong>Sample invitation</strong>
            <span>
              Explore the details and design. Live inquiries and bookings are
              unavailable in this preview.
            </span>
          </div>
        )}
        {demoNotice && (
          <div className="dp-action-notice" role="status">
            {demoNotice}
            <button
              type="button"
              onClick={() => setDemoNotice("")}
              aria-label="Dismiss preview notice"
            >
              ×
            </button>
          </div>
        )}
        <nav className="dp-breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/services?category=Wedding%20Cards">
            Wedding invitations
          </Link>
          <span aria-hidden="true">/</span>
          <span>{card.name}</span>
        </nav>

        <div className="dp-nav-section">
          <ul>
            {["Details", "Pricing", "Reviews"].map((tab) => (
              <li key={tab}>
                <a
                  href={`#dp-section-${tab.toLowerCase()}`}
                  className={activeTab === tab ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabClick(tab);
                  }}
                >
                  {tab}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="dp-section dp-section-1" id="dp-section-details">
          <div className="dp-subsection-1">
            <div className="dp-profile">
              <div className="dp-profile-img">
                <img
                  src={
                    card.vendorBrandIcon ||
                    card.frontImage ||
                    "assets/images/default-profile.jpeg"
                  }
                  alt="Profile"
                />
              </div>
              <div className="dp-profile-info">
                <h1>{card.name}</h1>
                <div className="dp-rating">
                  <i className="fas fa-star"></i> {card.avgRating} (
                  {card.reviewCount})
                </div>
                <div className="dp-address">
                  <i className="fas fa-map-marker-alt"></i> {card.city}
                </div>
              </div>
            </div>
            {["type", "format", "designTime", "dimensions"].some(
              (key) => card[key],
            ) && (
              <div className="dp-details">
                <h3>Details</h3>
                <dl className="dp-details-grid">
                  {Object.entries({
                    Type: card.type,
                    Format: card.format?.join(", "),
                    "Design Time": card.designTime,
                    Dimensions: card.dimensions,
                  }).map(
                    ([key, value]) =>
                      value &&
                      (Array.isArray(value) ? value.length > 0 : true) && (
                        <React.Fragment key={key}>
                          <dt>
                            <i className={`fas ${getDetailIcon(key)}`}></i>{" "}
                            {key}:
                          </dt>
                          <dd>{value}</dd>
                        </React.Fragment>
                      ),
                  )}
                </dl>
              </div>
            )}
            {card.description && (
              <div className="dp-details">
                <h3>Description</h3>
                <div className="dp-description">{card.description}</div>
              </div>
            )}
          </div>
          <div className="dp-subsection-2">
            <div className="dp-carousel">
              <button
                className="dp-photo-open"
                type="button"
                onClick={() => setShowImage(true)}
                aria-label={`Enlarge photo of ${card.name}`}
              >
                <img
                  src={photos[activePhoto]}
                  alt={`${card.name}, photo ${activePhoto + 1}`}
                />
                <span className="dp-photo-enlarge">View photos ↗</span>
              </button>
              {photos.length > 1 && (
                <div className="dp-photo-controls">
                  <button
                    type="button"
                    onClick={() =>
                      setActivePhoto(
                        (index) => (index - 1 + photos.length) % photos.length,
                      )
                    }
                    aria-label="Previous photo"
                  >
                    ←
                  </button>
                  <span>
                    {activePhoto + 1} / {photos.length}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setActivePhoto((index) => (index + 1) % photos.length)
                    }
                    aria-label="Next photo"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
            <div className="dp-price-buttons">
              <div className="dp-action-buttons">
                <button className="dp-btn" onClick={handleWhatsAppContact}>
                  <i className="fab fa-whatsapp"></i> Contact via WhatsApp
                </button>
              </div>
              <div className="dp-price-range">
                {formatMoney(card.pricePerCard)}
              </div>
            </div>
          </div>
        </div>

        <div className="dp-section" id="dp-section-pricing">
          <h3 className="dp-section-title">Pricing & Availability</h3>
          <div className="dp-package-details">
            <div className="dp-inclusions-section">
              <h4>Pricing</h4>
              <div className="dp-package-price">
                {formatMoney(card.pricePerCard)} per card
              </div>
              <div>Quantity Available: {card.quantityAvailable}</div>
              <div className="dp-quantity-selector">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((prev) =>
                      Math.min(card.quantityAvailable, prev + 1),
                    )
                  }
                  disabled={quantity >= card.quantityAvailable}
                >
                  +
                </button>
              </div>
              <button className="dp-btn" onClick={handleAddToEstimate}>
                Add to Estimate
              </button>
              <button
                className="dp-btn"
                style={{ marginLeft: "10px" }}
                onClick={() => {
                  if (!preventDemoAction()) setShowBookingModal(true);
                }}
                disabled={card.quantityAvailable === 0} // Disable if no quantity available
              >
                Book Now
              </button>
              {card.quantityAvailable === 0 && (
                <span style={{ color: "red", marginLeft: "10px" }}>
                  Out of stock
                </span>
              )}
              {card.type === "editable" && (
                <button
                  className="dp-btn"
                  style={{ marginLeft: "10px" }}
                  onClick={handleCustomize}
                >
                  Customize
                </button>
              )}
            </div>
            <div className="dp-availability-section">
              <input
                type="date"
                aria-label="Delivery date"
                className="dp-calendar"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
              />
              <button
                className="dp-btn"
                onClick={handleAvailabilityCheck}
                disabled={!date}
              >
                Check Availability
              </button>
            </div>
          </div>
        </div>

        <div className="dp-section" id="dp-section-reviews">
          <h3 className="dp-section-title">Reviews</h3>
          <div className="dp-review-counter">
            <div className="dp-total-rating">
              {card.avgRating} Average{" "}
              <span>
                <i className="fas fa-star"></i> ({card.reviewCount} Reviews)
              </span>
            </div>
            <div className="dp-rating-bars">
              {[5, 4, 3, 2, 1].map((stars, idx) => (
                <div key={idx} className="dp-rating-bar">
                  <span>
                    <i className="fas fa-star"></i> {stars}
                  </span>
                  <div className="dp-bar">
                    <div
                      className="dp-bar-fill"
                      style={{
                        width: `${ratingBars[5 - stars]}%`,
                        backgroundColor: card.reviews.length
                          ? "#d7385e"
                          : "#ccc",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="dp-reviews-list">
            {displayedReviews.map((review, idx) => (
              <div key={idx} className="dp-review-item">
                <div className="dp-stars">{"★".repeat(review.stars)}</div>
                <p>
                  "{review.comment || "No comment"}" - {review.user} (
                  {new Date(review.createdAt).toLocaleDateString("fr-MA")})
                </p>
              </div>
            ))}
          </div>
          {displayedReviews.length < card.reviews.length && (
            <button className="dp-btn" onClick={loadMoreReviews}>
              Load More
            </button>
          )}
        </div>
      </main>

      <Modal
        show={showBookingModal}
        onHide={() => {
          if (!booking) setShowBookingModal(false);
        }}
        centered
        aria-labelledby="card-booking-title"
        className="dp-booking-modal"
      >
        <Modal.Header closeButton={!booking}>
          <Modal.Title id="card-booking-title">
            Book your invitations
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="card-booking-date">Delivery date</label>
          <input
            id="card-booking-date"
            type="date"
            className="dp-calendar"
            value={date}
            min={today}
            onChange={(event) => setDate(event.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="dp-btn dp-btn-secondary"
            onClick={() => setShowBookingModal(false)}
            disabled={booking}
          >
            Cancel
          </button>
          <button
            type="button"
            className="dp-btn"
            onClick={handleBook}
            disabled={booking || !validateDate()}
            aria-busy={booking}
          >
            {booking ? "Creating booking…" : "Confirm booking"}
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showImage}
        onHide={() => setShowImage(false)}
        centered
        size="lg"
        aria-labelledby="card-photo-title"
        className="dp-photo-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="card-photo-title">{card.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={photos[activePhoto]}
            alt={`${card.name}, photo ${activePhoto + 1}`}
          />
        </Modal.Body>
      </Modal>
      <Footer />
    </>
  );
};

export default WeddingCardsDetails;
