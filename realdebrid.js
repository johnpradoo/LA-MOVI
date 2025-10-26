import fetch from "node-fetch";

const RD_API = "https://api.real-debrid.com/rest/1.0/unrestrict/link";
const RD_TOKEN = "BMN5XVDCC3R2XSHG6IBWZ5O64BPCOUI44VZGSRAW2E7QSWXLCD7Q";

export async function getRDLink(originalLink) {
  try {
    const response = await fetch(RD_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RD_TOKEN}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({ link: originalLink })
    });

    const data = await response.json();
    return data.download || null;
  } catch (err) {
    console.error("Error con RD:", err);
    return null;
  }
}
