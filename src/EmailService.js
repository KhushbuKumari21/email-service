class StatusTracker {
    constructor() {
      this.statuses = {};
    }
  
    track(emailId, status) {
      this.statuses[emailId] = status;
    }
  
    getStatus(emailId) {
      return this.statuses[emailId];
    }
  }
  
  class MockEmailProvider {
    constructor(failureRate) {
      this.failureRate = failureRate;
      this.failures = 0;
      this.successes = 0;
      this.isCircuitOpen = false;
      this.cooldown = 10000;
      this.lastFailureTime = 0;
    }
  
    async sendEmail(email) {
      if (this.isCircuitOpen) {
        const now = Date.now();
        if (now - this.lastFailureTime > this.cooldown) {
          this.isCircuitOpen = false;
          this.failures = 0;
        } else {
          throw new Error('Circuit breaker open');
        }
      }
  
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < this.failureRate) {
            this.failures++;
            if (this.failures >= 3) {
              this.isCircuitOpen = true;
              this.lastFailureTime = Date.now();
            }
            reject(new Error('Simulated email sending failure'));
          } else {
            this.successes++;
            resolve('Email sent');
          }
        }, 100);
      });
    }
  }
  
  class EmailService {
    constructor(providers, rateLimit) {
      this.providers = providers;
      this.rateLimit = rateLimit;
      this.statusTracker = new StatusTracker();
      this.lastSendTime = 0;
      this.queue = [];
      this.isProcessing = false;
    }
  
    async sendEmail(email) {
      const emailId = this.generateUniqueId(email);
      this.statusTracker.track(emailId, 'IN_PROGRESS');
  
      if (this.queue.length === 0 && !this.isProcessing) {
        this.isProcessing = true;
        await this.processQueue();
      }
  
      return new Promise((resolve, reject) => {
        this.queue.push({ email, resolve, reject });
        if (!this.isProcessing) {
          this.processQueue().then(() => resolve()).catch(() => reject());
        }
      });
    }
  
    async processQueue() {
      while (this.queue.length > 0) {
        const { email, resolve, reject } = this.queue.shift();
        try {
          const now = Date.now();
          if (now - this.lastSendTime < this.rateLimit) {
            await new Promise(resolve => setTimeout(resolve, this.rateLimit - (now - this.lastSendTime)));
          }
          this.lastSendTime = Date.now();
  
          let lastError;
  
          for (const provider of this.providers) {
            try {
              await this.sendEmailInternal(email, provider);
              this.statusTracker.track(this.generateUniqueId(email), 'SUCCESS');
              resolve();
              break;
            } catch (error) {
              lastError = error;
            }
          }
  
          if (lastError) {
            this.statusTracker.track(this.generateUniqueId(email), 'FAILURE');
            reject(new Error('All providers failed'));
          }
        } catch (error) {
          this.statusTracker.track(this.generateUniqueId(email), 'FAILURE');
          reject(error);
        }
      }
      this.isProcessing = false;
    }
  
    async sendEmailInternal(email, provider) {
      let attempts = 0;
      while (attempts < 3) {
        try {
          await provider.sendEmail(email);
          return;
        } catch (error) {
          attempts++;
          const delay = Math.pow(2, attempts) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          if (attempts >= 3) {
            throw new Error('Failed to send email');
          }
        }
      }
    }
  
    generateUniqueId(email) {
      return email + '-' + new Date().getTime();
    }
  }
  
  module.exports = EmailService;
  