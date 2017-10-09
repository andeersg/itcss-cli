var assert = require('assert');
var mock = require('mock-fs');
var fs = require('fs');
var modifySCSS = require('../lib/modifySCSS');

beforeEach(function() {
  mock({
    'path/to/fake/dir': {
      'some-file.txt': 'file content here',
      'empty-dir': {/** empty directory */}
    },
    'path/to/some.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
    'level1': {
      'level2': {
        'level3': {
          'level4': {
            '.itcssrc': '{"scssFolder": "./dev/scss"}',
            'dev': {
              'scss': {
                'style.scss': `
// Settings

// Tools

// Generic

// Base

// Objects

// Components

// Trumps

`
              }
            }
          }
        }
      }
    }
  });
});
afterEach(mock.restore);


describe('modifySCSS', function() {
  it('should append a line to the SCSS file', function() {
    const originalContent = fs.readFileSync('level1/level2/level3/level4/dev/scss/style.scss', 'utf8');
    const originalContentLength = originalContent.split("\n").length + 1;

    modifySCSS('level1/level2/level3/level4/dev/scss', 'whoop', 'component');
    
    const newContent = fs.readFileSync('level1/level2/level3/level4/dev/scss/style.scss', 'utf8');
    const newContentLength = originalContent.split("\n").length;

    assert.equal(newContentLength, originalContentLength);
  });
});