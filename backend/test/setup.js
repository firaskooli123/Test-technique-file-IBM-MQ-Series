// Configuration globale pour les tests
process.env.NODE_ENV = 'test';

// Mock des modules externes
jest.mock('ibmmq', () => ({
  MQCNO: jest.fn(),
  MQCD: jest.fn(),
  MQOD: jest.fn(),
  MQMD: jest.fn(),
  MQPMO: jest.fn(),
  MQGMO: jest.fn(),
  MQCNO_CLIENT_BINDING: 0,
  MQOT_Q: 1,
  MQOO_INPUT_AS_Q_DEF: 1,
  MQOO_OUTPUT: 2,
  MQOO_FAIL_IF_QUIESCING: 4,
  MQPMO_NO_SYNCPOINT: 0,
  MQGMO_NO_SYNCPOINT: 0,
  MQGMO_WAIT: 1,
  MQRC_NO_MSG_AVAILABLE: 2033,
  Connx: jest.fn(),
  Open: jest.fn(),
  Put: jest.fn(),
  Get: jest.fn(),
  Close: jest.fn(),
  Disc: jest.fn()
}));

// Configuration globale pour les tests
beforeAll(() => {
  // Configuration initiale
});

afterAll(() => {
  // Nettoyage final
});

beforeEach(() => {
  // Configuration avant chaque test
});

afterEach(() => {
  // Nettoyage après chaque test
  jest.clearAllMocks();
}); 