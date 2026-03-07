// Un logger simple para la consistencia
class Logger {
    info(message: string, ...args: any[]) {
        console.log(`[INFO] ${message}`, ...args);
    }

    warn(message: string, ...args: any[]) {
        console.warn(`[WARN] ${message}`, ...args);
    }

    error(message: string, ...args: any[]) {
        console.error(`[ERROR] ${message}`, ...args);
    }
}

export const logger = new Logger();
