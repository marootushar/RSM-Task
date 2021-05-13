const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            'mongodb://tushar123:tushar123@cluster0-shard-00-00.colhz.mongodb.net:27017,cluster0-shard-00-01.colhz.mongodb.net:27017,cluster0-shard-00-02.colhz.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-ao3j52-shard-0&authSource=admin&retryWrites=true&w=majority',
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true,
            }
        );
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
