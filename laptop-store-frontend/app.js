// app.js

// Handle Signup
document.getElementById('signupForm')?.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;

    const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        alert('Signup successful! You can now log in.');
        window.location.href = 'login.html'; // Redirect to login page
    } else {
        const error = await response.json();
        alert(`Signup failed: ${error.error}`);
    }
});

// Handle Login
document.getElementById('loginForm')?.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        alert('Login successful!');
        localStorage.setItem('token', data.token); // Store the token for further API calls
        window.location.href = 'index.html'; // Redirect to the homepage or dashboard
    } else {
        const error = await response.json();
        alert(`Login failed: ${error.error}`);
    }
});