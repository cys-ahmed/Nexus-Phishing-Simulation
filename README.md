# Nexus Phishing Simulation

> ⚠️ **Educational Use Only**: This tool is designed exclusively for authorized security awareness training, penetration testing, and educational purposes. Always obtain explicit written permission before conducting any phishing simulations against real users or systems.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg )](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js )](https://nextjs.org )
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript )](https://www.typescriptlang.org )

A modern, self-hosted phishing simulation platform built with Next.js for conducting authorized security awareness training campaigns. Nexus enables security teams to create realistic phishing scenarios, track engagement metrics, and educate users about social engineering threats.

## 🎯 Features

- **Campaign Management**: Create, schedule, and manage phishing simulation campaigns
- **Template Library**: Pre-built, customizable email templates for common attack vectors
- **Dynamic Personalization**: Use variables like `{{first_name}}`, `{{last_name}}`, `{{email}}` to personalize campaigns
- **Click Tracking**: Monitor link clicks and user interactions via the `{{link}}` placeholder
- **Landing Page Builder**: Deploy realistic credential-harvesting pages for training purposes
- **SQLite Backend**: Lightweight, file-based database for easy deployment
- **TypeScript Support**: Type-safe codebase for maintainability and developer experience
- **Modular Architecture**: Separated frontend (`/frontend`) and backend (`/backend`) for scalability

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cys-ahmed/Nexus-Phishing-Simulation.git 
   cd Nexus-Phishing-Simulation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** *(Optional but recommended)*
   ```bash
   # Create a .env file in the root directory
   cp .env.example .env  # If example exists, otherwise create manually
   ```
   
   Example `.env`:
   ```env
   # Email Configuration (for sending simulations)
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your-email@example.com
   SMTP_PASS=your-app-password
   
   # Application Settings
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   DATABASE_PATH=./phishing-simulator.db
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   This concurrently starts:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3001` (or as configured)

5. **Access the dashboard**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
Nexus-Phishing-Simulation/
├── backend/                 # Node.js API server
│   ├── routes/             # API endpoint definitions
│   ├── services/           # Business logic (email, tracking, etc.)
│   └── config/             # Database and app configuration
├── frontend/               # Next.js application
│   ├── app/                # App router pages & layouts
│   ├── components/         # Reusable UI components
│   └── lib/                # Frontend utilities & API clients
├── public/                 # Static assets (images, icons)
├── src/                    # Shared source code
├── campaign_templates.md   # Ready-to-use phishing email templates
├── phishing-simulator.db   # SQLite database file
├── package.json            # Project dependencies & scripts
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── LICENSE                 # MIT License
```

## 📧 Using Campaign Templates

The repository includes realistic, ethically-designed templates in [`campaign_templates.md`](campaign_templates.md). Each template includes:

- **Email HTML**: Professionally styled phishing email with personalization tokens
- **Landing Page**: Matching credential collection page for training scenarios
- **Obfuscation Examples**: Techniques to make links appear legitimate (for educational purposes)

### Template Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{first_name}}` | Recipient's first name | `John` |
| `{{last_name}}` | Recipient's last name | `Doe` |
| `{{email}}` | Recipient's email address | `john.doe@company.com` |
| `{{link}}` | **Required**: Tracked simulation link | `https://your-server/track/abc123` |

> 🔑 **Critical**: Always include `{{link}}` in your email templates. This placeholder is replaced with a unique tracking URL that logs clicks and redirects users to your landing page.

### Example: Adding a New Template

1. Copy a template from `campaign_templates.md`
2. Customize the HTML/CSS to match your organization's branding
3. Ensure `{{link}}` and relevant personalization tokens are present
4. Import via the Campaign Creator UI or API

## 🔐 Ethical Guidelines & Best Practices

✅ **DO**:
- Obtain **written authorization** from all stakeholders before launching simulations
- Clearly define scope, targets, and success metrics
- Debrief participants after campaigns with educational content
- Store collected data securely and delete after analysis
- Comply with local laws (GDPR, CCPA, CFAA, etc.)

❌ **DON'T**:
- Use this tool for malicious phishing, fraud, or unauthorized access
- Target individuals without explicit organizational approval
- Collect sensitive credentials beyond training purposes
- Share simulation results publicly without anonymization

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development servers (frontend + backend) |
| `npm run build` | Build production application |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality checks |

### Database Schema

The SQLite database (`phishing-simulator.db`) stores:
- Campaign configurations
- Target recipient lists
- Click/event tracking logs
- Template metadata

> 💡 Tip: Use a SQLite GUI tool like [DB Browser for SQLite](https://sqlitebrowser.org/ ) to inspect data during development.

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.


## Acknowledgements

- [Next.js](https://nextjs.org ) for the React framework
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3 ) for high-performance SQLite bindings
- [Nodemailer](https://nodemailer.com ) for email delivery
- Security awareness professionals worldwide who promote ethical training practices

---

> 🛡️ **Remember**: The goal of phishing simulation is **education**, not deception. Use this tool responsibly to build a more security-conscious organization.

*Built for cybersecurity education by [cys-ahmed](https://github.com/cys-ahmed )*
