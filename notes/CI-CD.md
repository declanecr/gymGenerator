the purpose of continuous integration/deployment is to set guard rails on a repo; so that anytime a test app is attempted to be deployed, it goes through a set of tests/actions to ensure that, basically the code isn't fucked up in any way

bridges end user and source

whats my branch strategy? (how many environemnts)

everytime you chagne anything in the current 

eventually i should consider move static things (like images) to separate server

what am i putting IN to CI, and what is the end result

how do i want 

BUILD AND DEPLOY

look for nodejs hekroku pipeline on github actions

STEP 1: setup hello world CI

# MEETING WITH CALEB
- next CI step is deployment
	- can do that in a GHA (github action)
- Post Deployment validation
	- have a few checks that run to check endpoints and such
- next is rollbacks
	- if you deploy somehting and it fails , how do you undeploy and redploy previous artifact
- being able to that automated (that's hard to do)
- SYSTEM DESIGN
	- big database would be accessed via something like "reddis" which actually accesses database and caches to prevent having to go all the way through ot the databse again
		- Axios may have caching options
- LOAD TESTING - using tons of fake users to see if app can handle it
	- SCALING - configure at what point does your app scale up or down based on number of users
- PRODUCTIONALIZATION - getting ready for PROD