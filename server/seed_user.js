import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
    try {
        const db = await open({
            filename: path.join(__dirname, 'database.sqlite'), // Correct path to DB
            driver: sqlite3.Database
        });

        const email = 'testuser@example.com';
        const rawPassword = 'password123';
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        // Check if exists
        const existing = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (existing) {
            console.log('User already exists:', existing.email);
            return; // Don't insert again
        }

        await db.run(
            'INSERT INTO users (email, password_hash, name, role, status) VALUES (?, ?, ?, ?, ?)',
            [email, hashedPassword, 'Test User', 'user', 'pending_approval']
        );

        console.log(`User created: ${email} (Password: ${rawPassword})`);
        console.log('Role: user, Status: pending_approval');

    } catch (error) {
        console.error('Error seeding user:', error);
    }
})();
