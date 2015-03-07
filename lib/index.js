var PrimusNats = function(primus, options){
  primus._nats = options.nats;
  var Spark = primus.Spark;

  var prefix = options.pnatsPrefix || 'pnats#';

  Spark.prototype.join = function(room, receivecb) {
    var spark = this;
    primus._nats.subscribe(prefix+room, receivecb ? receivecb : function(msg, reply, subject){
      spark.write(msg);
    });
  };

  primus.emit = function(room, data) {
    primus._nats.publish(prefix+room, data);
  };
};

module.exports = PrimusNats;