# nxt2itsm

Nexthink score to ITSM solutions (reworked with Arie Joose and Alain Bernard)

Displays Nexthink scores per device in HTML.

The purpose of this package is to provide a connector between Nexthink engines and ITSM tooling, like TOPdesk. It is not limited to this ITSM platform, but the initial version is targeted for TOPdesk.

# Requirements

The Appliance on which this tool will be installed has the following hardware requirements:

- 2 CPU Cores
- 2 GB of RAM
- 20 GB of disk space

In term of connectivity, this Appliance needs to have access to:

- API of the Engine Appliance(s) (port 1671 if default was kept).
- Portal API to retrieve Engines.
- Remote Action API of the Portal Appliance.

# Usage 

Create a new tab in the ITSM tool and have it display the following link: "https://appliance_fqdn/device/device_name"

Where device_name is a Windows PC name in Nexthink. This must be configured in the ITSM tool.

The pattern in red, yellow and green colors will be derived from a score.xml file that must be available in all Nexthink engines and must be placed in the scores/ folder.

The score.xml may contain Nexthink act links.

# Installation

The application is a nodejs application and can be installed on any devices with nodejs installed.

However the following installations instructions were done based on a Nexthink ISO.

If you are not familiar with CentOS firewalls, switch it off:

	sudo systemctl disable firewalld
	sudo systemctl stop firewalld

### For an online installation:

Install the different necessary components:

	sudo yum install git -y

Install pm2 and also download the different files from the git repository:

	sudo npm -g install pm2
	npm install nexthink-stuff/nxt2itsm#saml-auth

Make sure pm2 will autostart after a reboot:

	sudo pm2 startup systemd

The solution is now installed in /home/nexthink/node_modules/nxt2itsm. Go to the configuration section for the next steps.

### For an offline installation:

TODO

# Configuration

Most of the configuration will be done in the config/config.js file. Please review this file before starting the application.

Here are some important points:

- The different score files need to be in the scores/ folder.
- The certificates need to be put in place (or created if selfsigned) in the ssl/ folder. The files in this folder upon installation are simply examples.

You need to have 3 files in the ssl/ folder: 

- the certificate file
- the associated key
- the bundle of CA certificates

The CA bundle should have the different intermediate certificates so that the full certificate chain can be trusted.

The name of the files, can be configured in the .env file.

In case you need to generate self-signed certificate for the Appliance, you can use the following commands:

	cd /home/nexthink/node_modules/nxt2itsm/ssl/
	sudo rm -f *.pem
	sudo openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout key.pem -out cert.pem

# Running the application

Once the configuration is done, start pm2 and then the app.js from the /home/nexthink/node_modules/nxt2itsm folder with the following commands:

	sudo systemctl start pm2-root
	sudo pm2 start nxt2itsm-pm2.json
	sudo pm2 save
  

The logs will be located in /home/nexthink.

The following commands can help for troubleshooting too:

	pm2 list -> show the list of application running under pm2
	pm2 show id -> replace "id" by the id from the list command to see the details of the specific application
	pm2 restart id -> to restart a specific application
