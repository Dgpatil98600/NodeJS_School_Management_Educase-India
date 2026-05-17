export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Validation errors
  if (err.status === 400) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Validation error'
    });
  }

  // Database errors
  if (err.code === 'ER_BAD_FIELD_ERROR' || err.code === 'ER_NO_REFERENCED_TABLE') {
    return res.status(500).json({
      success: false,
      message: 'Database error occurred'
    });
  }

  // internal server error
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

export const validateSchoolData = (req, res, next) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || name.trim() === '') {
    const error = new Error('School name is required');
    error.status = 400;
    return next(error);
  }

  if (!address || address.trim() === '') {
    const error = new Error('School address is required');
    error.status = 400;
    return next(error);
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || lat < -90 || lat > 90) {
    const error = new Error('Latitude must be a valid number between -90 and 90');
    error.status = 400;
    return next(error);
  }

  if (isNaN(lon) || lon < -180 || lon > 180) {
    const error = new Error('Longitude must be a valid number between -180 and 180');
    error.status = 400;
    return next(error);
  }

  next();
};

export const validateLocationParams = (req, res, next) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    const error = new Error('Latitude and longitude are required');
    error.status = 400;
    return next(error);
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || lat < -90 || lat > 90) {
    const error = new Error('Latitude must be a valid number between -90 and 90');
    error.status = 400;
    return next(error);
  }

  if (isNaN(lon) || lon < -180 || lon > 180) {
    const error = new Error('Longitude must be a valid number between -180 and 180');
    error.status = 400;
    return next(error);
  }

  next();
};
