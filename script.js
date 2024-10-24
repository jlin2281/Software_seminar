let users = JSON.parse(localStorage.getItem("users")) || {};
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener('click', function (e) {
    document.querySelectorAll("section").forEach(section => section.style.display = 'none');
    const sectionID = this.getAttribute("href").substring(1);
    document.getElementById(sectionID).style.display = 'block';
  });
});

function updateUI() {
  if (currentUser) {
    document.getElementById('main-nav').style.display = 'block';
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('home').style.display = 'block'; // Automatically show the homepage after login
  } else {
    document.getElementById('main-nav').style.display = 'none';
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('home').style.display = 'none'; // Hide the homepage if logged out
  }
}

document.getElementById('auth-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;

  if (document.getElementById('auth-header').textContent === 'Sign Up') {
    // Sign Up logic
    if (users[email]) {
      document.getElementById('auth-status').innerText = 'User already exists.';
    } else {
      users[email] = { password, events: 0, hours: 0, preferences: {}, badges: [] };
      localStorage.setItem("users", JSON.stringify(users));
      document.getElementById('auth-status').innerText = 'User registered! You can now sign in.';
      document.getElementById('auth-switch-back').style.display = 'block';  // Show the link to sign-in page
    }
  } else {
    // Sign In logic
    if (users[email] && users[email].password === password) {
      currentUser = { email, ...users[email] };
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      updateUI();
    } else {
      document.getElementById('auth-status').innerText = 'Invalid credentials.';
    }
  }
});

document.getElementById('switch-to-signup').addEventListener('click', function () {
  document.getElementById('auth-header').textContent = 'Sign Up';
  document.getElementById('auth-btn').textContent = 'Sign Up';
  document.getElementById('auth-switch-back').style.display = 'block';
});

document.getElementById('auth-switch-back').addEventListener('click', function () {
  document.getElementById('auth-header').textContent = 'Sign In';
  document.getElementById('auth-btn').textContent = 'Sign In';
  document.getElementById('auth-switch-back').style.display = 'none';
});

function updateVolunteerStats() {
  document.getElementById('events-count').innerText = currentUser.events;
  document.getElementById('hours-volunteered').innerText = currentUser.hours;
  // Update stats on homepage too
  document.getElementById('home-events-count').innerText = currentUser.events;
  document.getElementById('home-hours-volunteered').innerText = currentUser.hours;
}

document.getElementById('logout-link').addEventListener('click', function () {
  currentUser = null;
  localStorage.removeItem("currentUser");
  updateUI();
});

document.getElementById('view-events-btn').addEventListener('click', function () {
  document.getElementById('events').style.display = 'block';
  document.getElementById('home').style.display = 'none';
});

document.getElementById('view-leaderboard-btn').addEventListener('click', function () {
  document.getElementById('leaderboard').style.display = 'block';
  document.getElementById('home').style.display = 'none';
});

document.getElementById('invite-link').addEventListener('click', function (e) {
  e.preventDefault();
  alert('Invite your friends with this link: https://parkpatrol.com/invite?ref=' + currentUser.email);
});

updateUI();
if (currentUser) {
  updateVolunteerStats();
  document.getElementById('home').style.display = 'block'; // Automatically show the homepage after login
}
