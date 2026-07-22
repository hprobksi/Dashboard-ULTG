// server/fileMutex.js

class FileMutex {
  constructor() {
    this.queue = Promise.resolve();
  }

  async runExclusive(task) {
    let release;
    const lock = new Promise(resolve => { release = resolve; });
    const previous = this.queue;
    this.queue = this.queue.then(() => lock);

    try {
      await previous;
      return await task();
    } finally {
      release();
    }
  }
}

// Global dictionary of locks per file path
const fileMutexes = new Map();

export function getFileMutex(filePath) {
  if (!fileMutexes.has(filePath)) {
    fileMutexes.set(filePath, new FileMutex());
  }
  return fileMutexes.get(filePath);
}
