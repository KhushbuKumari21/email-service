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
  
  module.exports = StatusTracker;
  