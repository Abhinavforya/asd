require('dotenv').config();
const { SSMClient, SendCommandCommand } = require('@aws-sdk/client-ssm');

const region = process.env.AWS_REGION || 'us-east-1';
const instanceId = process.argv[2];
const command = process.argv[3] || 'echo "Hello from EC2"';

if (!instanceId) {
  console.log('Usage: node runCommand.js <instance-id> [command]');
  console.log('Example: node runCommand.js i-0123456789abcdef0 "ls -la"');
  console.log('Example: node runCommand.js i-0123456789abcdef0');
  process.exit(1);
}

const client = new SSMClient({ region });

async function runCommandOnInstance() {
  try {
    console.log(`\n⚙️  Running command on ${instanceId}\n`);
    console.log(`Command: ${command}\n`);
    
    const ssmCommand = new SendCommandCommand({
      InstanceIds: [instanceId],
      DocumentName: 'AWS-RunShellScript',
      Parameters: {
        'command': [command]
      }
    });
    
    const response = await client.send(ssmCommand);
    
    console.log('✅ Command sent successfully');
    console.log(`Command ID: ${response.Command.CommandId}`);
    console.log(`Status:     ${response.Command.Status}`);
    console.log(`Output S3:  ${response.Command.OutputS3BucketName || 'Not configured'}\n`);
    
    console.log('Note: Check the EC2 Systems Manager Session Manager for command output.');
    console.log('Make sure the EC2 instance has the SSM agent running and proper IAM role.\n');
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.message.includes('UnsupportedPlatformException')) {
      console.error('The instance may not support Systems Manager. Ensure:');
      console.error('  1. SSM agent is installed and running');
      console.error('  2. EC2 instance has an IAM role with SSM permissions');
      console.error('  3. Instance has internet connectivity or VPC endpoint to SSM');
    }
  }
}

runCommandOnInstance();
