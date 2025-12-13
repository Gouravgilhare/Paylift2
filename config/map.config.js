import axios from "axios";
import "./env.config.js";

let cachedToken = null;
let tokenExpiry = null;

export async function getMapplsToken() {
  const now = Math.floor(Date.now() / 1000);

  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  try {
    const res = await axios.post(
      "https://outpost.mappls.com/api/security/oauth/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.MAPPLS_CLIENT_ID,
        client_secret: process.env.MAPPLS_CLIENT_SECRET,
      })
    );

    cachedToken = res.data.access_token;
    tokenExpiry = now + res.data.expires_in;
    return cachedToken;
  } catch (err) {
    throw new Error("Failed to generate token");
  }
}
