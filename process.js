const fs = require('fs')
const path = './splitfiles/'
const pm2 = require('pm2')

let i = 0;
const ls = fs.readdirSync(path);

console.log(ls.length + " files")

for(let i = 0 ; i<2 ; i++){
  pm2.connect(function(err) {
    if(err) {
      console.log(err);
      process.exit(2);
    }
  });
  pm2.start({
    script: 'saveData.js'
  }, function(err, apps) {
      pm2.sendDataToProcessId({
       type: 'process:msg',
       data: ls[i],
       id: i ,// id of procces from "pm2 list"
       topic: 'some topic'
    }, function(err, res) {
       if (err)
        throw err;
      });
   });
    pm2.launchBus((err, bus) => {
     bus.on('process:msg', (packet) => {
       console.log(packet)
      packet.data.success.should.eql(true);
      packet.process.pm_id.should.eql(proc1.pm2_env.pm_id);
      done();
   });
  });
}
