const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'zentra-dev-secret-change-in-production';
const JWT_EXPIRY = '7d';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

/**
 * Middleware: extract and verify Bearer token from request headers.
 * Returns the decoded payload or null.
 */
function getAuthUser(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  return verifyToken(token);
}

/**
 * Standard CORS + JSON response helper
 */
function respond(context, status, body) {
  context.res = {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
    body: JSON.stringify(body)
  };
}

/**
 * Handle OPTIONS preflight
 */
function handleOptions(context) {
  context.res = {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
    body: ''
  };
  return true;
}

module.exports = { signToken, verifyToken, getAuthUser, respond, handleOptions };
