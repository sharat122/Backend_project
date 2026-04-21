const http = require('http');
const fs = require('fs/promises');
const url = require('url');

const PORT = 3000;

async function readData() {
    return await fs.readFile('data.txt', 'utf-8');
}


async function writeData(data) {
    await fs.writeFile('data.txt', data);
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const query = parsedUrl.query;

    res.writeHead(200, { 'Content-Type': 'text/html' });

    // Home route 
    if (path === '/') {
        const data = await readData();
        res.write(`
            <h2>Data from file</h2>
            <pre>${data}</pre>
            <hr>
            <p>
                /add?data=Hello <br>
                /update?old=Hello&new=Hi <br>
                /delete?data=Hi
            </p>
        `);
        res.end()
    }

    // add route
    else if (path === '/add') {
        const oldData = await readData();
        const newData = oldData + '\n' + query.data;
        await writeData(newData);
        res.write('Data Added');
        res.end();
    }

    // Update route
    else if (path === '/update') {
        const data = await readData();
        const updated = data.replace(query.old, query.new);
        await writeData(updated);
        res.write('Data Updated')
        res.end();
    }

    // Delete route
    else if (path === '/delete') {
        const data = await readData();
        const filtered = data
            .split('\n')
            .filter(line => line.trim().toLowerCase() !== query.data.trim().toLowerCase())
            .join('\n');

        await writeData(filtered);
        res.write('Data Deleted');
        res.end();
    }

    // a default route
    else {
        res.write('Route not found');
        res.end();
    }
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
