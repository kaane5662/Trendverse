const dotenv = require("dotenv")
dotenv.config()

const Redis = require("redis")
const redisClient = Redis.createClient({
    socket: {
      host: process.env.REDIS_URL, 
      port: 6379         
    }
  })
console.log(redisClient)
// const revalidation = 3000
console.log("Hello from Redis")
// Handle Redis client errors
// Connect to Redis
redisClient.connect().catch(console.error);

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});
  
  // Test the Redis connection
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('end', () => {
    console.log('Redis client closed');
});
  
  

const getOrSetCache = (key, cb, revalidate)=>{
    return new Promise((resolve, reject)=>{
        console.log(revalidate)
        redisClient.get(key, async(error, data)=>{
            console.log("firogeroigoierio")
            if(error) return reject(error)
            if(data != null) return resolve(JSON.parse(data))
            const freshData = await cb()
            redisClient.setEx(key, revalidate, JSON.stringify(freshData))
            resolve(freshData)
        })
    })
}

module.exports = {getOrSetCache, redisClient}