const logger = require('./logger.service');

describe('Logger Service', () => {
  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('should have required methods', () => {
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
  });
}); 