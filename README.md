# Email Service

A resilient email sending service implemented in JavaScript. This service includes features such as retry logic with exponential backoff, a fallback mechanism to switch providers on failure, idempotency, rate limiting, and status tracking.

## Features

- **Retry Mechanism:** Automatically retries sending emails with exponential backoff.
- **Fallback Providers:** Switches to a backup provider if the primary provider fails.
- **Idempotency:** Ensures duplicate emails are not sent.
- **Rate Limiting:** Controls the rate at which emails are sent.
- **Status Tracking:** Keeps track of email sending status.

## Installation

# 1.#  Clone the repository:

   ```bash
   git clone https://github.com/KhushbuKumari21/email-service
   
#  2.Navigate to the project directory:

cd EmailService

# 3. Install dependencies

npm install

const EmailService = require('./src/EmailService');
const MockEmailProvider = require('./src/MockEmailProvider');

// Create instances of providers with desired failure rates
const failingProvider = new MockEmailProvider(1.0); // Provider that always fails
const fallbackProvider = new MockEmailProvider(0.1); // Provider with 10% failure rate

// Initialize EmailService with primary and fallback providers
const emailService = new EmailService([failingProvider, fallbackProvider], 1000);

// Send an email and handle the result
emailService.sendEmail('test@example.com')
  .then(() => console.log('Email sent successfully'))
  .catch(err => console.error('Failed to send email:', err));

**Testing**
npm test

