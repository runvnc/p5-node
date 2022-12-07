const fs = require('fs')
const { ZSTDDecompress } = require('simple-zstd')
const concat = require('concat-stream')
const {spawn,exec} = require('child_process')
const fs2 = require('fs/promises')


let nn = 0

async function getZSTDdata(filename) {
  if (fs.existsSync(filename)) {
    // Set the high water mark for the input stream.
   // const inputStream = fs.createReadStream(filename, { highWaterMark: 16000000 });

    const bufferPromise = new Promise( async (resolve, reject) => {
      // Set the high water mark for the output stream.
      //const outputStream = concat((buffer) => {
      //  resolve(buffer);
      //}, { highWaterMark: 16000000 });

      // Set the high water mark for the decompress stream.
      //const zstd = spawn('zstd', ['-d', filename, '-c'])
      let tmp = '/tmp/'+Date.now()+nn
      const {stdout, stderr} = exec(`zstd -d ${filename} -o ${tmp}`)
      let buf = await fs2.readFile(tmp)
      resolve(buf)
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
