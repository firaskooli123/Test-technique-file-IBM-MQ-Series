const mqService = require('./mq.service');

describe('MQ Service', () => {
  it('should be defined', () => {
    expect(mqService).toBeDefined();
  });

  it('should have required methods', () => {
    expect(typeof mqService.connect).toBe('function');
    expect(typeof mqService.sendMessage).toBe('function');
    expect(typeof mqService.receiveMessage).toBe('function');
  });
}); 