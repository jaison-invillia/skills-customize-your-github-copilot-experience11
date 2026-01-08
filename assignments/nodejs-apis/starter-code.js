/**
 * Starter code for NodeJS REST API assignment
 * This template provides a basic structure to get you started.
 */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// Middlewares
// ============================================================================

// Parse JSON bodies
app.use(express.json());

// CORS middleware
// Note: Using '*' for educational purposes to allow testing from any origin
// In production, specify allowed origins explicitly
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Logging middleware
const loggerMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
};

app.use(loggerMiddleware);

// Content-Type validation middleware for POST/PUT requests
const validateContentType = (req, res, next) => {
    if (['POST', 'PUT'].includes(req.method)) {
        const contentType = req.headers['content-type'];
        if (!contentType || !contentType.includes('application/json')) {
            return res.status(400).json({
                error: 'Content-Type must be application/json'
            });
        }
    }
    next();
};

app.use(validateContentType);

// ============================================================================
// In-memory storage
// ============================================================================

let users = [];
let userIdCounter = 1;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Find user by ID
 */
function findUserById(id) {
    return users.find(user => user.id === parseInt(id));
}

/**
 * Validate user data
 * Note: This uses simple validation for educational purposes.
 * In production, use a validation library like Joi or express-validator.
 */
function validateUser(data) {
    const errors = [];
    
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
        errors.push('Name is required and must be a non-empty string');
    }
    
    // Simple email validation for learning purposes
    // In production, use a proper email validation library
    if (!data.email || typeof data.email !== 'string' || !data.email.includes('@')) {
        errors.push('Valid email is required');
    }
    
    if (data.age === undefined || typeof data.age !== 'number' || data.age < 0) {
        errors.push('Age is required and must be a positive number');
    }
    
    return errors;
}

/**
 * Filter users based on query parameters
 */
function filterUsers(query) {
    let filtered = [...users];
    
    if (query.name) {
        filtered = filtered.filter(user => 
            user.name.toLowerCase().includes(query.name.toLowerCase())
        );
    }
    
    if (query.age_min) {
        const minAge = parseInt(query.age_min);
        if (!isNaN(minAge)) {
            filtered = filtered.filter(user => user.age >= minAge);
        }
    }
    
    if (query.age_max) {
        const maxAge = parseInt(query.age_max);
        if (!isNaN(maxAge)) {
            filtered = filtered.filter(user => user.age <= maxAge);
        }
    }
    
    return filtered;
}

/**
 * Paginate results
 */
function paginateResults(data, page = 1, limit = 10) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const results = {
        data: data.slice(startIndex, endIndex),
        pagination: {
            total: data.length,
            page: page,
            limit: limit,
            totalPages: Math.ceil(data.length / limit)
        }
    };
    
    return results;
}

// ============================================================================
// Routes
// ============================================================================

/**
 * GET / - Health check
 */
app.get('/', (req, res) => {
    res.json({
        message: 'User Management API is running!',
        status: 'ok',
        endpoints: {
            'GET /users': 'List all users (with filters and pagination)',
            'GET /users/:id': 'Get user by ID',
            'POST /users': 'Create new user',
            'PUT /users/:id': 'Update user',
            'DELETE /users/:id': 'Delete user'
        }
    });
});

/**
 * GET /users - Get all users with filters and pagination
 * Query params: name, age_min, age_max, page, limit
 */
app.get('/users', (req, res) => {
    try {
        // Apply filters
        let filtered = filterUsers(req.query);
        
        // Apply pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        if (page < 1 || limit < 1) {
            return res.status(400).json({
                error: 'Page and limit must be positive numbers'
            });
        }
        
        const result = paginateResults(filtered, page, limit);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /users/:id - Get user by ID
 */
app.get('/users/:id', (req, res) => {
    const user = findUserById(req.params.id);
    
    if (!user) {
        return res.status(404).json({
            error: 'User not found'
        });
    }
    
    res.json(user);
});

/**
 * POST /users - Create new user
 * Body: { name, email, age }
 */
app.post('/users', (req, res) => {
    const errors = validateUser(req.body);
    
    if (errors.length > 0) {
        return res.status(400).json({
            errors: errors
        });
    }
    
    const newUser = {
        id: userIdCounter++,
        name: req.body.name.trim(),
        email: req.body.email.trim(),
        age: req.body.age,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    res.status(201).json(newUser);
});

/**
 * PUT /users/:id - Update user
 * Body: { name?, email?, age? }
 */
app.put('/users/:id', (req, res) => {
    const user = findUserById(req.params.id);
    
    if (!user) {
        return res.status(404).json({
            error: 'User not found'
        });
    }
    
    // Validate updated data
    const updatedData = { ...user, ...req.body };
    const errors = validateUser(updatedData);
    
    if (errors.length > 0) {
        return res.status(400).json({
            errors: errors
        });
    }
    
    // Update user
    if (req.body.name) user.name = req.body.name.trim();
    if (req.body.email) user.email = req.body.email.trim();
    if (req.body.age !== undefined) user.age = req.body.age;
    user.updatedAt = new Date().toISOString();
    
    res.json(user);
});

/**
 * DELETE /users/:id - Delete user
 */
app.delete('/users/:id', (req, res) => {
    const userIndex = users.findIndex(user => user.id === parseInt(req.params.id));
    
    if (userIndex === -1) {
        return res.status(404).json({
            error: 'User not found'
        });
    }
    
    users.splice(userIndex, 1);
    res.status(204).send();
});

// ============================================================================
// 404 handler - Route not found (must be before error handler)
// ============================================================================

app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});

// ============================================================================
// Error handling middleware (must be last)
// ============================================================================

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

// ============================================================================
// Start server
// ============================================================================

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Try visiting http://localhost:${PORT} to see available endpoints`);
});

// ============================================================================
// To run this app:
// 1. Make sure you have Node.js installed
// 2. Install Express: npm install express
// 3. Run: node starter-code.js
// 4. Test the API using curl, Postman, or your browser
// ============================================================================
