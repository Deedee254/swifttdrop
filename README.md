# SwifttDrop Landing Page

A modern, responsive landing page for SwifttDrop delivery service built with Next.js and Tailwind CSS.

## Features

- Responsive design for all device sizes
- Interactive delivery cost calculator
- Merchant and rider registration forms
- WhatsApp integration for customer support
- PWA (Progressive Web App) support

## Environment Variables

The application uses environment variables for configuration. Create a `.env.local` file in the root directory with the following variables:

```
# WhatsApp Business Configuration
WHATSAPP_BUSINESS_NUMBER=254725264955

# CRM Webhook Configuration (optional for local development)
CRM_WEBHOOK_URL=http://localhost:3000/api/webhook-test
CRM_WEBHOOK_TOKEN=test_token
```

For production, these variables should be set in your hosting environment.

## Development

First, install dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

See [CPANEL_DEPLOYMENT.md](./CPANEL_DEPLOYMENT.md) for detailed instructions on deploying to cPanel.

## License

Copyright © 2024 SwifttDrop. All rights reserved.