// Small helper so every controller returns the same envelope shape:
// { success, value, error, statusCode }  (mirrors CustomApiResponse)

const success = (value, statusCode = 200) => ({
  success: true,
  value,
  error: null,
  statusCode,
});

const fail = (error, statusCode = 400) => ({
  success: false,
  value: null,
  error: typeof error === "string" ? error : error.message,
  statusCode,
});

module.exports = { success, fail };
