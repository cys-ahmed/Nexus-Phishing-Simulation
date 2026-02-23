# Phishing Campaign Templates

Here are a few ready-to-use HTML templates you can copy and paste into the Nexus Phishing Simulator's Campaign Creator. Remember to always include the `{{link}}` tag in your email templates so the system can track clicks and redirect the target to the landing page.

---

## 1. IT Password Expiry (Urgent)

**Subject:** `ACTION REQUIRED: Your Network Password Expires in 24 Hours`

### Email Template

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; padding: 20px; border: 1px solid #ddd; border-top: 4px solid #d9534f; border-radius: 5px;">
    <h2 style="color: #d9534f; margin-top: 0;">IT Security Notification</h2>
    <p>Dear {{first_name}} {{last_name}},</p>
    <p>This is an automated notification from the IT Service Desk. Your corporate network password is set to expire in <strong>24 hours</strong>.</p>
    <p>To maintain access to your email, VPN, and internal tools, please update your password immediately using the secure portal below:</p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="{{link}}" style="background-color: #d9534f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Update Password Now</a>
    </div>
    
    <p>If you fail to update your password before the deadline, your account will be temporarily locked, and you will need to contact the Helpdesk for manual verification.</p>
    <p style="color: #666; font-size: 12px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
        &copy; IT Services Department. This is a mandatory security communication.
    </p>
</div>
```

### Landing Page Template (Credential Harvester)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Corporate Login Portal</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .login-box { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 100%; max-width: 360px; }
        .login-box h2 { text-align: center; color: #333; margin-top: 0; margin-bottom: 24px; font-weight: 500; }
        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; margin-bottom: 8px; color: #555; font-size: 14px; }
        .input-group input { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px; transition: border-color 0.2s; }
        .input-group input:focus { outline: none; border-color: #0066cc; }
        button { width: 100%; padding: 12px; background-color: #0066cc; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: 500; cursor: pointer; transition: background-color 0.2s; margin-top: 10px; }
        button:hover { background-color: #0052a3; }
        .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #888; }
    </style>
</head>
<body>
    <div class="login-box">
        <h2>Single Sign-On</h2>
        <p style="color: #d9534f; font-size: 13px; text-align: center; margin-bottom: 20px; background: #fff0f0; padding: 10px; border-radius: 4px; border: 1px solid #fccdcd;">Your session has expired or requires immediate action.</p>
        <form>
            <div class="input-group">
                <label>Corporate Email or Username</label>
                <input type="text" name="username" required placeholder="name@company.com">
            </div>
            <div class="input-group">
                <label>Current Password</label>
                <input type="password" name="password" required placeholder="Enter password">
            </div>
            <button type="submit">Sign In</button>
        </form>
        <div class="footer">
            Secured by Corporate Identity Services
        </div>
    </div>
</body>
</html>
```

---

## 2. Microsoft 365 Unusual Activity

**Subject:** `Microsoft Notification: Unusual sign-in activity detected`

### Email Template

```html
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333; padding: 20px;">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png" alt="Microsoft" style="width: 120px; margin-bottom: 20px;">
    <h2 style="font-weight: 400; font-size: 24px; color: #111;">Unusual sign-in activity</h2>
    
    <p>Hi {{first_name}},</p>
    <p>We detected something unusual about a recent sign-in to the Microsoft account associated with your email address.</p>
    
    <div style="background-color: #f4f4f4; padding: 15px; margin: 20px 0; border-left: 4px solid #ffb900;">
        <p style="margin: 0 0 5px 0;"><strong>Sign-in details</strong></p>
        <p style="margin: 0 0 3px 0; font-size: 14px;"><strong>Country/region:</strong> Russia/Moscow</p>
        <p style="margin: 0 0 3px 0; font-size: 14px;"><strong>IP address:</strong> 188.242.112.55</p>
        <p style="margin: 0 0 3px 0; font-size: 14px;"><strong>Date:</strong> Just now</p>
        <p style="margin: 0; font-size: 14px;"><strong>Platform:</strong> Windows 10 / Firefox</p>
    </div>
    
    <p>If this was you, you can safely ignore this email.</p>
    <p>If you don't recognize this activity, please sign in quickly to review your recent activity and secure your account.</p>
    
    <div style="margin: 30px 0;">
        <a href="{{link}}" style="background-color: #0067b8; color: white; padding: 10px 20px; text-decoration: none; font-weight: 600;">Review recent activity</a>
    </div>
    
    <p style="font-size: 12px; color: #666;">To opt out or change where you receive security notifications, <a href="{{link}}" style="color: #0067b8;">click here</a>.</p>
    <p style="font-size: 12px; color: #666; margin-top: 20px;">Microsoft Corporation, One Microsoft Way, Redmond, WA 98052</p>
</div>
```

### Landing Page Template (Microsoft Login Clone)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Sign in to your account</title>
    <style>
        body { font-family: 'Segoe UI', "Helvetica Neue", "Lucida Grande", Roboto, "Ebrima", "Nirmala UI", Gadugi, "Segoe Xbox Symbol", "Segoe UI Symbol", "Meiryo UI", "Khmer UI", Tunga, "Lao UI", Raavi, "Iskoola Pota", Latha, Leelawadee, "Microsoft YaHei UI", "Microsoft JhengHei UI", "Malgun Gothic", "Estrangelo Edessa", "Microsoft Himalaya", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Tai Le", "Microsoft Yi Baiti", "Mongolian Baiti", "MV Boli", "Myanmar Text", "Cambria Math"; background-color: #fff; background-image: url('https://aadcdn.msauth.net/shared/1.0/content/images/backgrounds/2_bc3d32a696895f78c19df6c717586a5d.svg'); background-size: cover; background-position: center; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .login-box { background: white; padding: 44px; width: 100%; max-width: 360px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
        .logo { width: 108px; margin-bottom: 24px; }
        h1 { font-size: 24px; font-weight: 600; color: #1b1b1b; margin-top: 0; margin-bottom: 16px; }
        .input-group { margin-bottom: 16px; font-size: 15px; }
        .input-group input { width: 100%; padding: 8px 0; border: none; border-bottom: 1px solid #666; font-size: 15px; transition: border-bottom-color 0.2s; box-sizing: border-box; }
        .input-group input:focus { outline: none; border-bottom: 1px solid #0067b8; }
        .input-group input::placeholder { color: #666; }
        .help-text { font-size: 13px; color: #0067b8; margin-bottom: 32px; display: block; text-decoration: none; }
        .help-text:hover { text-decoration: underline; }
        .buttons { display: flex; justify-content: flex-end; }
        button { padding: 6px 32px; background-color: #0067b8; color: white; border: none; font-size: 15px; cursor: pointer; transition: background-color 0.2s; min-height: 32px; }
        button:hover { background-color: #005da6; }
    </style>
</head>
<body>
    <div class="login-box">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png" class="logo" alt="Microsoft">
        <h1>Sign in</h1>
        <form>
            <div class="input-group">
                <input type="text" name="username" required placeholder="Email, phone, or Skype">
            </div>
            <div class="input-group">
                <input type="password" name="password" required placeholder="Password">
            </div>
            <a href="#" class="help-text">Can't access your account?</a>
            <div class="buttons">
                <button type="submit">Sign in</button>
            </div>
        </form>
    </div>
</body>
</html>
```

---

## 3. Human Resources: Mandatory Policy Update

**Subject:** `Required Action: Updated Employee Handbook and Conduct Policy`

### Email Template

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #444; padding: 30px; border: 1px solid #eaebec; border-top: 5px solid #10b981; border-radius: 8px; background-color: #ffffff;">
    <h2 style="color: #10b981; margin-top: 0; border-bottom: 2px solid #f3f4f6; padding-bottom: 15px;">Human Resources Department</h2>
    
    <p style="font-size: 16px; line-height: 1.5;">Hello {{first_name}},</p>
    
    <p style="font-size: 16px; line-height: 1.5;">Please be advised that the Employee Handbook and Code of Conduct documents have been updated for the current fiscal year.</p>
    
    <p style="font-size: 16px; line-height: 1.5; font-weight: bold; color: #b91c1c;">All employees are required to review and acknowledge the updated policies by end of day Friday.</p>
    
    <div style="background-color: #f9fafb; padding: 20px; border-left: 4px solid #3b82f6; margin: 25px 0;">
        <h3 style="margin-top: 0; font-size: 15px; color: #1f2937;">Document Details:</h3>
        <ul style="margin-bottom: 0; padding-left: 20px; font-size: 14px;">
            <li style="margin-bottom: 8px;">Revised Remote Work Guidelines</li>
            <li style="margin-bottom: 8px;">Updated Benefits Overview (New Opt-out Forms)</li>
            <li>Annual Security Compliance Addendum</li>
        </ul>
    </div>
    
    <p style="font-size: 16px; line-height: 1.5;">You can securely access and sign your copy of the documents using the internal HR portal link below:</p>
    
    <div style="text-align: center; margin: 35px 0;">
        <a href="{{link}}" style="background-color: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);">Review and Acknowledge Documents</a>
    </div>
    
    <p style="font-size: 14px; line-height: 1.5; color: #6b7280;">Failure to acknowledge the new policy may result in temporary suspension of remote work privileges.</p>
    
    <hr style="border: none; border-top: 1px solid #eaebec; margin-top: 30px;">
    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
        This email was sent to {{email}} by the Automated HR Notification System.<br>
        Confidential Internal Communication.
    </p>
</div>
```

*(Note: You can pair this email with the Corporate Portal login landing page from Template #1)*

---

## 4. Deceptive Link Examples (For Visual Decoys)

When crafting your phishing emails, the actual link the user clicks will always be generated by the `{{link}}` tag (which points to your Nexus server). However, you can disguise this link so it *looks* like a legitimate URL to the target.

Here are examples of how to format the visible text of your `<a>` tags to make them convincing:

**1. Typosquatting (Slight Misspellings):**
Make the visible text closely resemble a real domain.
```html
<a href="{{link}}">https://www.micros0ft.com/login</a>
<a href="{{link}}">https://mycompany-portal.net/auth</a>
<a href="{{link}}">https://www.gma1l.com/secure</a>
```

**2. Hidden Subdomains:**
Use long subdomains to hide the true destination.
```html
<a href="{{link}}">https://login.microsoftonline.com.secure-update-portal.net/auth</a>
<a href="{{link}}">https://hr-department.mycompany.com.employee-verify.info/</a>
```

**3. Action-Oriented Buttons (Recommended):**
Hide the URL completely behind a professional-looking button.
```html
<a href="{{link}}" style="background-color: #0078D4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Sign In to Required Portal</a>
```

**4. "Secure" Protocol Trick:**
Add text that implies security.
```html
<a href="{{link}}">🔒 https://secure.yourbank.com/online-banking/login</a>
```
