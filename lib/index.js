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
    var sid = primus._nats.subscribe(nroom, receivecb ? receivecb : function(msg, reply, subject){
      spark.write(msg);
    });
    spark._sids[room] = sid;
  };

  Spark.prototype.leave = function(room, receivecb) {
    var spark = this;
    spark._sids = spark._sids || {};
    var sid = spark._sids[room];
    delete spark._sids[room];
    primus._nats.unsubscribe(sid);
  };

  primus.emit = function(room, data) {
    primus._nats.publish(prefix+room, data);
  };
};

module.exports = PrimusNats;