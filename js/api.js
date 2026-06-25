const API_URL = 'https://gsh-backend-production.up.railway.app/api';

// Token management
const getToken = () => localStorage.getItem('parent_token');
const setToken = (token) => localStorage.setItem('parent_token', token);
const removeToken = () => localStorage.removeItem('parent_token');
const getUser = () => JSON.parse(localStorage.getItem('parent_user') || '{}');
const setUser = (user) => localStorage.setItem('parent_user', JSON.stringify(user));

// Check if logged in
const isLoggedIn = () => !!getToken();

// Redirect if not logged in
const requireAuth = () => {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }
};

// Redirect if already logged in
const redirectIfLoggedIn = () => {
  if (isLoggedIn()) {
    window.location.href = 'dashboard.html';
  }
};

// API call helper
const apiCall = async (endpoint, method = 'GET', data = null, auth = true) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (auth && getToken()) {
    headers['Authorization'] = `Bearer ${getToken()}`;
  }

  const options = { method, headers };
  if (data) options.body = JSON.stringify(data);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const json = await response.json();
    return { ok: response.ok, status: response.status, data: json };
  } catch (error) {
    return { ok: false, status: 0, data: { message: 'Erreur de connexion' } };
  }
};

// Show alert
const showAlert = (message, type = 'error', containerId = 'alert') => {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.className = `alert alert-${type}`;
  el.innerHTML = `<span>${type === 'error' ? '⚠️' : '✅'}</span> ${message}`;
  el.style.display = 'flex';
  setTimeout(() => el.style.display = 'none', 5000);
};

// Format date
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR');
};

// Format amount
const formatAmount = (amount) => {
  return `${parseFloat(amount).toFixed(0)} MAD`;
};

// Activity type color
const typeColor = (type) => {
  const colors = {
    'cours de soutien': '#2563EB',
    'atelier ludique': '#10B981',
    'activité sportive': '#F59E0B',
    'cours de langue': '#8B5CF6',
    'cours de musique': '#EC4899',
  };
  return colors[type?.toLowerCase()] || '#64748B';
};

// Activity type emoji
const typeEmoji = (type) => {
  const emojis = {
    'cours de soutien': '📚',
    'atelier ludique': '🎨',
    'activité sportive': '⚽',
    'cours de langue': '🌍',
    'cours de musique': '🎵',
  };
  return emojis[type?.toLowerCase()] || '📋';
};

// Status badge
const statusBadge = (status) => {
  const badges = {
    'active': '<span class="badge badge-success">Actif</span>',
    'pending': '<span class="badge badge-warning">En attente</span>',
    'paid': '<span class="badge badge-success">Payé</span>',
    'cancelled': '<span class="badge" style="background:#FEE2E2;color:#B91C1C">Annulé</span>',
  };
  return badges[status] || `<span class="badge badge-primary">${status}</span>`;
};

// Logout
const logout = () => {
  removeToken();
  localStorage.removeItem('parent_user');
  window.location.href = 'login.html';
};