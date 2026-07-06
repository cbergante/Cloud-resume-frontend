const API_URL = "https://fa-resumechallenge.azurewebsites.net/api/visitorcounter";

fetch(API_URL)
  .then(response => response.json())
  .then(data => {
    document.getElementById("counter").textContent = data.count;
  })
  .catch(error => {
    console.error("Error fetching visitor count:", error);
    document.getElementById("counter").textContent = "—";
  });