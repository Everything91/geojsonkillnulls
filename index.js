var fs = require('fs');


module.exports = function(fiIn, fiOut){
    // to hold the string that will before all the features and what will come after.
    var fiStart = '';
    var fiEnd = '';


    var onFeats;

    // if at the end of a given blob there's an incomplete feature leave it in xtraFeats
    var extraFeats =  '';

    var readStream = fs.createReadStream(fiIn)

    var writeStream = fs.createWriteStream(fiOut)


    readStream.on('data', (d, err) => {
      var dstring = d.toString();
    //  console.log(d.toString())
      if(fiStart.length <= 0){
        firstChunk(dstring)

        fiStart = 'blah';
      }
      else{
        nextChunks(dstring);
      }

    } )



    readStream.on('error', function(err){
        console.log('fuooey there was an err reading the file it is: ', err)
    })



    readStream.on('end', function(){

      writeStream.write('\n\]\n\}')
      console.log('the file is done being read, ')
      //console.log('the err is ', err)
    })



    //var geoObj = JSON.parse(geojson);
  function firstChunk(dstr){

    var parFeats = [];

    var matStart = dstr.match(/"type":\s?"Feature"/)
      var geoStarter;

    try{
      geoStarter = matStart.index
      console.log(' hey the start is ', geoStarter);
    }
    catch(e){

      console.log('error finding the start of features', e)
    }


    // gives the start of the file until right before the features.
    // need to make more flexible so a bunch of different file types can be used
    fiStart = dstr.slice(0, geoStarter - 2)// - ('features": [ "type":\s?"Feature"').length );

    console.log('start of file is ' + fiStart + '\n And done with start of fi')
// writing the beginning of the file
    writeStream.write(fiStart);


    var featuresCutting = dstr.slice( -( dstr.length - (geoStarter )) )

  //  console.log('later feats', featuresCutting);

    console.log('feats done')

    // could probably make this a litte more flexible.
    var splitfeat = featuresCutting.split(/{\n?\s?"type":\s?"Feature",/);

    console.log(splitfeat.length)
    // iff it's the end of the file so something or
    // split included an extra element at the beginning so it's now off of there
  //  splitfeat.shift();

    for(i in splitfeat){

      var oby;

      console.log('on feat  ' + i ) //, splitfeat[i])

    //  console.log( '"type": "Feature", ' + splitfeat[i])

      var insp;
      var endbl = splitfeat[i].trim().slice(-5);


      //console.log('last thing: ' + endbl)

  //    console.log('to match ' + endbl);


      if(  endbl.match(/\}\s?\},\n?/) ){

        //endbl =  endbl.slice(0, -2);

        insp = "{" + splitfeat[i].trim();



        console.log('tis an obj');

        try{

          oby = JSON.parse(insp.slice(0, -1))
          oby =loseNulls(oby);
        //  parFeats.push(oby);
        writeStream.write(JSON.stringify(oby) + ',\n');



        }
        catch(e){
          console.log('make sure all the features are ok or fix the regex above so it will work if it should!')
          console.log(e)
        }


      //  console.log('hey booi', oby);

      }
      // if the this part finishes off the file figure it out
      else if( endbl.match(/\}\n?\]\n?\}/)  ) {

        insp = "{" + splitfeat[i].trim();


        console.log('the end of the file')

        console.log(insp.slice(0, -2));

        try{
          // need to figure out a good way to see where the end of file stuff starts and cut there.

        //  console.log(insp.match(/\}\n?\]\n?\}/))
          oby = JSON.parse(insp.slice(0, -3))
          oby = loseNulls(oby);
          writeStream.write(JSON.stringify(oby));

        }
        catch(e){
          console.log('make sure all the features are ok or fix the regex above so it will work if it should!\nSomething went wrong with the end of the file')
          console.log(e)
        }


      }

      else {
          // Add an incomplete obj to a global string to work with in nextChunks

          extraFeats = splitfeat[i]
      }

      //console.log('so i can stringify and write ', JSON.stringify(oby))

    }

// Still n


  }

  function nextChunks(dstr){

    //combine with previous extra
    var comDat = extraFeats + dstr;



    var splitfeat = comDat.split(/{\n?\s?"type":\s?"Feature",/);
    var insp ;


    console.log('now i gotta deal with', splitfeat);


        for(i in splitfeat){

          var oby;

          console.log('on feat  ' + i + '  '+ splitfeat[i] + '\n');



        //  console.log( '"type": "Feature", ' + splitfeat[i])


          var endbl = splitfeat[i].trim().slice(-5);
          //console.log('last thing: ' + endbl)

      //    console.log('to match ' + endbl);


          if(  endbl.match(/\}\s?\},\n?/) ){

            insp = "{" + splitfeat[i].trim();

        //    endbl =  endbl.slice(-(2));

        //    console.log('tis an obj i ho ', endbl);



            try{

              console.log(insp.lastIndexOf(','))


              oby = JSON.parse(insp.slice(0, -1))
              oby = loseNulls(oby);
            //  parFeats.push(oby);
            writeStream.write(JSON.stringify(oby) + ',\n');



            }
            catch(e){
              console.log('make sure all the features are ok or fix the regex above so it will work if it should!')
              console.log(e)
            }


          //  console.log('hey booi', oby);

          }
          // if the this part finishes off the file figure it out
          else if( endbl.match(/\}\n?\]\n?\}/)  ) {

            insp = "{" + splitfeat[i].trim();


            console.log('Last obj of the blob \n')

            console.log(insp.slice(0, -4));

            try{
              // need to figure out a good way to see where the end of file stuff starts and cut there.

            //  console.log(insp.match(/\}\n?\]\n?\}/))
              oby = JSON.parse(insp.slice(0, -3))
              oby = loseNulls(oby);
              writeStream.write(JSON.stringify(oby));

            }
            catch(e){
              console.log('make sure all the features are ok or fix the regex above so it will work if it should!\nSomething went wrong with the end of the file')
              console.log(e)
            }


          }

          else {
              // Add an incomplete obj to a global string to work with in nextChunks
              extraFeats = dstr
          }




          }


  }

  function loseNulls(featOb) {
    console.log('losing nulls')
    var blah = featOb
    var feKeys = Object.keys(featOb.properties);
    for( i in feKeys){

      if(blah.properties[feKeys[i]] === null){
    //    console.log('need to get rid of', feKeys[i])
        delete featOb.properties[feKeys[i]]
      }

    }

  //  console.log(featOb)
    return featOb;

  }


}
