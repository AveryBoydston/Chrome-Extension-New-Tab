// Need:
// Input validation on the backend for all endpoints.
// HTTPS for all communication.
// Rate limiting to prevent abuse.
// Consider using JWT or session tokens for authentication after sign-in.
// Proper database security practices.
//For a Chrome extension, you might need to configure CORS more precisely to only allow requests from your extension's origin. During development, app.use(cors()); is often sufficient to get started, but for production, be more restrictive.

// server.js
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const port = 3306;

app.use(cors()); // Enable CORS for your Chrome extension's origin (you might need to configure this more specifically later)
app.use(express.json()); // To parse JSON request bodies

// MySQL database connection configuration
const db = mysql.createConnection({
    host: 'btvk3a0qoum8oseub1ui-mysql.services.clever-cloud.com',
    user: 'usnswxrnluysprgq',
    password: 'n1bb9x0BTOcgVN3buk9s',
    database: 'btvk3a0qoum8oseub1ui'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// --- API Endpoints ---

// 1. Signup Endpoint (Corrected to use insertId)
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password

        db.query('SELECT email FROM users WHERE email = ?', [email], (err, results) => {
            if (err) {
                console.error('MySQL query error:', err);
                return res.status(500).json({ message: 'Database error during signup.' });
            }
            if (results.length > 0) {
                return res.status(409).json({ message: 'Email already registered.' }); // 409 Conflict
            } else {
                // Corrected INSERT query to get insertId from callback results
                db.query('INSERT INTO users (email, hashedPassword) VALUES (?, ?)', [email, hashedPassword], (insertErr, insertResults) => {
                    if (insertErr) {
                        console.error('MySQL insert error:', insertErr);
                        return res.status(500).json({ message: 'Error creating account.' });
                    }

                    const userId = insertResults.insertId; // Access insertId directly from results

                    return res.status(201).json({ message: 'Account created successfully!', userId: userId }); // 201 Created, include userId
                });
            }
        });
    } catch (error) {
        console.error('Bcrypt hashing error:', error);
        return res.status(500).json({ message: 'Error during password hashing.' });
    }
});
// 2. Signin Endpoint
app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    db.query('SELECT id, hashedPassword FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('MySQL query error:', err);
            return res.status(500).json({ message: 'Database error during signin.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Email not registered.' }); // 404 Not Found
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

        if (passwordMatch) {
            // Sign-in successful
            // You might want to generate a session token or JWT here for more secure authentication in real applications
            return res.status(200).json({ message: 'Sign in successful!', userId: user.id });
        } else {
            return res.status(401).json({ message: 'Incorrect password.' }); // 401 Unauthorized
        }
    });
});

// 3. Save Settings Endpoint
app.post('/settings/save', async (req, res) => {
    const { userId, widgetPositions, tasks } = req.body; // Expecting widgetPositions and tasks in request body

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required to save settings.' });
    }

    const widgetPositionsJson = JSON.stringify(widgetPositions);
    const tasksJson = JSON.stringify(tasks);

    db.query(
        `INSERT INTO user_settings (userId, widgetPositionsJson, tasksJson) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE widgetPositionsJson = VALUES(widgetPositionsJson), tasksJson = VALUES(tasksJson)`, // ON DUPLICATE KEY UPDATE clause
        [userId, widgetPositionsJson, tasksJson],
        (err, results) => {
            if (err) {
                console.error('MySQL settings save error:', err);
                return res.status(500).json({ message: 'Error saving settings.' });
            }
            return res.status(200).json({ message: 'Settings saved successfully!' });
        }
    );
});

// 4. Retrieve Settings Endpoint
app.get('/settings/retrieve/:userId', (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required to retrieve settings.' });
    }

    db.query('SELECT widgetPositionsJson, tasksJson FROM user_settings WHERE userId = ?', [userId], (err, results) => {
        if (err) {
            console.error('MySQL settings retrieve error:', err);
            return res.status(500).json({ message: 'Error retrieving settings.' });
        }

        if (results.length > 0) {
            const settingsData = results[0]; // Get the first (and should be only) result
            const widgetPositions = JSON.parse(settingsData.widgetPositionsJson || null); // Parse JSON, handle null if empty
            const tasks = JSON.parse(settingsData.tasksJson || null); // Parse JSON, handle null if empty
            return res.status(200).json({ widgetPositions: widgetPositions, tasks: tasks }); // Return widgetPositions and tasks
        } else {
            return res.status(404).json({ message: 'Settings not found for this user.', widgetPositions: null, tasks: null }); // Or return default null or empty objects
        }
    });
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});