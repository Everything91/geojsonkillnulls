var fs = require('fs');


module.exports = function(fiIn, fiOut){
    // to hold the string that will before all the features and what will come after.
    var fiStart = '';
    var fiEnd = '';


    var onFeats;

    // if at the end of a given blob there's an incomplete feature leave it in xtraFeats
    var extraFeats;

    var readStream = fs.createReadStream(fiIn)

    var writeStream = fs.createWriteStream(fiOut)


    readStream.on('data', (d, err) => {
      var dstring = d.toString();
      console.log(d.toString())
      if(fiStart.length <= 0){
        firstChunk(dstring)
      }

    } )



    readStream.on('error', function(err){
        console.log('fuooey there was an err reading the file it is: ', err)
    })



    readStream.on('end', function(){

      console.log('the file is done being read, ')
      //console.log('the err is ', err)
    })


    //var geoObj = JSON.parse(geojson);
  function firstChunk(dstr){

    var matStart = dstr.match(/"type":\s?"Feature"/)
      var geoStarter ;

    try{
      geoStarter = matStart.index
    }
    catch(e){

      console.log('error finding the start of features', e)
    }


    fiStart = dstr.slice(0, geoStarter + ('features": [').length +1);


    var featuresCutting = dstr.slice( -(dstr.length - (geoStarter + ('features":[').length ) ))

    console.log('later feats', featuresCutting);

    var splitfeat = featuresCutting.split(/"type":\s?"Feature",/);

    console.log(splitfeat.length)
    // iff it's the end of the file so something or

    for(i in splitfeat){

      console.log('onefeat', splitfeat[i])
    }

    if(  false){
        
    }


  }


}
