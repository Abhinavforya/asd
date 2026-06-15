require('dotenv').config();
const { EC2Client, DescribeInstancesCommand } = require('@aws-sdk/client-ec2');

const region = process.env.AWS_REGION || 'us-east-1';
const instanceId = process.argv[2];

if (!instanceId) {
  console.log('Usage: node describeInstance.js <instance-id>');
  console.log('Example: node describeInstance.js i-0123456789abcdef0');
  process.exit(1);
}

const client = new EC2Client({ region });

async function describeInstance() {
  try {
    console.log(`\n📌 Instance Details for ${instanceId}\n`);
    
    const command = new DescribeInstancesCommand({
      InstanceIds: [instanceId]
    });
    
    const response = await client.send(command);
    
    if (!response.Reservations || response.Reservations.length === 0) {
      console.log('Instance not found.');
      return;
    }

    const instance = response.Reservations[0].Instances[0];
    
    console.log('Basic Information:');
    console.log(`  Instance ID:      ${instance.InstanceId}`);
    console.log(`  Instance Type:    ${instance.InstanceType}`);
    console.log(`  State:            ${instance.State.Name}`);
    console.log(`  AMI ID:           ${instance.ImageId}`);
    console.log(`  Key Name:         ${instance.KeyName || 'N/A'}`);
    
    console.log('\nNetworking:');
    console.log(`  Public IP:        ${instance.PublicIpAddress || 'N/A'}`);
    console.log(`  Private IP:       ${instance.PrivateIpAddress}`);
    console.log(`  VPC ID:           ${instance.VpcId}`);
    console.log(`  Subnet ID:        ${instance.SubnetId}`);
    console.log(`  Security Groups:  ${instance.SecurityGroups.map(sg => `${sg.GroupName} (${sg.GroupId})`).join(', ')}`);
    
    console.log('\nStorage:');
    console.log(`  Root Device:      ${instance.RootDeviceName}`);
    console.log(`  Block Devices:    ${instance.BlockDeviceMappings.length}`);
    instance.BlockDeviceMappings.forEach(bd => {
      console.log(`    - ${bd.DeviceName}: ${bd.Ebs?.VolumeId} (${bd.Ebs?.Status})`);
    });
    
    console.log('\nTiming:');
    console.log(`  Launch Time:      ${instance.LaunchTime}`);
    console.log(`  Uptime:           ${Math.floor((Date.now() - instance.LaunchTime) / 1000 / 60)} minutes`);
    
    if (instance.Tags && instance.Tags.length > 0) {
      console.log('\nTags:');
      instance.Tags.forEach(tag => {
        console.log(`  ${tag.Key}: ${tag.Value}`);
      });
    }
    
    console.log('\n');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

describeInstance();
