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
  } else {
    document.getElementById('main-nav').style.display = 'none';
    document.getElementById('auth-section').style.display = 'block';
  }
}

document.getElementById('auth-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;

  if (document.getElementById('auth-header').textContent === 'Sign Up') {
    // Sign Up
    if (users[email]) {
      document.getElementById('auth-status').innerText = 'User already exists.';
    } else {
      users[email] = { password, events: 0, hours: 0, preferences: {}, badges: [] };
      localStorage.setItem("users", JSON.stringify(users));
      document.getElementById('auth-status').innerText = 'User registered! You can now sign in.';
      document.getElementById('auth-switch-back').style.display = 'block';  // Show the link to sign-in page
    }
  } else {
    // Sign In
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
  document.getElementById('auth-switch').style.display = 'none';
  document.getElementById('auth-switch-back').style.display = 'none'; // Hide the back link initially
});

document.getElementById('auth-switch-back').addEventListener('click', function () {
  document.getElementById('auth-header').textContent = 'Sign In';
  document.getElementById('auth-btn').textContent = 'Sign In';
  document.getElementById('auth-switch').style.display = 'block';
  document.getElementById('auth-status').innerText = '';
  document.getElementById('auth-switch-back').style.display = 'none'; // Hide the back link after clicking
});

document.getElementById('logout-link').addEventListener('click', function () {
  currentUser = null;
  localStorage.removeItem("currentUser");
  updateUI();
});

document.getElementById('save-preferences-btn').addEventListener('click', function () {
  const reminders = document.getElementById('reminders').checked;
  const rewards = document.getElementById('rewards-updates').checked;
  currentUser.preferences = { reminders, rewards };
  users[currentUser.email] = currentUser;
  localStorage.setItem("users", JSON.stringify(users));
  document.getElementById('preferences-status').innerText = 'Preferences saved!';
});

function updateVolunteerStats() {
  document.getElementById('events-count').innerText = currentUser.events;
  document.getElementById('hours-volunteered').innerText = currentUser.hours;
}

document.getElementById('signup-btn').addEventListener('click', function () {
  currentUser.events += 1;
  currentUser.hours += 2; // Assume each event is 2 hours
  users[currentUser.email] = currentUser;
  localStorage.setItem("users", JSON.stringify(users));
  document.getElementById('signup-status').innerText = 'You signed up for an event!';
  updateVolunteerStats();
});

document.getElementById('referral-link').addEventListener('click', function (e) {
  e.preventDefault();
  alert('Invite your friends with this link: https://parkpatrol.com/invite?ref=' + currentUser.email);
});

updateUI();
if (currentUser) updateVolunteerStats();
