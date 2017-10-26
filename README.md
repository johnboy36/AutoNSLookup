# AutoNSLookup

AWS's IP model is great if you don't care what IP address your website or service is on. However, many networks still require an IP address for whitelisting on the firewall, even for outgoing connections. AutoNSLookup is a function for AWS Lambda written in node.js. It runs on an hourly schedule and monitors the IP4 address associated with a given URL and sends a message to an email address if one or more of the addresses changes. This can be sent on to network admins who can make necessary adjustments to the firewall whitelist.


# Installation

1. Create a new Lambda Function choosing 'Author from scratch'. 

2. Create a new Execution Role, grant the following permissions

{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Stmt1507907664000",
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail",
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
				"s3:GetObject",
                "s3:PutObject"
            ],
            "Resource": [
                "*"
            ]
        }
    ]
}

. Create an S3 bucket and upload your JSON configuration file

. Paste or upload a .zip of the index.js file, make sure var mybucket is set to your S3 bucket.

. Add a Trigger. 
	Choose type = CloudWatch Events.
	Create a new rule, Call it HourlySchedule. Use the schedule expression "rate(1 hour)"
