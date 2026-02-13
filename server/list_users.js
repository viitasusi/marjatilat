import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
    try {
        const db = await open({
            filename: path.join(__dirname, 'database.sqlite'),
            driver: sqlite3.Database
        });

        const users = await db.all('SELECT id, email, role, status FROM users');
        console.log('Current Users:');
        if (users.length === 0) {
            console.log("No users found.");
        } else {
            console.table(users);
        }

    } catch (error) {
        console.error('Error reading users:', error);
    }
})();
