const http = require('http');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter path to template file: ', (templatePath) => {
    rl.question('Enter path to data file: ', (dataPath) => {
        rl.close();
        fs.readFile(templatePath, 'utf8', (err, template) => {
            if (err) {
                console.error(`Error reading template file: ${err.message}`);
                process.exit(1);
            }
            fs.readFile(dataPath, 'utf8', (err, data) => {
                if (err) {
                    console.error(`Error reading data file: ${err.message}`);
                    process.exit(1);
                }
                startServer(template, JSON.parse(data));
            });
        });
    });
});

function startServer(template, data) {
    const server = http.createServer((req, res) => {
        if (req.url === '/' && req.method === 'GET') {
            res.setHeader('Content-Type', 'text/html');
            res.statusCode = 200;

            Object.entries(data).forEach(([key, value]) => {
                template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
            });
            res.end(template);
        } else {
            res.statusCode = 404;
            res.end('Not found');
        }
    });

    server.listen(3000, () => {
        console.log('Server running at http://localhost:3000/');
    });
}
