# Resend Email Setup Guide

## Why Resend?
- Railway-friendly (no SMTP connection issues)
- API-based (no port/firewall problems)
- 100 free emails per day
- Simple setup

## Setup Steps:

### 1. Create Resend Account
1. Buka https://resend.com/
2. Sign up dengan GitHub/Google
3. Verify email

### 2. Get API Key
1. Dashboard -> API Keys
2. Create new API Key
3. Copy key (format: `re_xxxxxxxx`)

### 3. Verify Domain (Optional)
Untuk production:
1. Dashboard -> Domains
2. Add your domain (e.g., `danadiri.com`)
3. Add DNS records
4. Wait for verification

**For testing**: Use default `onboarding@resend.dev`

### 4. Railway Environment Variables
Add ke Railway dashboard:
```bash
# Email Configuration (Resend)
RESEND_API_KEY=re_your_actual_api_key_here
EMAIL_FROM=DanaDiri <onboarding@resend.dev>
```

### 5. Restart Deployment
1. Railway -> Deployments -> Restart
2. Monitor logs untuk "Sending email via Resend"

## Testing OTP:
```bash
POST {{RAILWAY_URL}}/api/auth/send-otp
{
  "email": "test@example.com"
}
```

## Benefits vs Nodemailer:
- No IPv6/IPv4 connection issues
- No SMTP port blocking
- Built-in analytics
- Better error handling
- Railway optimized

## Troubleshooting:
- **API_KEY invalid**: Check RESEND_API_KEY di Railway
- **FROM domain error**: Use `onboarding@resend.dev` for testing
- **Rate limit**: 100 emails/day free tier
