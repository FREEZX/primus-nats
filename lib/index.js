var PrimusNats = function(primus, options){
  primus._nats = options.nats;
  var Spark = primus.Spark;

  var prefix = options.pnatsPrefix || 'pnats#';

  Spark.prototype.join = function(room, receivecb) {
    var spark = this;
    spark._sids = spark._sids || {};
    if(spark._sids[room]){
      //Already in room
      return;
    }
    var nroom = prefix+room;
    var sid = primus._nats.subscribe(nroom, receivecb ? function(msg, reply, subject){
      receivecb(JSON.parse(msg), reply, subject)
    } : function(msg, reply, subject){
      spark.write(JSON.parse(msg));
    });
    if(!spark._pnatsInit){
      spark.on('end', function(){
        this.leaveAll();
      });
    }
    spark._sids[room] = sid;
    spark._pnatsInit = true;
  };

  Spark.prototype.leave = function(room, receivecb) {
    var spark = this;
    spark._sids = spark._sids || {};
    var sid = spark._sids[room];
    delete spark._sids[room];
    primus._nats.unsubscribe(sid);
  };

  Spark.prototype.leaveAll = function() {
    var spark = this;
    var keys = Object.keys(spark._sids);
    for(var i=0; i<keys.length; ++i){
      primus._nats.unsubscribe(spark._sids[keys[i]]);
    }
  };

  primus.broadcast = function(room, data) {
    primus._nats.publish(prefix+room, JSON.stringify(data));
  };
};

module.exports = PrimusNats;