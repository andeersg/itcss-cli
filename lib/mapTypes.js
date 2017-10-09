const componentInfo = function(name) {
  switch (name) {
    case 'trump':
      return 'trumps';

    case 'tool':
      return 'tools';
  
    case 'base':
      return 'base';

    case 'generic':
      return 'generic';
    
    case 'object':
      return 'objects';
    
    case 'component':
      return 'components';
  }
  return 'components';
};

module.exports = componentInfo;