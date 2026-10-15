TOBI'S TYPE YOUR NAME WEBSITE - SEARCH HISTORY VERSION

What this update adds:
- The admin panel includes a Search history section.
- Each search records the name entered and the server timestamp.
- History is shared across visitors and devices through Netlify Blobs.
- The admin panel can refresh history or clear it.
- Search logging notice is visible to visitors.

IMPORTANT: this project needs Netlify Functions; uploading only public/index.html is not enough.

DEPLOY / CONFIGURE:
1. Deploy the whole project folder to Netlify using a Git-connected project or Netlify CLI (not a static-only drag-and-drop deploy).
2. In Netlify, open your site settings and add an environment variable:
   ADMIN_PASSWORD = a strong password you choose
   Ensure its scope includes Functions.
3. Redeploy after setting the variable.
4. Open the live site, choose Owner login, and enter the ADMIN_PASSWORD value.

SECURITY / PRIVACY NOTES:
- Do not share ADMIN_PASSWORD publicly.
- The password is checked on the server, not hardcoded into the page.
- The message editor still uses browser local storage and is not a shared database. Only the search history is server-stored in this version.
- This logs the name searched and time, not the visitor's identity or IP address.
- Tell visitors that searches are logged; the notice is included on the page.
- The backend keeps the newest 1,000 searches.
