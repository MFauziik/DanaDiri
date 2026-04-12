# Railway Email Connection Fix

## Problem: ETIMEDOUT Connection Error

## Solutions Applied:

### 1. Optimized Timeout Settings
- connectionTimeout: 30s (dari 60s)
- greetingTimeout: 15s (dari 30s)  
- socketTimeout: 30s (dari 60s)
- Reduced maxConnections: 3 (dari 5)

### 2. Added Retry Logic
- 3 attempts dengan exponential backoff
- Only retry pada timeout/connection errors
- Better error messages dengan checklist

### 3. Railway Environment Variables Checklist

Di Railway dashboard, pastikan:

```bash
# Gmail SMTP Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=noreply@danadiri.com
```

## Common Issues & Solutions:

### Gmail App Password Setup:
1. Enable 2FA di Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. App: Mail, Device: Other = "DanaDiri Backend"
4. Copy 16-character password (tanpa spaces)

### Railway Specific:
- Pastikan semua EMAIL_* variables ada
- Restart deployment setelah mengubah variables
- Check Railway logs untuk detailed error

### Alternative SMTP Settings:
Jika Gmail masih error, coba:
- Port 465 dengan EMAIL_SECURE=true
- Gunakan Outlook SMTP
- Pertimbangkan Resend/SendGrid

## Testing:
Setelah deploy, test dengan:
1. Health check: GET /
2. Send OTP: POST /api/auth/send-otp
3. Check Railway logs untuk "Attempt 1/3" messages
