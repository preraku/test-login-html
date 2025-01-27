// API endpoints
const API_BASE_URL = "http://localhost:8787";
const ENDPOINTS = {
  login: `${API_BASE_URL}/auth/login`,
  signup: `${API_BASE_URL}/auth/signup`,
  movies: `${API_BASE_URL}/api/v1/movies`,
};

// Helper functions
const updateResponseMessage = (message) => {
  document.getElementById("responseMessage").textContent =
    typeof message === "string" ? message : JSON.stringify(message);
};

const makeApiRequest = async (url, options) => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options.auth && {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }),
      },
      ...options,
    });
    const data = await response.json();
    updateResponseMessage(data);
    return data;
  } catch (error) {
    updateResponseMessage(`Error: ${error.message}`);
    throw error;
  }
};

// Event handlers
const handleLogin = async (e) => {
  e.preventDefault();
  const formData = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };

  const data = await makeApiRequest(ENDPOINTS.login, {
    method: "POST",
    body: JSON.stringify(formData),
  });

  if (data.token) {
    localStorage.setItem("token", data.token);
    console.log("Token stored:", data.token);
  }
};

const handleSignup = async () => {
  const formData = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };

  const data = await makeApiRequest(ENDPOINTS.signup, {
    method: "POST",
    body: JSON.stringify(formData),
  });

  if (data.token) {
    localStorage.setItem("token", data.token);
  }
};

const handleGetMovies = async () => {
  await makeApiRequest(ENDPOINTS.movies, {
    method: "GET",
    auth: true,
  });
};

const handleAddMovie = async () => {
  const movieData = {
    movies: [
      {
        title: document.getElementById("movieTitle").value,
        year: parseInt(document.getElementById("movieYear").value),
      },
    ],
  };

  await makeApiRequest(ENDPOINTS.movies, {
    method: "POST",
    auth: true,
    body: JSON.stringify(movieData),
  });
};

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  document
    .getElementById("signupButton")
    .addEventListener("click", handleSignup);
  document
    .getElementById("getMoviesButton")
    .addEventListener("click", handleGetMovies);
  document
    .getElementById("addMovieButton")
    .addEventListener("click", handleAddMovie);
});
