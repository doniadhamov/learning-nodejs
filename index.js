const {createServer} = require('http');
const PersonDao = require('./dao/Persons');

const server = createServer(async (req, res) => {
    let basePathName = req.url.split('/')[1];
    if (basePathName === 'person') {
        switch (req.method) {
            case 'GET':
                const id = req.url.split('/').splice(-1)[0];
                if (id === 'person') {
                    res.end(JSON.stringify(await PersonDao.getList()));
                } else {
                    try {
                        res.end(JSON.stringify(await PersonDao.getById(parseInt(id))));
                    } catch (e) {
                        res.end(JSON.stringify({e}));
                    }
                }
                break;
            case 'POST':
                try {
                    res.setHeader('Content-Type', 'application/json');
                    req.on('data', async (chunk) => {
                        const {name, date_of_birth, address, country, email} = JSON.parse(chunk);
                        res.end(JSON.stringify(await PersonDao.create({name, date_of_birth, address, country, email})));
                    });
                } catch (e) {
                    return e;
                }
                break;
            case 'PUT':
                try {
                    res.setHeader('Content-Type', 'application/json');
                    req.on('data', async (chunk) => {
                        const {id, name, date_of_birth, address, country, email} = JSON.parse(chunk);
                        res.end(JSON.stringify(await PersonDao.create({id, name, date_of_birth, address, country, email})));
                    });
                } catch (e) {
                    return e;
                }

                break;
            case 'DELETE':
                try {
                    const id = req.url.split('/').splice(-1)[0];
                    if (id === 'person') {
                        //TO DO: in future may delete all datas in table
                    } else {
                        res.end(JSON.stringify(await PersonDao.delete(parseInt(id))));
                    }
                } catch (e) {
                    return e;
                }
                break;
        }
    } else {
        return "Your API url is incorrect!"
    }
});

server.listen(3000);
console.log(`Server is run on port 3000`);