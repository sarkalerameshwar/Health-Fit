# Email Timeout Fix TODO

- [x] Update backend/utils/email.js: Change SMTP port to 587, secure: false, add timeouts (connectionTimeout: 10000, socketTimeout: 10000, greetingTimeout: 5000)
- [ ] Test local email send (e.g., trigger signup or forgot-password)
- [ ] Deploy to Render and verify email sending works
- [ ] Add logging for email attempts if needed
