const mongoose = require('mongoose');
const { MongoMemoryServer } = require("mongodb-memory-server")

async function connect() {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, {dbName: "testPurpose"});
    console.log(`Mongodb successfully connected to ${mongoUri}`);
}

module.exports = connect