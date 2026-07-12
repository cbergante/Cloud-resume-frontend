const API_URL = "https://fa-resumechallenge.azurewebsites.net/api/visitorcounter";
const DURATION_URL = "https://fa-resumechallenge.azurewebsites.net/api/logduration";

let visitId = null;
let visitDate = null;
const startTime = Date.now();
let durationSent = false;

fetch(API_URL)
  .then(response => response.json())
  .then(data => {
    document.getElementById("counter").textContent = data.count;
    visitId = data.visit_id || null;
    visitDate = data.visit_date || null;
  })
  .catch(error => {
    console.error("Error fetching visitor count:", error);
    document.getElementById("counter").textContent = "—";
  });

function sendDuration() {
  // Only report once per page visit, and only if we actually have a visit
  // to attach the duration to (logging may have been skipped server-side,
  // e.g. for automated test traffic).
  if (durationSent || !visitId || !visitDate) return;
  durationSent = true;

  const durationSeconds = Math.round((Date.now() - startTime) / 1000);
  const payload = JSON.stringify({
    row_key: visitId,
    date: visitDate,
    duration_seconds: durationSeconds
  });

  // sendBeacon is used instead of fetch() because it reliably delivers the
  // request even as the page is being unloaded/closed, which a normal
  // fetch() call cannot guarantee.
  const blob = new Blob([payload], { type: "application/json" });
  navigator.sendBeacon(DURATION_URL, blob);
}

// 'visibilitychange' catches tab switches and most mobile "leaving" cases.
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    sendDuration();
  }
});

// 'pagehide' catches full navigation away / tab close as a fallback.
window.addEventListener("pagehide", sendDuration);