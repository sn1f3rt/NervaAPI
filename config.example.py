# Security
"""
The SECRET_KEY is used by Flask to encrypt session cookies.
It should be set to a random string to ensure security.

To generate a random string, you can use the following Python code:

>>> import secrets
>>> secrets.token_hex(32)
'ac786e22a4e76212cb4f1ab6f997f33dd36d33376d65b817898b65c04ea8c498'

The above code generates a random 32-character hexadecimal string.
"""

SECRET_KEY = "secret_key"

# Analytics
"""
The ANALYTICS_ENABLED is a boolean flag that determines whether analytics tracking is enabled. 
If set to True, the application will  allow the /analytics endpoints to be used. 
Requires the MongoDB database to be set up and the MONGODB_URI and MONGODB_DB to be set correctly.

To disable analytics tracking, set ANALYTICS_ENABLED to False.
"""

ANALYTICS_ENABLED = False

# Nerva Daemon
"""
The DAEMON_RPC_HOST is the IP address or hostname of the Nerva daemon.
The DAEMON_RPC_PORT is the port number of the Nerva daemon RPC interface.
The DAEMON_RPC_SSL is a boolean flag that determines whether to use SSL for the RPC connection.

By default, the Nerva daemon RPC interface is not encrypted, so DAEMON_RPC_SSL should be set to False.
If you are running the daemon on a remote server, you may want to set DAEMON_RPC_HOST to the IP address of the server.
"""

DAEMON_RPC_HOST = "localhost"
DAEMON_RPC_PORT = 17566
DAEMON_RPC_SSL = False

# Database
"""
The MONGODB_URI is the connection string for the MongoDB database. 
It should be set to the URI of your MongoDB database.

The MONGODB_DB is the name of the database that will be used by the application. 
It should be set to the name of your MongoDB database.

The simplest way to set up a MongoDB database is to use MongoDB Atlas. 
You can sign up for a free account at https://www.mongodb.com/cloud/atlas. 
After signing up, you can create a new cluster and then create a new database 
user with read and write access to the database. You can then get the connection string 
for your database by clicking on the "Connect" button in the MongoDB Atlas dashboard.

The connection string will look something like this: 

mongodb+srv://username:password@cluster_name.syqll.mongodb.net/?retryWrites=true&w=majority&appName=cluster_name

You should replace the username, password, and cluster_name with your own values.
"""

MONGODB_URI = (
    "mongodb+srv://username:password@localhost/NervaAPI"
    "?retryWrites=true&w=majority&appName=NervaAPI"
)
MONGODB_DB = "NervaAPI"

# Market
"""
Leave as is in production.
"""

NONKYC_MARKET_PAIRS = ["XNV-USDT", "XNV-XMR"]
CEXSWAP_MARKET_PAIRS = ["XNV-BTC", "XNV-XMR"]

# Development
"""
Leave as is in production.
"""

TEMPLATES_AUTO_RELOAD = False
