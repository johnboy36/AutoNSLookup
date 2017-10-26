var aws = require('aws-sdk');
var s3 = new aws.S3();
var config;
var mybucket = "my.lambda.config";
var s3Params = {
  Bucket: mybucket, 
  Key: "config.json"
 };

function getConfig(callback){
   s3.getObject(s3Params, function(err, data) {
	   if (err) console.log(err); 
	   else 
	   {	
			config = JSON.parse(data.Body.toString('utf-8'));
			callback();
	   }
	 });
}
 
function doDNS(callback){
	var dns = require('dns');
    dns.resolve4(config.url, (err, addresses) => {
		if (err) console.log(err);
		else {	
			for(var i = 0; i < addresses.length; i++)
				{		
					if(addresses.indexOf(config.lastIP[i]) == -1) 
					{
						console.log("IP has changed from " + config.lastIP[0] + ", " + config.lastIP[1]);
						console.log("to " + addresses[0] + ", " + addresses[1]);
						callback(addresses);
						break;
					}
				}
			}		
    });
}

function sendMail(emailBody) {  
	var ses = new aws.SES({
		region: config.region
	});  
    var eParams = {
        Destination: {
            ToAddresses: [config.emailTo]
        },
        Message: {
            Body: {
                Text: {
                    Data: emailBody
                }
            },
            Subject: {
                Data: config.emailSubject
            }
        },
        Source: config.emailFrom
    };
    console.log('Sending Email...');
    var email = ses.sendEmail(eParams, function (err, data) {
        if (err) console.log(err);
        else console.log("Email Sent.");
    });
}

function ipHasChanged(addresses, callback){
	var emailBody = config.emailBody;
	emailBody = emailBody.replace("{$URL}", config.url);
	emailBody = emailBody.replace("{$LastIPs}", config.lastIP[0] + ", " + config.lastIP[1]);
	emailBody = emailBody.replace("{$CurrentIPs}", addresses[0] + ", " + addresses[1]);
	sendMail(emailBody);
	callback();
}

function saveConfig(data){
    var s3 = new aws.S3();
        var params = {
            Bucket : mybucket,
            Key : "config.json",
            Body : JSON.stringify(data),
			ContentType: "application/json"
        }
        s3.putObject(params, function(err, data) {
          if (err) console.log(err);         
        });
}

exports.handler = (event, context, callback) => {
	getConfig(function(){ //Load the config from S3 bucket
	    doDNS(function(addresses){ //Do the DNS call and check the result against the last one
			 ipHasChanged(addresses, function(){ //If it's changed, send the email
				config.lastIP[0] = addresses[0];
				config.lastIP[1] = addresses[1];
				saveConfig(config); //and update the config	
			    context.succeed(event); 
			});			 
		});	
	});
        
};




