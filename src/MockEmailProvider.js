class MockEmailProvider {
    constructor(failureRate) {
      this.failureRate = failureRate;
    }
  
    async sendEmail(email) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < this.failureRate) {
            reject(new Error('Simulated email sending failure'));
          } else {
            resolve('Email sent');
          }
        }, 100);
      });
    }
  }
  
  module.exports = MockEmailProvider;
  