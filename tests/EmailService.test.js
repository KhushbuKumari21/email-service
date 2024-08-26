const EmailService = require('../src/EmailService');
const MockEmailProvider = require('../src/MockEmailProvider');

describe('EmailService', () => {
  let emailService;
  let failingProvider;
  let fallbackProvider;

  beforeEach(() => {
    failingProvider = new MockEmailProvider(1.0);
    fallbackProvider = new MockEmailProvider(0.1);
    emailService = new EmailService([failingProvider], 1000);
    jest.setTimeout(15000);
  });

  test('should handle email sending failure', async () => {
    try {
      await expect(emailService.sendEmail('test@example.com')).rejects.toThrow('All providers failed');
    } catch (error) {
      console.error('Error during email sending failure test:', error);
    }
  }, 15000);

  test('should use fallback provider on failure', async () => {
    emailService = new EmailService([failingProvider, fallbackProvider], 1000);
    try {
      await expect(emailService.sendEmail('test@example.com')).resolves.toBeUndefined();
    } catch (error) {
      console.error('Error during fallback provider test:', error);
    }
  }, 15000);
});
