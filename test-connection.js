// scripts/test-connection.js
import http from 'http';

const options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/status',
    method: 'GET',
};

const req = http.request(options, (res) => {
    console.log(`StatusCode: ${res.statusCode}`);

    res.on('data', (d) => {
        process.stdout.write(d);
        console.log('\n\n✅ Backend connection SUCCESSFUL!');
    });
});

req.on('error', (error) => {
    console.error(`❌ Backend connection FAILED: ${error.message}`);
    process.exit(1);
});

req.end();
