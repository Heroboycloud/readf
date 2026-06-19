// index.js
const fs = require("node:fs");
const path = require("node:path");
const { promisify } = require("node:util");

// Convert callback-based methods to Promise-based
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const appendFileAsync = promisify(fs.appendFile);
const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);
const readdirAsync = promisify(fs.readdir);

class FileHelper {
  /**
   * Read file synchronously
   * @param {string} file - File path
   * @param {string} encoding - File encoding (default: 'utf8')
   * @returns {string|Buffer} File content
   * @throws {Error} If file not found or other errors
   */
  static readSync(file, encoding = "utf8") {
    try {
      const content = fs.readFileSync(file, { encoding });
      return content;
    } catch (error) {
      throw new Error(`Failed to read file ${file}: ${error.message}`);
    }
  }

  /**
   * Read file asynchronously with Promise
   * @param {string} file - File path
   * @param {string} encoding - File encoding (default: 'utf8')
   * @returns {Promise<string|Buffer>} File content
   */
  static async read(file, encoding = "utf8") {
    try {
      const content = await readFileAsync(file, { encoding });
      return content;
    } catch (error) {
      throw new Error(`Failed to read file ${file}: ${error.message}`);
    }
  }

  /**
   * Read file as stream
   * @param {string} file - File path
   * @param {Object} options - Stream options
   * @returns {Promise<string>} File content as string
   */
  static async readStream(file, options = {}) {
    return new Promise((resolve, reject) => {
      let data = "";
      const stream = fs.createReadStream(file, {
        encoding: options.encoding || "utf8",
        highWaterMark: options.highWaterMark || 64 * 1024,
        ...options,
      });

      stream.on("data", (chunk) => {
        data += chunk;
        if (options.onChunk) options.onChunk(chunk);
      });

      stream.on("end", () => resolve(data));
      stream.on("error", (err) => reject(new Error(`Stream error: ${err.message}`)));
    });
  }

  /**
   * Read file line by line
   * @param {string} file - File path
   * @param {Function} lineHandler - Callback for each line
   * @returns {Promise<number>} Number of lines read
   */
  static async readLines(file, lineHandler, encoding = "utf8") {
    try {
      const content = await this.read(file, encoding);
      const lines = content.split(/\r?\n/);
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i]) {
          await lineHandler(lines[i], i + 1);
        }
      }
      return lines.filter(line => line).length;
    } catch (error) {
      throw new Error(`Failed to read lines from ${file}: ${error.message}`);
    }
  }

  /**
   * Write file synchronously
   * @param {string} file - File path
   * @param {string|Buffer} data - Data to write
   * @param {Object} options - Write options
   * @returns {boolean} Success status
   */
  static writeSync(file, data, options = {}) {
    try {
      fs.writeFileSync(file, data, {
        encoding: options.encoding || "utf8",
        mode: options.mode || 0o666,
        ...options,
      });
      return true;
    } catch (error) {
      throw new Error(`Failed to write file ${file}: ${error.message}`);
    }
  }

  /**
   * Write file asynchronously
   * @param {string} file - File path
   * @param {string|Buffer} data - Data to write
   * @param {Object} options - Write options
   * @returns {Promise<boolean>} Success status
   */
  static async write(file, data, options = {}) {
    try {
      await writeFileAsync(file, data, {
        encoding: options.encoding || "utf8",
        mode: options.mode || 0o666,
        ...options,
      });
      return true;
    } catch (error) {
      throw new Error(`Failed to write file ${file}: ${error.message}`);
    }
  }

  /**
   * Append content to file
   * @param {string} file - File path
   * @param {string|Buffer} data - Data to append
   * @returns {Promise<boolean>} Success status
   */
  static async append(file, data, encoding = "utf8") {
    try {
      await appendFileAsync(file, data, { encoding });
      return true;
    } catch (error) {
      throw new Error(`Failed to append to file ${file}: ${error.message}`);
    }
  }

  /**
   * Check if file exists
   * @param {string} file - File path
   * @returns {boolean} File existence
   */
  static existsSync(file) {
    try {
      return fs.existsSync(file);
    } catch {
      return false;
    }
  }

  /**
   * Async file existence check
   * @param {string} file - File path
   * @returns {Promise<boolean>} File existence
   */
  static async exists(file) {
    try {
      await fs.promises.access(file, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get file stats
   * @param {string} file - File path
   * @returns {Promise<fs.Stats>} File stats
   */
  static async stats(file) {
    try {
      return await fs.promises.stat(file);
    } catch (error) {
      throw new Error(`Failed to get stats for ${file}: ${error.message}`);
    }
  }

  /**
   * Delete file
   * @param {string} file - File path
   * @returns {Promise<boolean>} Success status
   */
  static async delete(file) {
    try {
      await unlinkAsync(file);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete file ${file}: ${error.message}`);
    }
  }

  /**
   * Copy file
   * @param {string} source - Source file path
   * @param {string} destination - Destination file path
   * @returns {Promise<boolean>} Success status
   */
  static async copy(source, destination) {
    try {
      await fs.promises.copyFile(source, destination);
      return true;
    } catch (error) {
      throw new Error(`Failed to copy from ${source} to ${destination}: ${error.message}`);
    }
  }

  /**
   * Move/rename file
   * @param {string} source - Source file path
   * @param {string} destination - Destination file path
   * @returns {Promise<boolean>} Success status
   */
  static async move(source, destination) {
    try {
      await fs.promises.rename(source, destination);
      return true;
    } catch (error) {
      throw new Error(`Failed to move from ${source} to ${destination}: ${error.message}`);
    }
  }

  /**
   * Create directory recursively
   * @param {string} dir - Directory path
   * @returns {Promise<boolean>} Success status
   */
  static async createDirectory(dir) {
    try {
      await mkdirAsync(dir, { recursive: true });
      return true;
    } catch (error) {
      throw new Error(`Failed to create directory ${dir}: ${error.message}`);
    }
  }

  /**
   * List directory contents
   * @param {string} dir - Directory path
   * @param {Object} options - Options (withFileTypes, etc.)
   * @returns {Promise<string[]|fs.Dirent[]>} Directory contents
   */
  static async listDirectory(dir, options = {}) {
    try {
      return await readdirAsync(dir, options);
    } catch (error) {
      throw new Error(`Failed to list directory ${dir}: ${error.message}`);
    }
  }

  /**
   * Watch file for changes
   * @param {string} file - File path
   * @param {Function} callback - Change handler
   * @param {Object} options - Watch options
   * @returns {fs.FSWatcher} Watcher instance
   */
  static watch(file, callback, options = {}) {
    const watcher = fs.watch(file, options, (eventType, filename) => {
      if (eventType === "change") {
        callback(eventType, filename);
      }
    });
    return watcher;
  }
}

// For backward compatibility
function ReadFile(file) {
  return FileHelper.readSync(file);
}

function ReadStream(file) {
  return FileHelper.readStream(file);
}

module.exports = {
  FileHelper,
  readSync: FileHelper.readSync,
  read: FileHelper.read,
  readStream: FileHelper.readStream,
  readLines: FileHelper.readLines,
  writeSync: FileHelper.writeSync,
  write: FileHelper.write,
  append: FileHelper.append,
  existsSync: FileHelper.existsSync,
  exists: FileHelper.exists,
  stats: FileHelper.stats,
  delete: FileHelper.delete,
  copy: FileHelper.copy,
  move: FileHelper.move,
  createDirectory: FileHelper.createDirectory,
  listDirectory: FileHelper.listDirectory,
  watch: FileHelper.watch,
  // Legacy support
  ReadFile,
  ReadStream,
};
