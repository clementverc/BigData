const fs = require('mz/fs');
const streamToIterator = require('stream-to-iterator');
const { Schema } = mongoose = require('mongoose');
const shell = require('shelljs');

const url = 'mongodb://localhost:27017/bigData';

mongoose.Promise = global.Promise;
mongoose.set('debug', false);

const bigDataSchema = new Schema({
 siren: String,
 nic: String,
 siret: String,
 statutdiffusionetablissement: String,
 datecreationetablissement: Date,
 trancheeffectifsetablissement: String,
 anneeeffectifsetablissement: Date,
 activiteprincipaleregistremetiersetablissement: String,
 to_char: Date,
 etablissementsiege: Boolean,
 nombreperiodesetablissement: String,
 complementadresseetablissement: String,
 numerovoieetablissement: String,
 indicerepetitionetablissement: String,
 typevoieetablissement: String,
 libellevoieetablissement: String,
 codepostaletablissement: String,
 libellecommuneetablissement: String,
 libellecommuneetrangeretablissement: String,
 distributionspecialeetablissement: String,
 codecommuneetablissement: String,
 codecedexetablissement: String,
 libellecedexetablissement: String,
 codepaysetrangeretablissement: String,
 libellepaysetrangeretablissement: String,
 complementadresse2etablissement: String,
 numerovoie2etablissement: String,
 indicerepetition2etablissement: String,
 typevoie2etablissement: String,
 libellevoie2etablissement: String,
 codepostal2etablissement: String,
 libellecommune2etablissement: String,
 libellecommuneetranger2etablissement: String,
 distributionspeciale2etablissement: String,
 codecommune2etablissement: String,
 codecedex2etablissement: String,
 libellecedex2etablissement: String,
 codepaysetranger2etablissement: String,
 libellepaysetranger2etablissement: String,
 datedebut: Date,
 etatadministratifetablissement: String,
 enseigne1etablissement: String,
 enseigne2etablissement: String,
 enseigne3etablissement: String,
 denominationusuelleetablissement: String,
 activiteprincipaleetablissement: String,
 nomenclatureactiviteprincipaleetablissement: String,
 caractereemployeuretablissement: String
});

const BigData = mongoose.model('etablissement', bigDataSchema);

async function saveData(data) {
	try {
    	const conn = await mongoose.connect(url,{ useNewUrlParser: true }).then(
    		() => {console.log('Database is connected') },
    		err => { console.log('Can not connect to the database'+ err)}
		);
    	let stream = fs.createReadStream('splitfiles/'+data.csv)
    
    	const iterator = await streamToIterator(stream).init();

		let buffer = [],
	    count = 0;
	    let i =0;

	    for ( let docPromise of iterator ) {
	      let doc = await docPromise;
	      buffer.push(doc);
	      count++;
	      i++;
	      if ( count > 1000 ) {
	        await BigData.insertMany(buffer);
	        buffer = [];
	        count = 0;
	      }
	    }
	} catch(e) {
    	console.error(e)
    	console.log(e);
  	} finally {
    	shell.exec('rm -rf splitfiles/'+data.csv);
  	}
}

// receive message from master process
process.on('message', function(packet) {
  console.log('GET MESSAGE: ', packet.id);
  saveMultiple(packet);
  process.send({
      type: 'process:msg',
      data: {
        success: true
      }
    })
  
});