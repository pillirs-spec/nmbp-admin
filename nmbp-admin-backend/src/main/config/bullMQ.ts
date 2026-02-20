import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { envUtils } from "ts-commons"


const tlsEnabled = envUtils.getBooleanEnvVariableOrDefault("INIT_COMMON_REDIS_TLS", false);
const userName = envUtils.getStringEnvVariable("INIT_COMMON_REDIS_USER");
const password = envUtils.getStringEnvVariable("INIT_COMMON_REDIS_PASSWORD");
const host = envUtils.getStringEnvVariableOrDefault("INIT_COMMON_REDIS_HOST", "localhost");
const port = envUtils.getNumberEnvVariableOrDefault("INIT_COMMON_REDIS_PORT", 6379);


let baseConnectionURI = tlsEnabled ? "rediss://" : "redis://";

if (userName && password) {
    baseConnectionURI += `${userName}:${password}@`;
}

export const connection = new Redis({
    host: host || 'localhost',
    port: port || '6379',
    username: userName || undefined,
    password: password || undefined,
    tls: tlsEnabled ? {} : undefined,
    maxRetriesPerRequest: null,
});

export const notificationQueue = new Queue('notifications', {
    connection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false,
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000
        }
    }
});