var ntwitter = require("ntwitter"),
    events = require('events');


function merge(defaults, options) {
  defaults = defaults || {};
  if (options && typeof options === 'object') {
    var keys = Object.keys(options);
    for (var i = 0, len = keys.length; i < len; i++) {
      var k = keys[i];
      if (options[k] !== undefined) defaults[k] = options[k];
    }
  }
  return defaults;
}


// for us to do a require later
module.exports = TDTwitterStream;

function TDTwitterStream(options) {
  if (!(this instanceof TDTwitterStream)) return new TDTwitterStream(options);
  events.EventEmitter.call(this);

  var self = this;

  var defaults = {
    auth: {
      consumer_key: null,
      consumer_secret: null,
      access_token_key: null,
      access_token_secret: null,
    },

    follow: []
  };


  this.options = merge(defaults, options);

  // Set up our ntwitter connection
  this.twit = new ntwitter(this.options.auth);
  this.twit.stream('site', {follow: this.options.follow}, function(stream) {
      stream.on('data', function (data) {
        
        var m = data.message;
        // Emit the relevant events

        // On connection we get a friends list
        if (typeof m.friends != "undefined")
        {
          self.emit("connect", data.for_user, m);
          return;
        }

        // Some form of event
        if (typeof m.event != "undefined")
        {
          

          var mto = m.target_object;

          /* FAVORITES */
          if (m.event == "favorite")
          {
            if (m.target.id_str == data.for_user)
            {
              self.emit("favorited", data.for_user, mto);
            }
            else
            {
              self.emit("favorite", data.for_user, mto);
            }
            
            return;
          }

          if (m.event == "unfavorite")
          {
            if (m.target.id_str == data.for_user)
            {
              self.emit("unfavorited", data.for_user, mto);
            }
            else
            {
              self.emit("unfavorite", data.for_user, mto);
            }

            return;
          }

          /* FOLLOWS */
          if (m.event == "follow")
          {

            if (m.target.id_str == data.for_user)
            {
              self.emit("followed", data.for_user, m.target);
            }
            else
            {
              self.emit("follow", data.for_user, m.target);
            }
            

            return;
          }

          if (m.event == "unfollow")
          {
            self.emit("unfollow", data.for_user, m.target);
            return;
          }


          /* USER */
          if (m.event == "user_update")
          {
            self.emit("user_update", data.for_user, mto);
            return;
          }


          /* LISTS */
          if (m.event == "list_created")
          {
            self.emit("list_created", data.for_user, mto);
            return;
          }

          if (m.event == "list_updated")
          {
            self.emit("list_updated", data.for_user, mto);
            return;
          }

          if (m.event == "list_destroyed")
          {
            self.emit("list_destroyed", data.for_user, mto);
            return;
          }

          if (m.event == "list_member_added")
          {

            if (m.target.id_str == data.for_user)
            {
              self.emit("added_to_list", data.for_user, m.target);
            }
            else
            {
              self.emit("list_member_added", data.for_user, m.target);
            }

            return;
          }

          if (m.event == "list_member_removed")
          {
            if (m.target.id_str == data.for_user)
            {
              self.emit("removed_from_list", data.for_user, m.target);
            }
            else
            {
              self.emit("list_member_removed", data.for_user, m.target);
            }

            return;
          }

          if (m.event == "unblock")
          {
            self.emit("unblock", data.for_user, m.target);
          }

        }

        // On tweet delete/unretweet
        if (typeof m.delete != "undefined")
        {
          self.emit("delete", data.for_user, m.delete.status.user_id_str, m.delete.status.id_str);
          return;
        }

        // On tweet
        if (typeof m.text != "undefined")
        {

          // Is it a retweet?
          if (typeof m.retweeted_status != "undefined")
          {
            if (m.retweeted_status.in_reply_to_user_id_str == data.for_user)
            {
              self.emit("retweet_mention", data.for_user, m);
            }

            if (m.retweeted_status.user.id_str == data.for_user)
            {
              self.emit("retweeted", data.for_user, m.retweeted_status);
            }
            else
            {
              self.emit("retweet", data.for_user, m.retweeted_status);
            }
            
            return;
          }


          if (m.in_reply_to_user_id_str == data.for_user)
          {
            self.emit("mention", data.for_user, m);
          }

          if (m.user.id_str == data.for_user)
          {
            self.emit("own_tweet", data.for_user, m);
          }
          
          // It's still a tweet
          self.emit("tweet", data.for_user, m);

          return;

        }


        // Some event we haven't caught yet
        self.emit("unknown_data", data);

/*
@TODO
block - no event fired
access_revoked
access_unrevoked
*/

      });
  });
}


TDTwitterStream.super_ = events.EventEmitter;
TDTwitterStream.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: TDTwitterStream,
        enumerable: false
    }
});
