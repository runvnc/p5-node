const fs = require('fs')
const { ZSTDDecompress } = require('simple-zstd')
const concat = require('concat-stream')
const {spawn} = require('child_process')

async function getZSTDdata(filename) {
  if (fs.existsSync(filename)) {
    // Set the high water mark for the input stream.
   // const inputStream = fs.createReadStream(filename, { highWaterMark: 16000000 });

    const bufferPromise = new Promise((resolve, reject) => {
      // Set the high water mark for the output stream.
      const outputStream = concat((buffer) => {
        resolve(buffer);
      }, { highWaterMark: 16000000 });

      // Set the high water mark for the decompress stream.
      const zstd = spawn('zstd', ['-d', filename, '-c'])
      //zstd.stdin.highWaterMark = 16000000
      //inputStream.pipe(zstd.stdin,{highWaterMark:16000000})
      zstd.stdout.highWaterMark = 16000000
      zstd.stdout.pipe(outputStream)
      zstd.stderr.on('data', (d) => {
        console.warn(String(d))
      })
      //const decompressStream = ZSTDDecompress({},{highWaterMark:16000000})
      //inputStream.pipe(decompressStream).pipe(outputStream);
    });

    return await bufferPromise;
  }
}

module.exports = {getZSTDdata}
