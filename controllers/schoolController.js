import pool from '../config/db.js';
import { calculateDistance } from '../utils/distance.js';

export const addSchool = async (req, res, next) => {
  try {
    const { name, address, latitude, longitude } = req.body;
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    const connection = await pool.getConnection();
    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    const [result] = await connection.execute(query, [name, address, lat, lon]);
    connection.release();

    if(res.statusCode === 201) {
      res.school = {
        id: result.insertId,
        name,
        address,
        latitude: lat,
        longitude: lon
      };
      console.log('Added school:', res.school);
    } else {
      console.warn('School Not added', res.statusCode);
    }

    res.status(201).json({
      success: true,
      message: 'School added successfully',
      id: result.insertId
    });
  } catch (error) {
    next(error);
  }
};

export const listSchools = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    const connection = await pool.getConnection();
    const query = 'SELECT * FROM schools';
    const [schools] = await connection.execute(query);
    connection.release();

    const schoolsWithDistance = schools.map(school => ({
      ...school,
      distance: `${calculateDistance(userLat, userLon, school.latitude, school.longitude)} km`
    }));

    if(schoolsWithDistance.length == 0) {
      console.warn('No schools found, add schools');
      res.status(404).json({
        success: false,
        message: 'No schools found'
      });
      return;
    } else {
      console.log(`Found ${schoolsWithDistance.length} schools`);
      console.table(schoolsWithDistance);
    }

    schoolsWithDistance.sort((a, b) => {
      const distA = parseFloat(a.distance);
      const distB = parseFloat(b.distance);
      return distA - distB;
    });

    res.status(200).json(schoolsWithDistance);
  } catch (error) {
    next(error);
  }
};
