const path = require('path');
const fs = require('fs');
const os = require('os');
const unzpr = require('unzpr');
const rimraf = require('rimraf');
const rs = fs.createReadStream(path.join(__dirname, 'lib.zip'));

rs.on('ready', () => {
  const ws = rs.pipe(unzpr.Extract({
    path: __dirname,
  }));
  ws.on('done', () => {
    rimraf(path.join(__dirname, 'lib.zip'), err => {
      if (err) {
        throw err;
      }
    });
    const platform = os.platform();
    switch (platform) {
      case 'win32': {
        ['bin', 'lib'].forEach(d => {
          ['osx32', 'osx64', 'linux32', 'linux64'].forEach(p => {
            rimraf(path.join(__dirname, d, p), err => {
              if (err) {
                throw err;
              }
            });
          });
        });
        break;
      }
      case 'darwin': {
        ['bin', 'lib'].forEach(d => {
          ['linux32', 'linux64', 'win32', 'win64'].forEach(p => {
            rimraf(path.join(__dirname, d, p), err => {
              if (err) {
                throw err;
              }
            });
          });
        });
        break;
      }
      case 'linux': {
        ['bin', 'lib'].forEach(d => {
          ['win32', 'win64', 'osx32', 'osx64'].forEach(p => {
            rimraf(path.join(__dirname, d, p), err => {
              if (err) {
                throw err;
              }
            });
          });
        });
        break;
      }
      default: throw new Error('unknown platform: ' + platform);
    }
  });
});
rs.on('error', err => {
  if (err.code === 'ENOENT') {
    process.exit(0);
  } else {
    throw err;
  }
});

process.on('uncaughtException', err => {
  console.warn(err.stack);
});
