import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";
import EstimateSidebar from "./common/EstimateSidebar";
import { fetchServiceDetails, checkServiceAvailability } from "../services/api";
import { useEstimate } from "../context/EstimateContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./details-page.css";
import createAPI from "../utils/api";

const formatMoney = (value) =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
const formatPriceRange = (value) =>
  value
    ? String(value)
        .split(/\s*[-–]\s*/)
        .map((amount) => formatMoney(amount.replace(/[^\d.]/g, "")))
        .join(" – ")
    : "Request pricing";

const categoryFields = {
  Photographers: [
    "expertise",
    "staff",
    "cities_covered",
    "cancellation_policy",
  ],
  "Wedding Venues": [
    "venue_type",
    "amenities",
    "parking_space",
    "catering_type",
    "wheelchair_accessible",
    "staff",
    "cancellation_policy",
  ],
  "Bridal Makeup": [
    "services_for",
    "location_type",
    "staff",
    "home_service",
    "expertise",
    "cities_covered",
    "cancellation_policy",
  ],
  "Henna Artists": [
    "services_for",
    "mehndi_type",
    "expertise",
    "has_team",
    "sells_mehndi",
    "cities_covered",
    "cancellation_policy",
  ],
  "Bridal Wear": [
    "material",
    "size",
    "length",
    "bust",
    "design",
    "rental_duration",
    "cancellation_policy",
  ],
  "Car Rental": ["seats", "doors", "transmission", "cancellation_policy"],
};

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToEstimate } = useEstimate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
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
      "This is a sample listing. Contact, availability, estimates, and bookings become available when the live service is connected.",
    );
    return true;
  };
  const [activeTab, setActiveTab] = useState("Details");
  const [activePackage, setActivePackage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Separate state for modal to avoid interference
  const [modalDate, setModalDate] = useState("");
  const [modalStartDate, setModalStartDate] = useState("");
  const [modalEndDate, setModalEndDate] = useState("");
  const [reviewsPage, setReviewsPage] = useState(1);
  const [showDateModal, setShowDateModal] = useState(false);
  const [booking, setBooking] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const reviewsPerPage = 5;
  const today = new Date().toISOString().split("T")[0];
  const api = createAPI(navigate);

  useEffect(() => {
    let current = true;
    setLoading(true);
    setError(null);
    setActivePhoto(0);
    const loadService = async () => {
      try {
        const data = await fetchServiceDetails(id);
        if (!current) return;
        setService(data);
        document.title = `${data.name} - Service Details | Monasebty`;
      } catch (err) {
        if (!current) return;
        if (err.response?.status === 403) {
          setError("This service is not currently available.");
          toast.error("This service is not currently available.");
        } else {
          setError("Failed to load service details.");
          toast.error("Failed to load service details.");
        }
      } finally {
        if (current) setLoading(false);
      }
    };
    loadService();
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

  const handlePackageClick = (index) => setActivePackage(index);

  const validateDates = (isModal = false) => {
    const datesToCheck = isModal
      ? { date: modalDate, startDate: modalStartDate, endDate: modalEndDate }
      : { date, startDate, endDate };
    if (service?.isRental) {
      if (!datesToCheck.startDate || !datesToCheck.endDate) return false;
      const start = new Date(datesToCheck.startDate);
      const end = new Date(datesToCheck.endDate);
      return start >= new Date(today) && end > start;
    }
    return datesToCheck.date && new Date(datesToCheck.date) >= new Date(today);
  };

  const handleAvailabilityCheck = async (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (preventDemoAction()) return;
    if (!validateDates(false)) {
      toast.error("Please select valid date(s) for availability check.");
      return;
    }
    try {
      const payload = service.isRental
        ? {
            startDate,
            endDate,
            packageId: service.pricingPackages[activePackage]._id,
            quantity: service.category === "Wedding Venues" ? quantity : 1,
          }
        : {
            date,
            packageId: service.pricingPackages[activePackage]._id,
            quantity: service.category === "Wedding Venues" ? quantity : 1,
          };
      const { whatsappLink } = await checkServiceAvailability(id, payload);
      window.open(whatsappLink, "_blank");
      toast.success("WhatsApp inquiry opened for availability!");
    } catch (err) {
      console.error("Availability check failed:", err);
      toast.error("Failed to check availability.");
    }
  };

  const handleBookClick = (packageId) => (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (preventDemoAction()) return;
    if (!user) {
      toast.error("Please sign in to book a service.");
      navigate("/signin");
      return;
    }
    setSelectedPackageId(packageId);
    // Reset modal dates to avoid carrying over availability dates
    setModalDate("");
    setModalStartDate("");
    setModalEndDate("");
    setShowDateModal(true);
  };

  const handleBook = async (e) => {
    e.stopPropagation(); // Prevent event bubbling from modal button
    if (booking) return;
    if (preventDemoAction()) return;
    if (!validateDates(true)) {
      toast.error("Please select valid date(s) for booking.");
      return;
    }
    setBooking(true);
    try {
      const payload = service.isRental
        ? {
            service_id: id,
            package_id: selectedPackageId,
            date_time: modalStartDate,
            end_date: modalEndDate,
            quantity: service.category === "Wedding Venues" ? quantity : 1,
          }
        : {
            service_id: id,
            package_id: selectedPackageId,
            date_time: modalDate,
            quantity: service.category === "Wedding Venues" ? quantity : 1,
          };

      const response = await api.post("/dashboard/user/bookings", payload);
      const data = response.data;

      toast.success(`Booking created! Booking ID: ${data.booking.booking_id}`);
      if (data.whatsappLink) {
        window.open(data.whatsappLink, "_blank");
      }
      setShowDateModal(false);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      console.error("Booking failed:", err);
      if (err.response) {
        toast.error(err.response.data.message || "Booking failed.");
        if (err.response.status === 401 || err.response.status === 403) {
          navigate("/signin");
        }
      } else {
        toast.error("Booking failed.");
      }
    } finally {
      setBooking(false);
    }
  };

  const handleAddToEstimate = async () => {
    if (preventDemoAction()) return;
    try {
      const pkg = service.pricingPackages[activePackage];
      const item = {
        type: "service",
        id: service.id,
        packageId: pkg._id,
        quantity: service.category === "Wedding Venues" ? quantity : 1,
        name: `${service.name} - ${pkg.name}`,
        subtotal:
          pkg.price * (service.category === "Wedding Venues" ? quantity : 1),
      };
      await addToEstimate(item);
    } catch (err) {
      console.error("Add to estimate failed:", err);
      toast.error("Failed to add to estimate.");
    }
  };

  const handleWhatsAppContact = () => {
    if (preventDemoAction()) return;
    if (!service?.vendorPhone) {
      toast.error("Vendor contact not available.");
      return;
    }
    const whatsappLink = `https://wa.me/${service.vendorPhone.replace("+", "")}`;
    window.open(whatsappLink, "_blank");
  };

  const loadMoreReviews = () => setReviewsPage((prev) => prev + 1);

  const calculateRatingBars = () => {
    if (!service?.reviews.length) return Array(5).fill(0);
    const counts = Array(5).fill(0);
    service.reviews.forEach((r) => counts[5 - r.stars]++);
    return counts.map((count) => (count / service.reviews.length) * 100);
  };

  const getDetailIcon = (key) => {
    const icons = {
      expertise: "fa-lightbulb",
      staff: "fa-users",
      cities_covered: "fa-map-marked-alt",
      cancellation_policy: "fa-file-contract",
      venue_type: "fa-building",
      amenities: "fa-concierge-bell",
      parking_space: "fa-parking",
      catering_type: "fa-utensils",
      wheelchair_accessible: "fa-wheelchair",
      services_for: "fa-user-friends",
      location_type: "fa-store",
      home_service: "fa-home",
      mehndi_type: "fa-paint-brush",
      has_team: "fa-users-cog",
      sells_mehndi: "fa-shopping-bag",
      material: "fa-tshirt",
      size: "fa-ruler",
      length: "fa-ruler-vertical",
      bust: "fa-ruler-horizontal",
      design: "fa-palette",
      rental_duration: "fa-clock",
      seats: "fa-chair",
      doors: "fa-door-open",
      transmission: "fa-cogs",
    };
    return icons[key] || "fa-info";
  };

  const getCoordinates = () => {
    if (service?.location_map) {
      const latLngMatch =
        service.location_map.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/) ||
        service.location_map.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
      if (latLngMatch) {
        const lat = parseFloat(latLngMatch[1]);
        const lng = parseFloat(latLngMatch[2]);
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          return [lat, lng];
        }
      }
    }
    return null;
  };

  const getMapSource = () => {
    return !!getCoordinates();
  };

  if (loading || error || !service)
    return (
      <>
        <Navbar />
        <main className="dp-container dp-state" id="main-content">
          <p className="dp-state-eyebrow">Wedding services</p>
          <h1>
            {loading
              ? "A closer look at your day…"
              : "This listing could not be loaded."}
          </h1>
          <p role={error ? "alert" : "status"}>
            {loading
              ? "Loading photos, packages, and details."
              : error || "The listing may no longer be available."}
          </p>
          {!loading && (
            <button
              className="dp-btn"
              onClick={() => setRetry((value) => value + 1)}
            >
              Try again
            </button>
          )}
          <Link to="/services">Back to wedding services</Link>
        </main>
        <Footer />
      </>
    );

  const displayedReviews = service.reviews.slice(
    0,
    reviewsPage * reviewsPerPage,
  );
  const ratingBars = calculateRatingBars();
  const relevantDetails = categoryFields[service.category] || [];

  return (
    <>
      <Navbar />
      <EstimateSidebar />
      <main className="dp-container" id="main-content">
        {isDemo && (
          <div className="dp-demo-notice" role="note">
            <strong>Sample listing</strong>
            <span>
              Explore the details and packages. Live inquiries and bookings are
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
          <Link
            to={`/services?category=${encodeURIComponent(service.category)}`}
          >
            {service.category}
          </Link>
          <span aria-hidden="true">/</span>
          <span>{service.name}</span>
        </nav>

        <div className="dp-nav-section">
          <ul>
            {[
              "Details",
              "Pricing",
              ...(service.location_map || service.vendorDetails?.office_address
                ? ["Location"]
                : []),
              "Reviews",
            ].map((tab) => (
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
                    service.brandIcon ||
                    service.photos[0] ||
                    "assets/images/default-profile.jpeg"
                  }
                  alt="Profile"
                />
              </div>
              <div className="dp-profile-info">
                <h1>{service.name}</h1>
                <div className="dp-rating">
                  <i className="fas fa-star"></i> {service.avgRating} (
                  {service.reviewCount})
                </div>
                <div className="dp-address">
                  <i className="fas fa-map-marker-alt"></i> {service.city}
                </div>
              </div>
            </div>
            {Object.keys(service.details).filter(
              (key) => relevantDetails.includes(key) && service.details[key],
            ).length > 0 && (
              <div className="dp-details">
                <h3>Details</h3>
                <dl className="dp-details-grid">
                  {Object.entries(service.details)
                    .filter(([key]) => relevantDetails.includes(key))
                    .map(
                      ([key, value]) =>
                        value &&
                        (Array.isArray(value) ? value.length > 0 : true) && (
                          <React.Fragment key={key}>
                            <dt>
                              <i className={`fas ${getDetailIcon(key)}`}></i>{" "}
                              {key
                                .replace("_", " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                              :
                            </dt>
                            <dd>
                              {Array.isArray(value)
                                ? value.join(", ")
                                : String(value)}
                            </dd>
                          </React.Fragment>
                        ),
                    )}
                </dl>
              </div>
            )}
            {service.description && (
              <div className="dp-details">
                <h3>Description</h3>
                <div className="dp-description">{service.description}</div>
              </div>
            )}
            {typeof service.additionalInfo === "string" &&
              service.additionalInfo.trim() !== "" && (
                <div className="dp-additional-details">
                  <h3>Additional Details</h3>
                  <div className="dp-description">{service.additionalInfo}</div>
                </div>
              )}
          </div>
          <div className="dp-subsection-2">
            {service.discount > 0 && (
              <div className="dp-discount-label">{service.discount}% Off</div>
            )}
            <div className="dp-carousel">
              <button
                className="dp-photo-open"
                type="button"
                onClick={() => setShowImage(true)}
                aria-label={`Enlarge photo of ${service.name}`}
              >
                <img
                  src={service.photos[activePhoto]}
                  alt={`${service.name}, photo ${activePhoto + 1}`}
                />
                <span className="dp-photo-enlarge">View photos ↗</span>
              </button>
              {service.photos.length > 1 && (
                <div className="dp-photo-controls">
                  <button
                    type="button"
                    onClick={() =>
                      setActivePhoto(
                        (index) =>
                          (index - 1 + service.photos.length) %
                          service.photos.length,
                      )
                    }
                    aria-label="Previous photo"
                  >
                    ←
                  </button>
                  <span>
                    {activePhoto + 1} / {service.photos.length}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setActivePhoto(
                        (index) => (index + 1) % service.photos.length,
                      )
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
                {formatPriceRange(service.priceRange)}
              </div>
            </div>
          </div>
        </div>

        <div className="dp-section" id="dp-section-pricing">
          <h3 className="dp-section-title">Pricing & Packages</h3>
          <div className="dp-pricing-container">
            <div className="dp-pricing-tabs">
              {service.pricingPackages.map((pkg, idx) => (
                <button
                  type="button"
                  key={idx}
                  className={`dp-tab-box ${idx === activePackage ? "active" : ""}`}
                  aria-pressed={idx === activePackage}
                  onClick={() => handlePackageClick(idx)}
                >
                  {pkg.name}
                </button>
              ))}
            </div>
            <div className="dp-package-content">
              {service.pricingPackages.map((pkg, idx) => (
                <div
                  key={idx}
                  className="dp-package-details"
                  style={{ display: idx === activePackage ? "flex" : "none" }}
                >
                  <div className="dp-inclusions-section">
                    <h4>{pkg.name} Package</h4>
                    <ul className="dp-inclusions">
                      {Array.isArray(pkg.inclusions) ? (
                        pkg.inclusions.map((item, i) => (
                          <li key={i} className="dp-inclusion-item">
                            <i className="fas fa-check"></i> {item}
                          </li>
                        ))
                      ) : (
                        <li className="dp-inclusion-item">
                          <i className="fas fa-check"></i>{" "}
                          {pkg.inclusions || "No inclusions specified"}
                        </li>
                      )}
                    </ul>
                    <div className="dp-package-price">
                      {formatMoney(pkg.price)}
                    </div>
                    {service.category === "Wedding Venues" && (
                      <div className="dp-quantity-selector">
                        <button
                          onClick={() =>
                            setQuantity((prev) => Math.max(1, prev - 1))
                          }
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <span>{quantity}</span>
                        <button onClick={() => setQuantity((prev) => prev + 1)}>
                          +
                        </button>
                      </div>
                    )}
                    <button className="dp-btn" onClick={handleAddToEstimate}>
                      Add to Estimate
                    </button>
                    <button
                      className="dp-btn"
                      style={{ marginLeft: "10px" }}
                      onClick={handleBookClick(pkg._id)}
                    >
                      Book Now
                    </button>
                  </div>
                  <div className="dp-availability-section">
                    {service.isRental ? (
                      <div className="dp-calendar-range">
                        <input
                          type="date"
                          className="dp-calendar"
                          value={startDate}
                          min={today}
                          onChange={(e) => {
                            setStartDate(e.target.value);
                            if (new Date(e.target.value) >= new Date(endDate))
                              setEndDate("");
                          }}
                          aria-label="Rental start date"
                        />
                        <input
                          type="date"
                          className="dp-calendar"
                          value={endDate}
                          min={
                            startDate
                              ? new Date(
                                  new Date(startDate).getTime() + 86400000,
                                )
                                  .toISOString()
                                  .split("T")[0]
                              : today
                          }
                          onChange={(e) => setEndDate(e.target.value)}
                          aria-label="Rental end date"
                        />
                      </div>
                    ) : (
                      <input
                        type="date"
                        className="dp-calendar"
                        value={date}
                        min={today}
                        onChange={(e) => setDate(e.target.value)}
                        aria-label="Event date"
                      />
                    )}
                    <button
                      className="dp-btn"
                      onClick={handleAvailabilityCheck}
                      disabled={
                        service.isRental ? !startDate || !endDate : !date
                      }
                    >
                      Check Availability
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {(service.location_map || service.vendorDetails?.office_address) && (
          <div className="dp-section" id="dp-section-location">
            <h3 className="dp-section-title">Location</h3>
            <div className="dp-map">
              {getMapSource() ? (
                <MapContainer
                  center={getCoordinates()}
                  zoom={13}
                  style={{ width: "100%", height: "400px" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={getCoordinates()}>
                    <Popup>
                      {service?.vendorDetails?.office_address ||
                        service?.city ||
                        "Service Location"}
                    </Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <p className="dp-location-note">
                  {service.vendorDetails?.office_address || service.city}. Ask
                  the vendor for directions and the exact meeting point.
                </p>
              )}
            </div>
            <div className="dp-address-text">
              {service.address || service.city}
            </div>
          </div>
        )}

        <div className="dp-section" id="dp-section-reviews">
          <h3 className="dp-section-title">Reviews</h3>
          <div className="dp-review-counter">
            <div className="dp-total-rating">
              {service.avgRating} Average{" "}
              <span>
                <i className="fas fa-star"></i> ({service.reviewCount} Reviews)
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
                        backgroundColor: service.reviews.length
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
          {displayedReviews.length < service.reviews.length && (
            <button className="dp-btn" onClick={loadMoreReviews}>
              Load More
            </button>
          )}
        </div>
      </main>

      <Modal
        show={showDateModal}
        onHide={() => {
          if (!booking) setShowDateModal(false);
        }}
        centered
        aria-labelledby="service-booking-title"
        className="dp-booking-modal"
      >
        <Modal.Header closeButton={!booking}>
          <Modal.Title id="service-booking-title">
            Select booking dates
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {service.isRental ? (
            <>
              <label htmlFor="booking-start">Rental start date</label>
              <input
                id="booking-start"
                type="date"
                className="dp-calendar"
                value={modalStartDate}
                min={today}
                onChange={(event) => {
                  setModalStartDate(event.target.value);
                  if (event.target.value >= modalEndDate) setModalEndDate("");
                }}
              />
              <label htmlFor="booking-end">Rental end date</label>
              <input
                id="booking-end"
                type="date"
                className="dp-calendar"
                value={modalEndDate}
                min={
                  modalStartDate
                    ? new Date(new Date(modalStartDate).getTime() + 86400000)
                        .toISOString()
                        .split("T")[0]
                    : today
                }
                onChange={(event) => setModalEndDate(event.target.value)}
              />
            </>
          ) : (
            <>
              <label htmlFor="booking-date">Event date</label>
              <input
                id="booking-date"
                type="date"
                className="dp-calendar"
                value={modalDate}
                min={today}
                onChange={(event) => setModalDate(event.target.value)}
              />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="dp-btn dp-btn-secondary"
            onClick={() => setShowDateModal(false)}
            disabled={booking}
          >
            Cancel
          </button>
          <button
            type="button"
            className="dp-btn"
            onClick={handleBook}
            disabled={booking || !validateDates(true)}
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
        aria-labelledby="service-photo-title"
        className="dp-photo-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="service-photo-title">{service.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={service.photos[activePhoto]}
            alt={`${service.name}, photo ${activePhoto + 1}`}
          />
        </Modal.Body>
      </Modal>
      <Footer />
    </>
  );
};

export default ServiceDetails;
