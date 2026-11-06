import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

// For ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Setup temporary storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"))
  },
  filename: function (req, file, cb) {
    const extensionByMimeType = {
      "image/jpeg": ".jpg",
      "image/jpg": ".jpg",
      "image/png": ".png",
    }
    const uniqueFilename = `${uuidv4()}${extensionByMimeType[file.mimetype] || ""}`
    cb(null, uniqueFilename)
  },
})

const ALLOWED_SERVICE_DETAILS = [
  "amenities",
  "bust",
  "cancellation_policy",
  "catering_type",
  "cities_covered",
  "design",
  "doors",
  "expertise",
  "has_team",
  "home_service",
  "length",
  "location_type",
  "material",
  "mehndi_type",
  "parking_space",
  "rental_duration",
  "seats",
  "sells_mehndi",
  "services_for",
  "size",
  "staff",
  "transmission",
  "venue_type",
  "wheelchair_accessible",
]

const ALLOWED_VENDOR_REQUEST_FIELDS = [
  "status",
  "submittedAt",
  "phone_whatsapp",
  "whatsapp_number",
  "category",
  "brand_icon",
  "brand_name",
  "full_name",
  "email",
  "instagram_link",
  "facebook_link",
  "booking_email",
  "office_address",
  "website_link",
  "map_link",
  "terms_accepted",
  "rejectionCount",
]

// File filter function
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Only image files are allowed"), false)
  }
}

// Create different multer instances for services and cards
const serviceUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024, // 500KB limit
  },
})

const cardUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024, // 500KB limit
  },
})

// Middleware for wedding services form
export const uploadServicePhotos = serviceUpload.array("photos", 5) // Max 5 photos

// Middleware for wedding card form - simple upload
export const uploadCardImage = cardUpload.single("front_image")

// Error handler middleware for multer
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large. Maximum size is 500KB." })
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ message: "Too many files. Maximum is 5 photos." })
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` })
  } else if (err) {
    // Other errors
    return res.status(400).json({ message: err.message })
  }
  next()
}

// Normalize service data middleware
export const normalizeServiceData = (req, res, next) => {
  try {
    // Process basic fields from form data
    const {
      category,
      name,
      address,
      location_map,
      description,
      additional_info,
      price_range,
      discount,
      discount_expiry,
      working_hours,
      working_days,
    } = req.body

    // Process pricing packages (cap at 20 to prevent loop-bound injection)
    let pricing_packages = []
    if (req.body.packageName) {
      const MAX_PACKAGES = 20;
      const names = Array.isArray(req.body.packageName) ? req.body.packageName : [req.body.packageName]
      const prices = Array.isArray(req.body.packagePrice) ? req.body.packagePrice : [req.body.packagePrice]
      const inclusions = Array.isArray(req.body.packageInclusions)
        ? req.body.packageInclusions
        : [req.body.packageInclusions]

      for (const [i, name] of names.slice(0, MAX_PACKAGES).entries()) {
        if (name && prices[i]) {
          pricing_packages.push({
            name,
            price: Number(prices[i]),
            inclusions: inclusions[i] || "",
          })
        }
      }
    }

    // Process availability
    const availability = {
      working_hours: working_hours || "",
      working_days: Array.isArray(working_days) ? working_days : working_days?.split(",") || [],
    }

    // Process service details based on category
    const details = {}
    
    // Only process allowed service details fields
    for (const [key, value] of Object.entries(req.body)) {
      if (
        ALLOWED_SERVICE_DETAILS.includes(key) &&
        key !== "__proto__" &&
        key !== "constructor" &&
        key !== "prototype"
      ) {
        // Convert true/false strings to boolean
        if (value === "true") details[key] = true
        else if (value === "false") details[key] = false
        // Convert arrays
        else if (Array.isArray(value)) details[key] = value
        // Convert comma-separated values to arrays
        else if (typeof value === "string" && (key === "amenities" || key === "cities_covered")) {
          details[key] = value.split(",").map((item) => item.trim())
        }
        // Convert numbers
        else if (!isNaN(value) && typeof value === "string" && value !== "") {
          details[key] = Number(value)
        }
        // Keep other values as is
        else details[key] = value
      }
    }

    // Create normalized service object
    req.normalizedService = {
      category: category,
      name: name,
      address: address,
      location_map: location_map || "",
      description: description,
      additional_info: additional_info || "",
      price_range: price_range,
      discount: discount ? Number(discount) : 0,
      discount_expiry: discount_expiry || null,
      availability: availability,
      pricing_packages: pricing_packages,
      details: details,
      photos: req.files ? req.files.map(file => file.path) : [],
    }

    next()
  } catch (error) {
    console.error("Service normalization error:", error)
    res.status(400).json({ message: "Error processing form data" })
  }
}

// Normalize card data middleware
export const normalizeCardData = (req, res, next) => {
  try {
    const { type, price_per_card, quantity_available, format, design_time, description } = req.body

    // Process format (convert string to array)
    const formatArray = format.split(",").map(item => item.trim())

    // Create normalized card object
    req.normalizedCard = {
      type: type,
      price_per_card: Number(price_per_card),
      quantity_available: Number(quantity_available),
      format: formatArray,
      design_time: design_time,
      description: description,
      front_image: req.file ? req.file.path : null,
    }

    next()
  } catch (error) {
    console.error("Card normalization error:", error)
    res.status(400).json({ message: "Error processing form data" })
  }
}

export const normalizeServiceRequest = (req, res, next) => {
  try {
    req.normalizedBody = {}

    if (req.headers["content-type"]?.includes("multipart/form-data")) {
      // Basic fields
      req.normalizedBody.category = req.body.category
      req.normalizedBody.name = req.body.name
      req.normalizedBody.address = req.body.address
      req.normalizedBody.location_map = req.body.location_map
      req.normalizedBody.description = req.body.description
      req.normalizedBody.additional_info = req.body.additional_info
      req.normalizedBody.price_range = req.body.price_range
      req.normalizedBody.discount = req.body.discount || ""
      req.normalizedBody.discount_expiry = req.body.discount_expiry || ""

      // Availability
      req.normalizedBody.availability = {
        working_hours: req.body["availability[working_hours]"],
        working_days: Array.isArray(req.body["availability[working_days][]"])
          ? req.body["availability[working_days][]"]
          : [req.body["availability[working_days][]"]],
      }

      // Details
      const details = {}
      for (const key in req.body) {
        if (key.startsWith("details[")) {
          const match = key.match(/^details\[([a-zA-Z0-9_]+)\](\[\])?$/)
          if (!match) continue
          const field = match[1]
          if (
            !ALLOWED_SERVICE_DETAILS.includes(field) ||
            field === "__proto__" ||
            field === "constructor" ||
            field === "prototype"
          ) {
            continue
          }

          if (key.endsWith("[]")) {
            // Handle array fields
            if (!details[field]) {
              details[field] = []
            }
            if (Array.isArray(req.body[key])) {
              details[field] = req.body[key]
            } else {
              details[field].push(req.body[key])
            }
          } else {
            let value = req.body[key]
            // Convert boolean strings to actual booleans
            if (value === "true") value = true
            if (value === "false") value = false
            // Convert numeric strings to numbers
            if (!isNaN(value) && value !== "") value = Number(value)

            details[field] = value
          }
        }
      }
      req.normalizedBody.details = details

      // Pricing packages
      const packages = []
      const packageIndices = new Set()
      for (const key in req.body) {
        if (key.startsWith("pricing_packages[")) {
          const match = key.match(/pricing_packages\[(\d+)\]\[(.*?)\]/)
          if (match) {
            const index = Number.parseInt(match[1])
            packageIndices.add(index)
          }
        }
      }

      packageIndices.forEach((index) => {
        const pkg = {
          name: req.body[`pricing_packages[${index}][name]`] || "",
          price: Number.parseFloat(req.body[`pricing_packages[${index}][price]`]) || 0,
          inclusions: req.body[`pricing_packages[${index}][inclusions]`] || "",
        }
        if (pkg.name && pkg.price > 0) {
          packages.push(pkg)
        }
      })

      req.normalizedBody.pricing_packages = packages

      // Handle photo uploads
      if (req.files?.photos) {
        req.normalizedBody.photos = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos]
      }
    } else {
      req.normalizedBody = req.body
    }

    next()
  } catch (error) {
    console.error("Service request normalization error:", error)
    res.status(400).json({ message: "Invalid service request format" })
  }
}

export const normalizeVendorRequest = (req, res, next) => {
  try {
    req.normalizedBody = {}

    if (req.headers["content-type"]?.includes("multipart/form-data")) {
      req.normalizedBody.phone = req.body.phone || ""
      req.normalizedBody.password = req.body.password || ""
      req.normalizedBody.otp = req.body.otp || ""

      const vendorRequest = {}
      for (const key in req.body) {
        if (key.startsWith("vendorRequest[")) {
          const match = key.match(/^vendorRequest\[([a-zA-Z0-9_]+)\]$/)
          if (!match) continue
          const field = match[1]
          if (
            ALLOWED_VENDOR_REQUEST_FIELDS.includes(field) &&
            field !== "__proto__" &&
            field !== "constructor" &&
            field !== "prototype"
          ) {
            let value = req.body[key]
            if (value === "true") value = true
            if (value === "false") value = false
            vendorRequest[field] = value
          }
        }
      }

      // Transform category to match schema enum
      if (vendorRequest.category) {
        const categoryMap = {
          "wedding-venues": "Wedding Venues",
          photographers: "Photographers",
          "bridal-makeup": "Bridal Makeup",
          "henna-artists": "Henna Artists",
          "bridal-wear": "Bridal Wear",
          "car-rental": "Car Rental",
          "wedding-cards": "Wedding Cards",
        }
        vendorRequest.category = categoryMap[vendorRequest.category.toLowerCase()] || vendorRequest.category
      }

      req.normalizedBody.vendorRequest = vendorRequest

      if (req.files?.brand_icon) {
        // Pass the file object reference without exposing raw binary data to logging.
        // The actual buffer is accessed downstream only when needed for upload.
        const icon = req.files.brand_icon;
        req.normalizedBody.brand_icon = {
          data: icon.data,
          mimetype: icon.mimetype,
          size: icon.size,
          name: icon.name,
        };
      }
    } else {
      req.normalizedBody = req.body
    }

    next()
  } catch (error) {
    console.error("Vendor request normalization error:", error)
    res.status(400).json({ message: "Invalid vendor request format" })
  }
}
