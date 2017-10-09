var assert = require('assert');
var mapTypes = require('../lib/mapTypes');


describe('mapTypes', function() {
  it('should return the correct folder name given "trump"', function() {
      assert.equal(mapTypes('trump'), 'trumps');
  });
  it('should return the correct folder name given "tool"', function() {
      assert.equal(mapTypes('tool'), 'tools');
  });
  it('should return the correct folder name given "base"', function() {
      assert.equal(mapTypes('base'), 'base');
  });
  it('should return the correct folder name given "generic"', function() {
      assert.equal(mapTypes('generic'), 'generic');
  });
  it('should return the correct folder name given "object"', function() {
      assert.equal(mapTypes('object'), 'objects');
  });
  it('should return the correct folder name given "component"', function() {
      assert.equal(mapTypes('component'), 'components');
  });
  it('should return "components", given something else', function() {
      assert.equal(mapTypes('whatever'), 'components');
  });
});