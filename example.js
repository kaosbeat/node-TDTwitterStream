var stream = require('./TDTwitterStream');

var twit = new stream({
	auth: {
	    consumer_key: "",
	    consumer_secret: "",
	    access_token_key: "",
	    access_token_secret: "",
	},

    follow: ['1234567','123456789123']
});

twit

.on("connect", function(recipient, data){
	console.log("Connected");
})
.on("favorite", function(recipient, data){
	console.log("You favorited a tweet");
})
.on("favorited", function(recipient, data){
	console.log("Someone favourited one of your tweets");
})
.on("unfavorite", function(recipient, data){
	console.log("You unfavourited a tweet");
})
.on("unfavorited", function(recipient, data){
	console.log("Someone unfavourited one of your tweets");
})
.on("follow", function(recipient, data){
	console.log("You followed someone");
})
.on("followed", function(recipient, data){
	console.log("Someone followed you");
})
.on("unfollow", function(recipient, data){
	console.log("You unfollowed someone");
})
.on("user_update", function(recipient, data){
	console.log("You updated your profile");
})
.on("list_created", function(recipient, data){
	console.log("You created a list");
})
.on("list_updated", function(recipient, data){
	console.log("You updated a list");
})
.on("list_destroyed", function(recipient, data){
	console.log("You destroyed a list");
})
.on("added_to_list", function(recipient, data){
	console.log("Someone added you to a list");
})
.on("list_member_added", function(recipient, data){
	console.log("You added someone to a list");
})
.on("removed_from_list", function(recipient, data){
	console.log("You were removed from a list");
})
.on("list_member_removed", function(recipient, data){
	console.log("You removed someone from a list");
})
.on("block", function(recipient, data){
	console.log("You blocked someone");
})
.on("unblock", function(recipient, data){
	console.log("You unblocked someone");
})
.on("delete", function(recipient, data){
	console.log("Tweet Deleted");
})
.on("retweet_mention", function(recipient, data){
	console.log("Someone retweeted a mention of you");
})
.on("retweeted", function(recipient, data){
	console.log("Someone retweeted you");
})
.on("retweet", function(recipient, data){
	console.log("You retweeted someone");
})
.on("mention", function(recipient, data){
	console.log("Someone mentioned you");
})
.on("own_tweet", function(recipient, data){
	console.log("You tweeted");
})
.on("tweet", function(recipient, data){
	console.log("OH LOOK A TWEET!");
});
