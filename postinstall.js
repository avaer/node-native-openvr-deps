const path = require('path');
const fs = require('fs');
const os = require('os');
const unzipper = require('unzipper');
const rimraf = require('rimraf');
const ws = fs.createReadStream(path.join(__dirname, 'lib.zip'))
  .pipe(unzipper.Extract({
    path: __dirname,
  }));

ws.on('close', () => {
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
