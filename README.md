# AWS EC2 Test Application

A sample Node.js application to test AWS EC2 connectivity and perform basic operations.

## Prerequisites

- Node.js (v14 or higher)
- AWS Account with EC2 instances
- AWS Access Key ID and Secret Access Key

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your AWS credentials:
```
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
```

## Usage

### List all EC2 instances
```bash
npm start
```

### List instances in a specific region
```bash
AWS_REGION=us-west-2 npm start
```

## Scripts

- `npm start` - List all EC2 instances
- `npm run list-instances` - List instances (verbose output)
- `npm run describe-instance` - Get details of a specific instance
- `npm run run-command` - Run a command on an instance using SSM

## Features

- ✅ List all EC2 instances in a region
- ✅ Get instance details (ID, type, state, IP addresses)
- ✅ Error handling for invalid credentials
- ✅ Environment variable configuration
- ✅ Support for multiple AWS regions

## Security Notes

- Never commit `.env` file with real credentials
- Use IAM roles when running on EC2
- Rotate access keys regularly
- Limit IAM permissions to necessary EC2 actions only

## Architecture

```
├── index.js                 # Main entry point
├── scripts/
│   ├── listInstances.js    # List instances with more details
│   ├── describeInstance.js # Get specific instance details
│   └── runCommand.js       # Execute commands on instances
├── .env                     # AWS credentials (not committed)
└── package.json            # Project dependencies
```
