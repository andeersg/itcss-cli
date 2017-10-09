var assert = require('assert');
var mock = require('mock-fs');
var configFile = require('../lib/configFile');

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
                'style.scss': ''
              }
            }
          }
        }
      }
    }
  });
});
afterEach(mock.restore);


describe('configFile', function() {
  it('should return a object containing the correct properties', function() {
    const config = configFile.findConfigFile('level1/level2/level3/level4', 1);
    assert.equal(config.config.scssFolder, './dev/scss');
  });
  
  it('should return false if it hits the level limit', function() {
    const config = configFile.findConfigFile('level1/level2/level3', 1, 2);
    assert.equal(config, false);
  });
  
  it('should return false if it reaches bottom of path', function() {
    const config = configFile.findConfigFile('level1/level2/level3', 1, 10);
    assert.equal(config, false);
  });
});