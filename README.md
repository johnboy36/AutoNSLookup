# AutoNSLookup
Auto NS Lookup

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
