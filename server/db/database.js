import mysql from 'mysql2/promise';
import fs from 'fs';

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'gateway01.us-west-2.prod.aws.tidbcloud.com',
    user: process.env.DB_USER || '2qdqQEoKpGhcfAY.root',
    password: process.env.DB_PASSWORD || 'GTQuf1Kyry66KnlJ',
    database: 'dz_tabib_final',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    uri: process.env.DB_URI || '',
    ssl: {
        ca: fs.readFileSync('./certs/isrgrootx1.pem'), // Path to your CA certificate
      }
    
});


export default pool;