const generatePatientId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `PAT${timestamp}${random}`;
};

module.exports = { generatePatientId };