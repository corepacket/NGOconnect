const isProduction = process.env.NODE_ENV === "production"

const requiredInAllEnvs = ["JWT_SECRET", "MONGODB_URL"]
const requiredInProduction = ["CLIENT_URL"]

const missingRequired = [
  ...requiredInAllEnvs.filter((key) => !process.env[key]),
  ...(isProduction ? requiredInProduction.filter((key) => !process.env[key]) : []),
]

if (missingRequired.length > 0) {
  throw new Error(`Missing required environment variables: ${missingRequired.join(", ")}`)
}

const cloudinaryMissing = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"]
  .filter((key) => !process.env[key])

if (cloudinaryMissing.length > 0) {
  console.warn(
    `[env] Cloudinary environment variables missing: ${cloudinaryMissing.join(", ")}. Image upload endpoints will fail until these are set.`
  )
}

const parsedOrigins = (process.env.CORS_ORIGIN || process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)

const cookieSameSite = process.env.COOKIE_SAME_SITE || (isProduction ? "none" : "lax")

export const env = {
  isProduction,
  port: Number(process.env.PORT) || 5000,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigins: parsedOrigins,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: cookieSameSite,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}
