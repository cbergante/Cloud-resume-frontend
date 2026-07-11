# Cloud Resume Challenge — Front End

Personal resume site built as part of the [Cloud Resume Challenge](https://cloudresumechallenge.dev/) (Azure Edition). Live at [resume.carlosbergante.com](https://resume.carlosbergante.com).

This repo contains the static front end. The visitor counter is powered by a separate serverless API — see [cloud-resume-backend](https://github.com/cbergante/cloud-resume-backend).

## Overview

A hand-built HTML/CSS resume with a Matrix-style animated background and a live visitor counter, fetched from an Azure Function backed by Cosmos DB.

## Tech Stack

- **Hosting**: Azure Storage static website
- **CDN / HTTPS / DNS**: Cloudflare (see notes below on why)
- **Front end**: Plain HTML, CSS, and vanilla JavaScript — no framework or build step

## Project Structure

```
frontend/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── matrix.js       # animated background
│   └── counter.js      # fetches live visitor count from the backend API
└── images/
    └── Carlos.png
```

## How the Visitor Counter Works

`js/counter.js` calls the deployed Azure Function's public endpoint on page load:

```js
fetch("https://fa-resumechallenge.azurewebsites.net/api/visitorcounter")
```

The response updates the `<span id="counter">` element in `index.html` with the current count. See the [backend repo](https://github.com/cbergante/cloud-resume-backend) for how that number is stored and incremented.

## Hosting Notes

This site is hosted on an **Azure Storage static website**, per the original challenge spec. However, Azure's own CDN path (classic Azure CDN and Azure Front Door) hit two roadblocks along the way:

- Classic Azure CDN no longer accepts new profile/domain creation as of October 2025.
- Azure Front Door is currently unavailable on Free Trial / Student subscriptions.

As a result, **Cloudflare** is used in front of the Azure Storage origin instead, providing CDN caching, a managed HTTPS certificate, and DNS — a substitution the original guidebook itself mentions as a legitimate alternative CDN provider.

## Local Development

No build step required — just open `index.html` directly in a browser, or serve the folder with any static file server:

```bash
npx serve .
```

Note: the visitor counter will still call the live production API even when previewed locally, since CORS on the backend is scoped to `https://resume.carlosbergante.com`. Local previews will show a CORS error in the console for that one component — this is expected and does not affect the deployed site.

## Deployment

Files are uploaded to the `$web` container of the Azure Storage account's static website. Manual for now — automated CI/CD via GitHub Actions is planned for Chunk 4 of the challenge.

## Project Status

- [x] HTML/CSS resume, styled and responsive
- [x] Deployed to Azure Storage static website
- [x] Custom domain + HTTPS via Cloudflare
- [x] Live visitor counter wired to backend API
- [ ] Automated smoke tests (Playwright/Cypress)
- [ ] CI/CD via GitHub Actions

## Author

**Carlos Bergante**
[LinkedIn](https://www.linkedin.com/in/carlosbergante/) · [cbergante@outlook.com](mailto:cbergante@outlook.com)# Cloud-resume-frontend
