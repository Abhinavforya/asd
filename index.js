require('dotenv').config();
const { EC2Client, DescribeInstancesCommand } = require('@aws-sdk/client-ec2');

// Configure AWS SDK
const region = process.env.AWS_REGION || 'us-east-1';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

console.log('AWS EC2 Test Application');
console.log('========================\n');
console.log(`Region: ${region}`);
console.log(`AWS Credentials Configured: ${accessKeyId ? 'Yes' : 'No'}\n`);

if (!accessKeyId || !secretAccessKey) {
  console.log('⚠️  AWS credentials not found in environment variables.');
  console.log('Please configure AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env file\n');
}

// Example: List EC2 instances
const client = new EC2Client({ region });

async function listInstances() {
  try {
    console.log('Fetching EC2 instances...\n');
    const command = new DescribeInstancesCommand({});
    const response = await client.send(command);

    const instances = response.Reservations.flatMap(r => r.Instances);
    
    if (instances.length === 0) {
      console.log('No instances found in this region.');
      return;
    }

    console.log(`Found ${instances.length} instance(s):\n`);
    instances.forEach((instance, index) => {
      console.log(`Instance ${index + 1}:`);
      console.log(`  ID: ${instance.InstanceId}`);
      console.log(`  Type: ${instance.InstanceType}`);
      console.log(`  State: ${instance.State.Name}`);
      console.log(`  Public IP: ${instance.PublicIpAddress || 'Not assigned'}`);
      console.log(`  Private IP: ${instance.PrivateIpAddress}`);
      console.log('');
    });

  } catch (error) {
    console.error('Error:', error.message);
    if (error.message.includes('InvalidClientTokenId')) {
      console.error('Invalid AWS credentials. Please check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.');
    }
  }
}

listInstances();
