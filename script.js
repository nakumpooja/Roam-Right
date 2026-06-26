/* =============================================
   ROAMRIGHT — MASTER SCRIPT
   All inline and shared JavaScript
   ============================================= */

// ---- NAVBAR SCROLL ----
window.addEventListener('scroll', function () {
  var navbar = document.getElementById('navbar');
  if (navbar) {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
});

// ---- HAMBURGER ----
function toggleMenu() {
  var links = document.getElementById('navLinks');
  if (links) links.classList.toggle('open');
}

// ---- TOAST ----
function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function () { t.classList.remove('show'); }, 3000);
}

// ---- SCROLL TO SECTION ----
function scrollToSection(id) {
  var el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ---- HERO SEARCH ----
function searchDestination() {
  var val = document.getElementById('searchInput') ? document.getElementById('searchInput').value.trim() : '';
  if (!val) { showToast('Please enter a destination!'); return; }
  sessionStorage.setItem('searchQuery', val);
  window.location.href = 'destinations.html';
}

function handleSearch(e) {
  if (e.key === 'Enter') searchDestination();
}

function quickSearch(cat) {
  sessionStorage.setItem('filterCat', cat);
  window.location.href = 'destinations.html';
}

function filterDestination(cat) {
  sessionStorage.setItem('filterCat', cat);
  window.location.href = 'destinations.html';
}

// ---- FAVOURITES ----
function toggleFav(btn) {
  btn.classList.toggle('active');
  if (btn.classList.contains('active')) {
    btn.textContent = '♥';
    showToast('Added to Wishlist ♥');
  } else {
    btn.textContent = '♡';
    showToast('Removed from Wishlist');
  }
}

// ---- NEWSLETTER ----
function subscribeNewsletter() {
  var email = document.getElementById('newsletterEmail');
  var msg = document.getElementById('newsletterMsg');
  if (!email || !email.value.trim()) { showToast('Please enter your email!'); return; }
  if (!email.value.includes('@')) { showToast('Please enter a valid email!'); return; }
  if (msg) { msg.textContent = '🎉 Thank you! You\'re now subscribed.'; }
  email.value = '';
  showToast('Successfully subscribed!');
}

// ---- DESTINATIONS FILTER ----
var currentFilter = 'All';

function setFilter(cat, btn) {
  currentFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  filterCards();
}

function filterCards() {
  var searchVal = document.getElementById('destSearch') ? document.getElementById('destSearch').value.toLowerCase() : '';
  var cards = document.querySelectorAll('.dest-card');
  var noResults = document.getElementById('noResults');
  var visible = 0;
  cards.forEach(function (card) {
    var cat = card.getAttribute('data-category') || '';
    var name = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
    var desc = card.querySelector('p') ? card.querySelector('p').textContent.toLowerCase() : '';
    var matchCat = currentFilter === 'All' || cat === currentFilter;
    var matchSearch = !searchVal || name.includes(searchVal) || desc.includes(searchVal);
    if (matchCat && matchSearch) { card.style.display = ''; visible++; }
    else { card.style.display = 'none'; }
  });
  if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
}

function sortCards() {
  var sortBy = document.getElementById('sortBy') ? document.getElementById('sortBy').value : 'popular';
  var grid = document.getElementById('destGrid');
  if (!grid) return;
  var cards = Array.from(grid.querySelectorAll('.dest-card'));
  cards.sort(function (a, b) {
    if (sortBy === 'price-low') return parseInt(a.dataset.price) - parseInt(b.dataset.price);
    if (sortBy === 'price-high') return parseInt(b.dataset.price) - parseInt(a.dataset.price);
    if (sortBy === 'rating') return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
    return 0;
  });
  cards.forEach(function (c) { grid.appendChild(c); });
}

// Apply filter from sessionStorage on destinations page
window.addEventListener('DOMContentLoaded', function () {
  var cat = sessionStorage.getItem('filterCat');
  var q = sessionStorage.getItem('searchQuery');
  if (cat && document.querySelector('.filter-btn')) {
    sessionStorage.removeItem('filterCat');
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
      if (btn.textContent.trim().toLowerCase().includes(cat.toLowerCase())) {
        setFilter(cat, btn);
      }
    });
  }
  if (q && document.getElementById('destSearch')) {
    sessionStorage.removeItem('searchQuery');
    document.getElementById('destSearch').value = q;
    filterCards();
  }
});

// ---- BOOKING MODAL ----
function bookNow(dest) {
  var modal = document.getElementById('bookModal');
  var nameEl = document.getElementById('bookDestName');
  if (modal) { modal.classList.add('open'); if (nameEl) nameEl.textContent = '✈️ ' + dest; }
}

function closeModal(id) {
  var m = document.getElementById(id);
  if (m) m.classList.remove('open');
}

function confirmBooking() {
  var name = document.getElementById('bookName') ? document.getElementById('bookName').value.trim() : '';
  var date = document.getElementById('bookDate') ? document.getElementById('bookDate').value : '';
  if (!name) { showToast('Please enter your name!'); return; }
  if (!date) { showToast('Please select a travel date!'); return; }
  closeModal('bookModal');
  showToast('🎉 Booking confirmed! Check your email.');
}

// ---- CONTACT PAGE ----
function switchFormTab(tab, btn) {
  document.querySelectorAll('.contact-form').forEach(function (f) { f.classList.add('hidden'); });
  document.querySelectorAll('.ftab').forEach(function (b) { b.classList.remove('active'); });
  var f = document.getElementById('form-' + tab);
  if (f) f.classList.remove('hidden');
  if (btn) btn.classList.add('active');
}

function toggleFaq(btn) {
  var answer = btn.nextElementSibling;
  var span = btn.querySelector('span');
  if (answer.classList.contains('open')) {
    answer.classList.remove('open');
    if (span) span.textContent = '+';
  } else {
    document.querySelectorAll('.faq-a.open').forEach(function (a) {
      a.classList.remove('open');
      var s = a.previousElementSibling.querySelector('span');
      if (s) s.textContent = '+';
    });
    answer.classList.add('open');
    if (span) span.textContent = '−';
  }
}

function submitContact() {
  var first = document.getElementById('contFirstName') ? document.getElementById('contFirstName').value.trim() : '';
  var email = document.getElementById('contEmail') ? document.getElementById('contEmail').value.trim() : '';
  var msg = document.getElementById('contMessage') ? document.getElementById('contMessage').value.trim() : '';
  if (!first) { showToast('Please enter your first name.'); return; }
  if (!email || !email.includes('@')) { showToast('Please enter a valid email.'); return; }
  if (!msg) { showToast('Please write your message.'); return; }
  showSuccessForm();
}

function submitSupport() {
  var id = document.getElementById('supBookingId') ? document.getElementById('supBookingId').value.trim() : '';
  var desc = document.getElementById('supDesc') ? document.getElementById('supDesc').value.trim() : '';
  if (!id) { showToast('Please enter your Booking ID.'); return; }
  if (!desc) { showToast('Please describe the issue.'); return; }
  showSuccessForm();
}

function submitPartner() {
  var org = document.getElementById('partOrg') ? document.getElementById('partOrg').value.trim() : '';
  var email = document.getElementById('partEmail') ? document.getElementById('partEmail').value.trim() : '';
  if (!org) { showToast('Please enter your company name.'); return; }
  if (!email || !email.includes('@')) { showToast('Please enter a valid email.'); return; }
  showSuccessForm();
}

function showSuccessForm() {
  document.querySelectorAll('.contact-form').forEach(function (f) { f.classList.add('hidden'); });
  document.querySelectorAll('.ftab').forEach(function (b) { b.classList.remove('active'); });
  var s = document.getElementById('formSuccess');
  if (s) s.classList.remove('hidden');
  showToast('Message sent successfully! ✅');
}

function resetContactForm() {
  var s = document.getElementById('formSuccess');
  if (s) s.classList.add('hidden');
  var tab = document.getElementById('form-general');
  if (tab) tab.classList.remove('hidden');
  var ftab = document.querySelector('.ftab');
  if (ftab) ftab.classList.add('active');
}

// ---- LOGIN ----
function loginUser() {
  var email = document.getElementById('loginEmail') ? document.getElementById('loginEmail').value.trim() : '';
  var pass = document.getElementById('loginPass') ? document.getElementById('loginPass').value : '';
  var err = document.getElementById('loginError');
  if (!email || !email.includes('@')) {
    if (err) { err.textContent = 'Please enter a valid email address.'; err.classList.remove('hidden'); }
    return;
  }
  if (pass.length < 6) {
    if (err) { err.textContent = 'Password must be at least 6 characters.'; err.classList.remove('hidden'); }
    return;
  }
  if (err) err.classList.add('hidden');
  showToast('Logging you in...');
  setTimeout(function () { window.location.href = 'index.html'; }, 1000);
}

function socialLogin(provider) {
  showToast('Connecting with ' + provider + '...');
  setTimeout(function () { window.location.href = 'index.html'; }, 1500);
}

function showForgotPassword() {
  var lf = document.getElementById('loginForm');
  var fp = document.getElementById('forgotPanel');
  if (lf) lf.classList.add('hidden');
  if (fp) fp.classList.remove('hidden');
}

function showLoginForm() {
  var lf = document.getElementById('loginForm');
  var fp = document.getElementById('forgotPanel');
  if (lf) lf.classList.remove('hidden');
  if (fp) fp.classList.add('hidden');
}

function sendReset() {
  var email = document.getElementById('forgotEmail') ? document.getElementById('forgotEmail').value.trim() : '';
  if (!email || !email.includes('@')) { showToast('Please enter a valid email.'); return; }
  showToast('Reset link sent to ' + email + '!');
  setTimeout(showLoginForm, 1500);
}

function togglePassword(id, btn) {
  var input = document.getElementById(id);
  if (!input) return;
  if (input.type === 'password') { input.type = 'text'; btn.textContent = '🙈'; }
  else { input.type = 'password'; btn.textContent = '👁'; }
}

// ---- SIGNUP ----
function checkPasswordStrength(val) {
  var bar = document.getElementById('passBar');
  var label = document.getElementById('passLabel');
  if (!bar || !label) return;
  var strength = 0;
  if (val.length >= 8) strength++;
  if (/[A-Z]/.test(val)) strength++;
  if (/[0-9]/.test(val)) strength++;
  if (/[^A-Za-z0-9]/.test(val)) strength++;
  var colors = ['#e74c3c', '#e67e22', '#f1c40f', '#27ae60'];
  var labels = ['Weak', 'Fair', 'Good', 'Strong'];
  var widths = ['25%', '50%', '75%', '100%'];
  bar.style.width = val.length ? widths[strength - 1] || '10%' : '0';
  bar.style.background = val.length ? colors[strength - 1] || '#e74c3c' : '';
  label.textContent = val.length ? labels[strength - 1] || 'Weak' : '';
  label.style.color = val.length ? colors[strength - 1] || '#e74c3c' : '';
}

function registerUser() {
  var first = document.getElementById('signFirst') ? document.getElementById('signFirst').value.trim() : '';
  var last = document.getElementById('signLast') ? document.getElementById('signLast').value.trim() : '';
  var email = document.getElementById('signEmail') ? document.getElementById('signEmail').value.trim() : '';
  var pass = document.getElementById('signPass') ? document.getElementById('signPass').value : '';
  var confirm = document.getElementById('signConfirm') ? document.getElementById('signConfirm').value : '';
  var terms = document.getElementById('signTerms') ? document.getElementById('signTerms').checked : false;
  var err = document.getElementById('signError');

  if (!first || !last) { showErr(err, 'Please enter your full name.'); return; }
  if (!email || !email.includes('@')) { showErr(err, 'Please enter a valid email address.'); return; }
  if (pass.length < 8) { showErr(err, 'Password must be at least 8 characters.'); return; }
  if (pass !== confirm) { showErr(err, 'Passwords do not match.'); return; }
  if (!terms) { showErr(err, 'Please agree to the Terms of Service to continue.'); return; }

  if (err) err.classList.add('hidden');
  showToast('Creating your account...');
  setTimeout(function () {
    var form = document.getElementById('signupForm');
    var success = document.getElementById('signupSuccess');
    if (form) form.classList.add('hidden');
    if (success) success.classList.remove('hidden');
  }, 1200);
}

function showErr(el, msg) {
  if (!el) { showToast(msg); return; }
  el.textContent = msg; el.classList.remove('hidden');
}

// ---- TRIP PLANNER ----
var tripData = { destination: '', startDate: '', endDate: '', adults: 2, children: 0, budget: '', interests: [], accommodation: 'hotel', notes: '' };

function nextStep(n) { goStep(n); }

function goStep(n) {
  document.querySelectorAll('.step-panel').forEach(function (p) { p.classList.add('hidden'); });
  document.querySelectorAll('.pstep').forEach(function (t, i) {
    t.classList.remove('active');
    if (i < n) t.classList.add('active');
  });
  var panel = document.getElementById('step-' + n);
  var tab = document.getElementById('step-tab-' + n);
  if (panel) panel.classList.remove('hidden');
  if (tab) tab.classList.add('active');
}

function pickDest(d) {
  var inp = document.getElementById('tripDest');
  if (inp) inp.value = d;
  tripData.destination = d;
}

function changeCount(id, delta) {
  var el = document.getElementById(id);
  if (!el) return;
  var val = parseInt(el.textContent) + delta;
  if (val < 0) val = 0;
  el.textContent = val;
  tripData[id] = val;
}

function toggleInterest(el) { el.classList.toggle('active'); }

function buildItinerary() {
  var dest = document.getElementById('tripDest') ? document.getElementById('tripDest').value.trim() : '';
  var start = document.getElementById('tripStart') ? document.getElementById('tripStart').value : '';
  var end = document.getElementById('tripEnd') ? document.getElementById('tripEnd').value : '';
  if (!dest) { showToast('Please enter a destination!'); goStep(1); return; }
  if (!start || !end) { showToast('Please select travel dates!'); goStep(2); return; }
  tripData.destination = dest;
  tripData.startDate = start;
  tripData.endDate = end;
  tripData.budget = document.getElementById('tripBudget') ? document.getElementById('tripBudget').value : '';

  // Build summary
  var summary = document.getElementById('tripSummary');
  if (summary) {
    summary.innerHTML =
      '<p><strong>Destination:</strong> ' + dest + '</p>' +
      '<p><strong>Dates:</strong> ' + formatDate(start) + ' → ' + formatDate(end) + '</p>' +
      '<p><strong>Travelers:</strong> ' + (tripData.adults || 2) + ' Adults, ' + (tripData.children || 0) + ' Children</p>' +
      '<p><strong>Budget:</strong> ' + tripData.budget + '</p>';
  }

  // Build day-by-day preview
  buildDayPreview(dest, start, end);
  goStep(4);
}

function buildDayPreview(dest, start, end) {
  var panel = document.getElementById('itineraryDays');
  if (!panel) return;
  var s = new Date(start), e = new Date(end);
  var days = Math.max(1, Math.round((e - s) / 86400000) + 1);
  var activities = {
    0: ['🛬 Arrival & Check-in', '🍽️ Welcome dinner at local restaurant', '🚶 Evening stroll in the city centre'],
    1: ['🏛️ Explore major landmarks', '📸 Photography walk', '🍜 Local cuisine lunch', '🛍️ Evening market visit'],
    2: ['🌅 Sunrise hike or beach walk', '🏊 Adventure activity / water sports', '🍦 Dessert café afternoon', '🌙 Night local experience'],
    default: ['🗺️ Day trip to nearby attraction', '🍱 Picnic or outdoor lunch', '🏞️ Nature or cultural site visit', '🌃 Dinner with a view']
  };
  var html = '<div style="margin-top:.5rem">';
  for (var i = 0; i < Math.min(days, 7); i++) {
    var dayDate = new Date(s); dayDate.setDate(s.getDate() + i);
    var acts = activities[i] || activities.default;
    html += '<div class="day-block"><h4>Day ' + (i + 1) + ' — ' + formatDate(dayDate.toISOString().split('T')[0]) + '</h4>';
    acts.forEach(function (a) { html += '<div class="day-activity">' + a + '</div>'; });
    html += '</div>';
  }
  if (days > 7) html += '<p style="color:var(--text-light);font-size:.8rem;text-align:center">+ ' + (days - 7) + ' more days planned</p>';
  html += '</div>';
  panel.innerHTML = html;
  var hint = document.querySelector('.preview-hint');
  if (hint) hint.style.display = 'none';
}

function confirmTrip() {
  showToast('🎉 Your trip to ' + tripData.destination + ' is confirmed!');
  setTimeout(function () { window.location.href = 'destinations.html'; }, 1500);
}

function formatDate(str) {
  if (!str) return '';
  var d = new Date(str + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Navbar always scrolled on inner pages
window.addEventListener('DOMContentLoaded', function () {
  var path = window.location.pathname;
  var isHome = path.endsWith('index.html') || path === '/' || path.endsWith('/');
  if (!isHome) {
    var nb = document.getElementById('navbar');
    if (nb) nb.classList.add('scrolled');
  }
});
