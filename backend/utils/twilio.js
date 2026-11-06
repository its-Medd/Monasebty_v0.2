import twilio from "twilio"
import { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE, NODE_ENV } from "../config/env.js"

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN)

export const sendOTP = async (phone, otp) => {
  if (NODE_ENV === "development") {
    const safePhone = String(phone || "").replace(/[\r\n]/g, "")
    const safeOtp = String(otp || "").replace(/[\r\n]/g, "")
    console.log(`Mock SMS to ${safePhone}: Your OTP is ${safeOtp}`)
    return
  }
  await client.messages.create({
    body: `Your EazyWed OTP is ${otp}`,
    from: TWILIO_PHONE,
    to: phone,
  })
}
