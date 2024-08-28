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
   git clone https://github.com/KhushbuKumari21/EmailService.git
#  2.Navigate to the project directory:

cd EmailService

# 3. Install dependencies

npm install


**Usage**
Import the EmailService and MockEmailProvider classes into your project.

Create instances of MockEmailProvider with desired failure rates and initialize EmailService with these providers.

Use the sendEmail method to send emails and handle responses.
const EmailService = require('./src/EmailService');
const MockEmailProvider = require('./src/MockEmailProvider');

const failingProvider = new MockEmailProvider(1.0);
const fallbackProvider = new MockEmailProvider(0.1);

const emailService = new EmailService([failingProvider, fallbackProvider], 1000);

emailService.sendEmail('test@example.com')
  .then(() => console.log('Email sent successfully'))
  .catch(err => console.error('Failed to send email:', err));


**Testing**
npm test

