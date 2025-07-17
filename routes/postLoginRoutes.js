const express = require('express');
const router = express.Router();

// Utility: Returns post-login EJS if logged in, else public version
function renderPostOrPublic(res, req, page) {
  if (req.session.user) {
    res.render(`post-${page}`, { user: req.session.user });
  } else {
    res.render(page, { user: null });
  }
}

// ------- PET MEDICINES -------
router.get('/pet-medicines', (req, res) => {
  renderPostOrPublic(res, req, 'pet-medicines');
});
router.post('/pet-medicines', (req, res) => {
  // TO DO: Save order to DB
  console.log(`[ORDER] User:`, req.session.user, 'Medicine Order:', req.body);
  res.redirect('/pet-medicines');
});

// ------- HOME SERVICES -------
router.get('/home-services', (req, res) => {
  renderPostOrPublic(res, req, 'home-services');
});
router.post('/home-services', (req, res) => {
  // TO DO: Save service booking to DB
  console.log(`[BOOKING] User:`, req.session.user, 'Home Service:', req.body);
  res.redirect('/home-services');
});

// ------- EMERGENCY -------
router.get('/emergency', (req, res) => {
  renderPostOrPublic(res, req, 'emergency');
});
router.post('/emergency', (req, res) => {
  // TO DO: Save emergency report to DB
  console.log(`[EMERGENCY] User:`, req.session.user, 'Form:', req.body);
  res.redirect('/emergency');
});

// ------- ABOUT US -------
router.get('/about-us', (req, res) => {
  renderPostOrPublic(res, req, 'about-us');
});
router.post('/about-us', (req, res) => {
  // TO DO: Handle about-us feedback/form
  console.log(`[ABOUT] User:`, req.session.user, 'About Us Form:', req.body);
  res.redirect('/about-us');
});

// ------- CONTACT US -------
router.get('/contact-us', (req, res) => {
  renderPostOrPublic(res, req, 'contact-us');
});
router.post('/contact-us', (req, res) => {
  // TO DO: Save contact form to DB, send email, etc.
  console.log(`[CONTACT] User:`, req.session.user, 'Contact Form:', req.body);
  res.redirect('/contact-us');
});

module.exports = router;

/*
USAGE:
- In app.js:
    const postLoginRoutes = require('./routes/postLoginRoutes');
    app.use('/', postLoginRoutes);

- This will handle both logged in/not logged in GET and POST flow for all five main site sections.
- Add your DB/model logic where the '[TO DO]' comments are for production.
*/
