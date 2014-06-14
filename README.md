# Rent-a-Coder

A demo for diffeerent electronic payment methods.


### Requirements

- NodeJS v0.10+
- NPM v1.4+
- Bower 1.3+ (Yeoman works too)


### Installation

Clone the repo, open the command line and navigate to the repo folder.

Run ```npm install``` then change directories to the ```public``` folder and run ```bower install```.

Optionally, if you need some mock records (which I bet you will) run ```npm run-script mock-records```. Beware that this will wipe out any information on the DB.



## Demos

[ Paypal's Buy Now ]( https://github.com/reneolivo/rent-a-coder/tree/dev/paypal/buy-now )

[ Paypal's Custom Cart ]( https://github.com/reneolivo/rent-a-coder/tree/dev/paypal/custom-cart )

[ Authorize.net Customer Information Manager ]( https://github.com/reneolivo/rent-a-coder/tree/dev/authorize/cim )

### Tech:

[ Express ]( http://expressjs.com ): A NodeJS web server framework.

[ NeDB ]( https://github.com/louischatriot/nedb ): A mongo like, portable database.

[ Auth-net-cim ]( https://github.com/durango/authorize-net-cim ): A service that helps accessing, storing and removing Authorize.net data for the Customers Information Manager.

### Acknowledgements

Pseudo random data: http://randomuser.me

Models: https://www.flickr.com/photos/gregpc/

