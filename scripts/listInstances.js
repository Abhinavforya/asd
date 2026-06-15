require('dotenv').config();
const { EC2Client, DescribeInstancesCommand } = require('@aws-sdk/client-ec2');

const region = process.env.AWS_REGION || 'us-east-1';
const client = new EC2Client({ region });

async function listInstancesVerbose() {
  try {
    console.log(`\n📋 Listing EC2 Instances in ${region}\n`);
    
    const command = new DescribeInstancesCommand({
      Filters: [
        {
          Name: 'instance-state-name',
          Values: ['running', 'stopped', 'pending', 'stopping']
        }
      ]
    });
    
    const response = await client.send(command);
    
    if (!response.Reservations || response.Reservations.length === 0) {
      console.log('No instances found.');
      return;
    }

    response.Reservations.forEach((reservation) => {
      reservation.Instances.forEach((instance) => {
        console.log('─'.repeat(50));
        console.log(`Instance ID:      ${instance.InstanceId}`);
        console.log(`Instance Type:    ${instance.InstanceType}`);
        console.log(`State:            ${instance.State.Name}`);
        console.log(`Launch Time:      ${instance.LaunchTime}`);
        console.log(`Public IP:        ${instance.PublicIpAddress || 'N/A'}`);
        console.log(`Private IP:       ${instance.PrivateIpAddress}`);
        console.log(`Availability Zone: ${instance.Placement.AvailabilityZone}`);
        console.log(`Security Groups:  ${instance.SecurityGroups.map(sg => sg.GroupName).join(', ')}`);
        if (instance.Tags && instance.Tags.length > 0) {
          console.log('Tags:');
          instance.Tags.forEach(tag => {
            console.log(`  ${tag.Key}: ${tag.Value}`);
          });
        }
      });
    });
    
    console.log('─'.repeat(50) + '\n');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listInstancesVerbose();
