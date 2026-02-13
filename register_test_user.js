// Script to register a test user
// Run with: node register_test_user.js

const registerUser = async () => {
    try {
        const response = await fetch('http://127.0.0.1:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'testuser@example.com',
                password: 'password123',
                name: 'Test User (Pending)'
            }),
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', data);
    } catch (error) {
        console.error('Error registering user:', error.message);
        console.error('Make sure the server is running on port 3000!');
    }
};

registerUser();
