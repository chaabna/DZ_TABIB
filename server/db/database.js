import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'dz_tabib_medical_directory',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    uri: process.env.DB_URI || ''
});

export default pool;