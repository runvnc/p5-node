const fs = require('fs')
const { ZSTDDecompress } = require('simple-zstd')
const concat = require('concat-stream')

export async function getZSTDdata(filename) {
  if (fs.existsSync(filename)) {
    // Set the high water mark for the input stream.
    const inputStream = fs.createReadStream(filename, { highWaterMark: 16000000 });

    const bufferPromise = new Promise((resolve, reject) => {
      // Set the high water mark for the output stream.
      const outputStream = concat((buffer) => {
        resolve(buffer);
      }, { highWaterMark: 16000000 });

      // Set the high water mark for the decompress stream.
      const decompressStream = ZSTDDecompress({ highWaterMark: 16000000 });
      inputStream.pipe(decompressStream).pipe(outputStream);
    });

    return await bufferPromise;
  }
}


