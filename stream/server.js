/*
 * Inspired by: http://stackoverflow.com/questions/4360060/video-streaming-with-html-5-via-node-js
 */

var http = require('http'),
    fs = require('fs'),
    util = require('util'),
    Transcoder = require('./stream-transcoder');

http.createServer(function (req, res) {

    var params = req.url.split('?')[1];

    if (!params) {
        return;
    }

//    console.log(req.url);

    params = params.split('&');


//    var path = '/media/daten/Filme/Aufnahmen/TV-Serien/Mob_City/S01E01.A_Guy_Walks_Into_a_Bar..#2E/2013-12-29.20.15.675-0.rec/00001.ts';

    var path = decodeURIComponent(params[0].split('=')[1]) + '/00001.ts';


//	path = "/media/daten/Filme/Aufnahmen/Dokus/Expeditionen_ins_Tierreich/Das_Great_Barrier_Reef_(2~3)/2014-03-12.20.15.3-0.rec/00001.ts";
/*
    var ffmpeg = '/usr/bin/avconv -f mpegts -i ' + path + ' -threads 2 -filter:v "scale=iw*min(480/iw\\,270/ih):ih*min(480/iw\\,270/ih), pad=480:270:(480-iw*min(480/iw\\,270/ih))/2:(270-ih*min(480/iw\\,270/ih))/2, yadif"  -vcodec libx264 -maxrate 1024K -bufsize 1024K -acodec libmp3lame -b:a 128K -ar 44100 -ac 2 -async 50 -f mpegts pipe:1'



    var stat = fs.statSync(path);
    var total = stat.size;
    if (req.headers['range']) {
        var range = req.headers.range;
        var parts = range.replace(/bytes=/, "").split("-");
        var partialstart = parts[0];
        var partialend = parts[1];

        var start = parseInt(partialstart, 10);
        var end = partialend ? parseInt(partialend, 10) : total-1;
        var chunksize = (end-start)+1;
        console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

//        var file = fs.createReadStream(ffmpeg, {start: start, end: end});
//        res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });

*/
        res.writeHead(200, { 'Content-Type': 'video/webm' });

        req.on("close", function () {
            console.log('Client hung up');

            if ("function" === typeof transcoder.stop) {

                transcoder.stop();
            }
        });

        var transcoder = new Transcoder(path)

        transcoder
	    //.threads(4)
//            .maxSize(480, 270)
            .canvasSize(480, 270)
            //.videoCodec('libx264')
            .videoCodec('libvpx')
            //.videoBitrate(800 * 1000)
            .videoBitrate(400 * 1000)
	        .custom('deadline', 'realtime')
            .fps(25)
            //.audioCodec('libmp3lame')
            .audioCodec('libvorbis')
            .sampleRate(44100)
            .channels(2)
            .audioBitrate(128 * 1000)
            //.audioBitrate(64 * 1000)
            //.format('flv')
            .format('webm')
//            .on('finish', function() {
//                next();
//            })
            .stream().pipe(res);


//        file.pipe(res);
  
/*  } else {
        console.log('ALL: ' + total);
        res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mpeg' });
        fs.createReadStream(path).pipe(res);
    }
*/
}).listen(1337, '192.168.3.99');
console.log('Server running at http://127.0.0.1:1337/');
