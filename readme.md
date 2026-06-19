📁 Easy File Reader

A powerful, developer-friendly Node.js module for seamless file operations with both synchronous and asynchronous support.

https://img.shields.io/npm/v/easy-file-reader.svg
https://img.shields.io/npm/dm/easy-file-reader.svg
https://img.shields.io/node/v/easy-file-reader.svg
https://img.shields.io/badge/License-MIT-yellow.svg

✨ Features

· 🚀 Simple & Intuitive API - Easy to learn and use
· 📖 Multiple Reading Methods - Sync, Async, Stream, and Line-by-Line
· ✍️ Complete File Operations - Read, Write, Append, Copy, Move, Delete
· 📂 Directory Management - Create, list, and manage directories
· 🔄 Stream Support - Handle large files efficiently
· 👁️ File Watching - Monitor file changes in real-time
· 🛡️ Robust Error Handling - Descriptive error messages
· 🎯 Promise-based - Modern async/await support
· 🔧 Flexible Options - Custom encoding, permissions, and more
· 📦 Zero Dependencies - Uses only Node.js built-in modules

📦 Installation

```bash
npm install easy-file-reader
```

or

```bash
yarn add easy-file-reader
```

🚀 Quick Start

```javascript
const { read, write, readLines, watch } = require('easy-file-reader');

// Async/Await - Modern approach
async function example() {
  try {
    // Read a file
    const content = await read('example.txt');
    console.log(content);
    
    // Write a file
    await write('output.txt', 'Hello World!');
    
    // Read lines
    await readLines('log.txt', (line, num) => {
      console.log(`Line ${num}: ${line}`);
    });
    
    // Watch for changes
    const watcher = watch('config.json', (event, filename) => {
      console.log(`${filename} changed!`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

📚 API Reference

Reading Files

read(filePath, encoding = 'utf8')

Asynchronously reads a file and returns its content.

```javascript
const content = await read('data.txt');
const buffer = await read('image.png', null); // Returns Buffer
```

readSync(filePath, encoding = 'utf8')

Synchronously reads a file.

```javascript
const content = readSync('data.txt');
```

readStream(filePath, options = {})

Reads a file as a stream, perfect for large files.

```javascript
const content = await readStream('large-file.log', {
  encoding: 'utf8',
  highWaterMark: 1024 * 1024, // 1MB chunks
  onChunk: (chunk) => console.log('Received chunk:', chunk.length)
});
```

readLines(filePath, lineHandler, encoding = 'utf8')

Reads a file line by line with a callback.

```javascript
const lineCount = await readLines('data.csv', (line, number) => {
  const [name, email] = line.split(',');
  console.log(`User ${number}: ${name} - ${email}`);
});
```

Writing Files

write(filePath, data, options = {})

Asynchronously writes data to a file.

```javascript
await write('output.txt', 'Hello World', {
  encoding: 'utf8',
  mode: 0o644 // File permissions
});
```

writeSync(filePath, data, options = {})

Synchronously writes data to a file.

```javascript
writeSync('output.txt', 'Hello World');
```

append(filePath, data, encoding = 'utf8')

Appends data to an existing file.

```javascript
await append('log.txt', 'New log entry\n');
```

File Operations

copy(source, destination)

Copies a file from source to destination.

```javascript
await copy('source.txt', 'backup.txt');
```

move(source, destination)

Moves or renames a file.

```javascript
await move('old-name.txt', 'new-name.txt');
```

delete(filePath)

Deletes a file.

```javascript
await delete('temp-file.txt');
```

exists(filePath)

Checks if a file exists (async).

```javascript
if (await exists('config.json')) {
  // File exists
}
```

existsSync(filePath)

Synchronously checks if a file exists.

```javascript
if (existsSync('config.json')) {
  // File exists
}
```

stats(filePath)

Gets file statistics.

```javascript
const stats = await stats('file.txt');
console.log(`Size: ${stats.size} bytes`);
console.log(`Modified: ${stats.mtime}`);
```

Directory Operations

createDirectory(dirPath)

Creates a directory (recursively).

```javascript
await createDirectory('project/src/components');
```

listDirectory(dirPath, options = {})

Lists directory contents.

```javascript
const files = await listDirectory('project');
console.log(files);

// With file types
const entries = await listDirectory('project', { withFileTypes: true });
entries.forEach(entry => {
  console.log(`${entry.name} (${entry.isDirectory() ? 'dir' : 'file'})`);
});
```

File Watching

watch(filePath, callback, options = {})

Watches a file for changes and executes callback.

```javascript
const watcher = watch('config.json', (event, filename) => {
  console.log(`${filename} changed!`);
  // Reload configuration
}, { persistent: true });

// Stop watching
watcher.close();
```

Legacy Support

For backward compatibility with your original API:

```javascript
const { ReadFile, ReadStream } = require('easy-file-reader');

// Sync read
const content = ReadFile('file.txt');

// Stream read (returns string)
ReadStream('file.txt').then(content => console.log(content));
```

💡 Advanced Examples

Processing Large CSV Files

```javascript
const { readLines } = require('easy-file-reader');

async function processLargeCSV() {
  let total = 0;
  await readLines('large-dataset.csv', (line, num) => {
    // Skip header
    if (num === 1) return;
    
    const [id, name, value] = line.split(',');
    total += parseFloat(value);
    
    if (num % 1000 === 0) {
      console.log(`Processed ${num} rows...`);
    }
  });
  console.log(`Total: ${total}`);
}
```

Config File with Watching

```javascript
const { read, watch } = require('easy-file-reader');

class ConfigManager {
  constructor(configPath) {
    this.configPath = configPath;
    this.config = null;
    this.watcher = null;
    this.listeners = [];
  }
  
  async load() {
    try {
      const data = await read(this.configPath);
      this.config = JSON.parse(data);
      this.notifyListeners();
      return this.config;
    } catch (error) {
      console.error('Failed to load config:', error.message);
    }
  }
  
  watch(autoReload = true) {
    this.watcher = watch(this.configPath, async () => {
      if (autoReload) {
        console.log('Config changed, reloading...');
        await this.load();
      }
    });
  }
  
  onReload(callback) {
    this.listeners.push(callback);
  }
  
  notifyListeners() {
    this.listeners.forEach(cb => cb(this.config));
  }
  
  stopWatching() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }
}

// Usage
const config = new ConfigManager('app-config.json');
await config.load();
config.onReload((newConfig) => console.log('Config updated:', newConfig));
config.watch();
```

Backup System

```javascript
const { copy, read, write, stats, listDirectory } = require('easy-file-reader');

async function createBackup(sourceDir, backupDir) {
  // Create backup directory with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${backupDir}/backup-${timestamp}`;
  await createDirectory(backupPath);
  
  // Get all files
  const files = await listDirectory(sourceDir);
  const results = [];
  
  for (const file of files) {
    const sourceFile = `${sourceDir}/${file}`;
    const destFile = `${backupPath}/${file}`;
    
    // Get file stats
    const fileStats = await stats(sourceFile);
    
    // Copy file
    await copy(sourceFile, destFile);
    results.push({
      file,
      size: fileStats.size,
      modified: fileStats.mtime
    });
  }
  
  // Create manifest
  await write(`${backupPath}/manifest.json`, JSON.stringify({
    timestamp: new Date().toISOString(),
    files: results,
    totalFiles: results.length,
    totalSize: results.reduce((sum, f) => sum + f.size, 0)
  }, null, 2));
  
  return results;
}
```

🛠️ Error Handling

All methods throw descriptive errors that you should catch:

```javascript
try {
  const content = await read('missing-file.txt');
} catch (error) {
  console.error('Failed to read file:', error.message);
  // Handle the error appropriately
}
```

⚡ Performance Tips

1. Large Files: Use readStream() instead of read() for files > 100MB
2. Line Processing: Use readLines() for processing large text files line by line
3. Batch Operations: Use async/await with Promise.all() for multiple files
4. Watch Mode: Use { persistent: false } for one-time change detection

🔒 Security

· All file operations are subject to Node.js file system permissions
· Use mode option to set file permissions (default: 0o666)
· Validate user input before using in file paths

🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments

· Built with Node.js built-in fs module
· Inspired by simplicity and developer experience
· Community feedback and contributions

📧 Support

· 📖 Documentation
· 🐛 Issue Tracker
· 💬 Discussions

---

Made with ❤️ for developers who want simple, powerful file operations

Back to Top
