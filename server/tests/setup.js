const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

jest.setTimeout(120000);

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, {
        runtimeAdapters: {
            os: require("os")
        }
    });
}, 120000);

afterAll(async () => {
    try {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.dropDatabase();
            await mongoose.disconnect();
        }

        if (mongoServer) {
            await mongoServer.stop();
        }
    } catch (error) {
        console.error("Test database cleanup failed:", error.message);
        throw error;
    }
}, 120000);