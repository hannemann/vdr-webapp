#!/bin/bash
#
# externremux.sh

### GENERAL CONFIG START
###
# Pick one of DSL/WLAN
QUALITY="DSL1000"
TYPE=mpeg
CHANNELS=2
DEBUG=1
RAND=${RANDOM:-$$}
PID=$$
FIFO=/tmp/externremux-${PID}
FPS=25
AUDIO_STREAM=0
AUDIO_CHANNELS=2
declare -A HEADER=()
###
### GENERAL CONFIG END

# The following parameters are recognized:
#
# PROG   actual remux program
# VC     video codec
# VBR    video bitrate (kbit)
# VOPTS  custom video options
# WIDTH  scale video to width
# HEIGHT scale video to height
# FPS    output frames per second
# AC     audio codec
# ABR    audio bitrate (kbit)
# AOPTS  custom audio options
#


function log {

	if [ "$DEBUG" = 1 ]; then
		logger -t "vdr: EXTERNREMUX" "$1"
	fi
}

function error
{
        if [ "$SERVER_PROTOCOL" = HTTP ]; then
                echo -ne "Content-type: text/plain\r\n"
                echo -ne '\r\n'
                echo "$*"
        fi

        echo "$*" >&2
        exit 1
}

###
#
# perform sanity checks
#
###
PROG=$(which ffmpeg)
[ -x ${PROG} ] || PROG='/opt/ffmpeg/bin/ffmpeg'
[ -x ${PROG} ] || PROG=$(which avconv)

if [ ! -x ${PROG} ]; then
	error 'No ffmpeg binary found'
	exit 1;
fi

getParentPid () { ps -p $1 -o ppid=; }
getChildPids () { ps --ppid $1 -o pid=; }
getRequestId () { echo $(echo $QUERY_STRING | egrep --color=none -o "d=[0-9]+" | cut -d'=' -f2);  }


log "Remote: $REMOTE_ADDR"
log "Rand: $RAND"
log "PID: $PID"
log "VPID: $REMUX_VPID"
log "ParentPid: $(getParentPid $$)"
log "Request id: $(getRequestId)"

###
 # deactivated experiment to kill other remux processes
###
if grep "$REMOTE_ADDR" /tmp/externremux-env-* > /dev/null && [ 2 = 1 ]; then
	log "Already streaming to client $REMOTE_ADDR"
	for i in  $(grep -H "$REMOTE_ADDR" /tmp/externremux-env-* | cut -d: -f1 |cut -d- -f3); do 
		log "Found PID: $i"

		if ! egrep "QUERY_STRING.*d=$(getRequestId)" /tmp/externremux-env-${i}; then
			log "Found stream to kill within pid $i"
#			log "kill parent process $(getParentPid $i)"
#			kill -1 $(getParentPid $i) 
#			for n in $(getChildPids $i); do
#				log "kill child process $n"
#				kill -1 $n
#			done
		fi
	done
fi



ENV=/tmp/externremux-env-${PID}
#echo '' ${ENV}
printenv >> ${ENV}

###
 # check if user agent is chromecast
###
echo $HTTP_USER_AGENT | grep CrKey > /dev/null && CHROMECAST=1 || CHROMECAST=0

echo ${PATH_INFO##*\/} | grep '.rec' > /dev/null && RECORDING=1 || RECORDING=0

log "Is Chromecast: $CHROMECAST"

function sendHeaders {

	if [ "$SERVER_PROTOCOL" = HTTP ]; then
		# send content-type and custom headers
		log "Sending header: Content-type: ${CONTENTTYPE}"
		echo -ne "Content-type: ${CONTENTTYPE}\r\n"
		for header in "${HEADER[@]}"; do 
			log "Sending header: $header"
			echo -ne "$header\r\n"; 
		done
		echo -ne '\r\n'

		# abort after headers
		[ "$REQUEST_METHOD" = HEAD ] && exit 0
	fi
}

###
 # use fifo
###
function startFifo {

	log "Create FIFO"
	# create FIFO and read from it in the background
	COMMAND=${COMMAND/-i/-i - 0<&3}
	COMMAND=${COMMAND}" -y $FIFO"
	mkfifo "$FIFO"
	trap "trap '' EXIT HUP INT TERM ABRT PIPE CHLD; kill -INT 0; sleep 1; fuser -k '$FIFO'; rm '$FIFO'; rm '$ENV'" EXIT HUP INT TERM ABRT PIPE CHLD
	cat "$FIFO" <&- &
	exec 3<&0
}

###
 # dont use fifo
###
function startPipe {

	log "omit fifo"
	COMMAND=${COMMAND/-i/-i -}
	COMMAND=${COMMAND}" pipe:1"
	trap "trap '' EXIT HUP INT TERM ABRT PIPE CHLD; kill -INT 0; sleep 1; rm '$ENV'" EXIT HUP INT TERM ABRT PIPE CHLD
}

###
 # just pipe out
###
function remux_cat {

	sendHeaders
	startFifo
	cat 0<&3 >"$FIFO" 
}

###
 # use ausio codec mp3
###
function audioLame {

	log "Set Audio codec mp3"
	AUDIO="libmp3lame -b:a ${ABR} -ar 44100 -ac ${AUDIO_CHANNELS} -async 50"
}

###
 # use audio codec vorbis
###
function audioVorbis {

	log "Set Audio codec vorbis"
	AUDIO="libvorbis -b:a ${ABR} -ar 44100 -ac ${AUDIO_CHANNELS} -async 50"
}

###
 # use audio codec aac
###
function audioAac {

	log "Set audio codec aac"
	AUDIO="aac -q 500 -ac $AUDIO_CHANNELS -strict -2"
#	AUDIO="libfdk_aac -vbr 5 -channels 6"
#	AUDIO="libopus -vbr on -compression_level 10"
#	AUDIO="libvorbis -b:a ${ABR} -ar 76800 -ac 6 -async 50"
}

###
 # set scaling filter
 #
 # @see https://trac.ffmpeg.org/wiki/Scaling%20%28resizing%29%20with%20ffmpeg
###
function setDeinterlace {

	YADIF=', yadif'
}

function setFilter {

	log "Set filters"

	FILTER=''

	if ( [ "$WIDTH" != "" ] && [ "$HEIGHT" != "" ] ) || [ "$DEINTERLACE" != "" ]; then

		if [ "$WIDTH" != "" ] && [ "$HEIGHT" != "" ]; then

			FILTER="-filter:v "
			FILTER=${FILTER}" \"scale=sar*iw*min($WIDTH/iw\,$HEIGHT/ih):ih*min($WIDTH/iw\,$HEIGHT/ih), pad=$WIDTH:$HEIGHT:($WIDTH-iw*min($WIDTH/iw\,$HEIGHT/ih))/2:($HEIGHT-ih*min($WIDTH/iw\,$HEIGHT/ih))/2"
			FILTER=${FILTER}${YADIF}
			FILTER=${FILTER}'"'
		fi


	fi
	#Läuft nicht mit VLC
	#VSIZE="scale=trunc(oh*a/2)*2:$HEIGHT"
	#VSIZE="scale=-1:$HEIGHT"

	#FILTER="-filter:v \"${VSIZE}, yadif\" -filter:a \"volume=1\""
	#FILTER="-filter:v \"${VSIZE} yadif\""
}

function setHeaders {

	log "Setting download headers"

	DURATION=120000
	DURATION=${REMUX_PARAM_DUR:-$DURATION}
	FILENAME="foo.webm"
	FILENAME=${REMUX_PARAM_FILENAME:-$FILENAME}

	HEADER[connection]="Connection: keep-alive"
	HEADER[duration]="X-Content-Duration: $DURATION"
	HEADER[disposition]="Content-Disposition: attachment; filename=\"$FILENAME\""
	HEADER[description]="Content-Description: File Transfer"
	HEADER[expires]="Expires: 0"
	HEADER[cachecontrol]="Cache-Control: must-revalidate"
	HEADER[pragma]="Pragma: public"
	HEADER[acceptranges]="Accept-Ranges: bytes"
	HEADER[accesscontrol]="Access-Control-Allow-Origin: *"
}

function setContentLength {
	log "Setting length header"
	HEADER[contentlength]="Content-Length: 20000000000"
}

function containerMatroska {
	log "set container format matroska"
	CONTAINER="-f matroska"
}

function containerWebm {
	log "set container format webm"
	CONTAINER="-f webm"
}

function containerMp4 {
	log "set container format mp4"
	CONTAINER="-f mp4"
}

function containerMpegTs {
	log "set container format mpegts"
	CONTAINER="-f mpegts"
}

function containerFlv {
	log "set container format mpegts"
	CONTAINER="-f flv"
}
###
 # remux using libvpx and webm
 # works good with Chrome HTML video
 #
 # @see http://trac.ffmpeg.org/wiki/Encode/VP8
###
function remux_vpx {

	log "Set video codec libvpx, container webm"
	THREADS="-threads 2"
	MAP=""
	VENC="-c:v libvpx -qmin 0 -qmax 50 -crf 5 -b:v ${VBR} -deadline realtime -bufsize 128M"
	AENC="-c:a ${AUDIO}"
	COMMAND=${PROG}" -i ${THREADS} ${MAP} ${FILTER} ${FPS:+-r $FPS} ${VENC} ${AENC} ${CONTAINER}"
	STREAMTYPE=pipe
}

function remux_preview {
	log "remuxing preview"
	VENC="-c:v libvpx -crf 10 -b:v ${VBR} -deadline realtime -bufsize 128M"
	AENC="-an"
	FILTER="-vf \"select='eq(pict_type\\,I)',scale=$WIDTH:$HEIGHT\""
	COMMAND=${PROG}" -i ${FILTER} -r 1 ${VENC} ${AENC} ${CONTAINER}"
	STREAMTYPE=pipe
}

function pipe_previewfile {

	cat 0<&3 > /dev/null
	$SIZE=$(stat -c %s $1)
	DURATION=${REMUX_PARAM_DUR:-$DURATION}
	setHeaders
	HEADER[contentlength]="Content-Length: $SIZE"
	COMMAND=${PROG}" -i $1 -c:v copy -an -f webm"

}
###
 # remux using libx264
 # works well with vlc
###
function remux_x264 {

	log "set video codec x264, container mpegts"
	VENC="-c:v libx264 -preset veryfast -b:v ${VBR} -bufsize 128K"
	AENC="-c:a ${AUDIO}"
	MAP="-map 0:v -map 0:a:$AUDIO_STREAM"
	COMMAND=${PROG}" -i ${MAP} ${FILTER} ${FPS:+-r $FPS} ${VENC} ${AENC} ${CONTAINER}"
	STREAMTYPE=pipe
}

###
 # Remux for ChromeCast
### 
function remux_chromecast {
	
	log "set video codec x264, container matroska"
	MAP="-map 0:v -map 0:a"
	VENC="-vcodec libx264 -preset veryfast -b:v ${VBR} -bufsize 1024K"
	AENC="-acodec ${AUDIO}"
	COMMAND=${PROG}" -f mpegts -i ${MAP} ${FILTER} ${FPS:+-r $FPS} ${VENC} ${AENC} ${CONTAINER}"
	STREAMTYPE=fifo
}

###
 # experimental remux for mp4 streaming
 # streaming does not work so far
 #
 # @see http://stackoverflow.com/questions/11616979/live-transcoding-and-streaming-of-mp4-works-in-android-but-fails-in-flash-player
###
function remux_mp4 {

	log "set video codec x264, container mp4"
	VENC="-bsf:v h264_mp4toannexb -flags -global_header -c:v libx264 -maxrate ${VBR} -bufsize 1024K"
	AENC="-c:a ${AUDIO}"
	FLAGS="-movflags frag_keyframe+empty_moov"
	COMMAND=${PROG}" -f mpegts -re -i ${THREADS} ${MAP} ${FILTER} ${FPS:+-r $FPS} ${VENC} ${AENC} ${CONTAINER} ${FLAGS}"
	STREAMTYPE=pipe
}

###
 # Capture first frame of stream
###
function captureFrame {

	log "Capture frame"
	CONTAINER="-f image2"
	COMMAND=${PROG}" -f mpegts -i - -q:v 2 ${FILTER} ${CONTAINER} -vframes 1 /tmp/externremux-$PID.jpg"
	log "Executing: $COMMAND"
	eval ${COMMAND}
	SIZE=$(stat -c %s /tmp/externremux-${PID}.jpg)
	HEADER[disposition]="Content-Disposition: attachment; filename=\"externremux-$PID.jpg\""
	HEADER[contentlength]="Content-Length: $SIZE"
	HEADER[accesscontrol]="Access-Control-Allow-Origin: *"

	sendHeaders
	startFifo
	cat /tmp/externremux-${PID}.jpg > "$FIFO"
	rm /tmp/externremux-${PID}.jpg
	exit 0
}

###
 # Start creation of stream
###
function startStream {

	case "$STREAMTYPE" in
		pipe)
			startPipe
			;;
		*)
			startFifo
			;;
	esac

	# very important to specify -re as first option used
	# makes sure not to encode too fast since the browser
	# seems to buffer the video and stops downloading
	# if buffer is full? Results in timeout...
	if [ "$TYPE" = "stream" ] && [ ${RECORDING} -gt 0 ] && [ "$QUALITY" != "preview" ] && [ "$TYPE" != "poster" ]; then
		COMMAND=${COMMAND/${PROG} /${PROG} -re }
	fi

	sendHeaders
	log "Start transcoding: $COMMAND"
	eval ${COMMAND}
}

###
#
# https://www.ffmpeg.org/ffmpeg.html
#
# video tag supported media formats
# https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats
#
# Chromecast User Agent string
# HTTP_USER_AGENT=Mozilla/5.0 (Unknown; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.0 Safari/537.36 CrKey
#
# compile ffmpeg on ubuntu
# https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu
#
# Codec Information
# http://ffmpeg.org/ffmpeg-codecs.html
#
# http://jronallo.github.io/blog/html5-video-everything-i-needed-to-know/
#
# https://trac.ffmpeg.org/wiki/Encode/HighQualityAudio
#
# https://trac.ffmpeg.org/wiki/Encode/AAC
#
###

TYPE=${REMUX_PARAM_TYPE:-$TYPE}

log "TYPE: $TYPE"
case "$REMUX_VPID" in
	''|0|1)
		CONTENTTYPE='audio/mpeg'
		;;
	*)
		if [ ${CHROMECAST} -gt 0 ]; then
			CONTENTTYPE='video/mkv'
			VBR=1024K
			ABR=720K
			WIDTH=1280
			HEIGHT=720
		elif [ "$TYPE" = "webm" ]; then
			CONTENTTYPE='video/webm'
		elif [ "$TYPE" = "mp4" ]; then
			CONTENTTYPE='video/mp4'
		elif [ "$TYPE" = "mkv" ]; then
			CONTENTTYPE='video/mkv'
		elif [ "$TYPE" = "flv" ]; then
			CONTENTTYPE='video/x-flv'
		elif [ "$TYPE" = "download" ]; then
			CONTENTTYPE='application/octet-stream'
		elif [ "$TYPE" = "poster" ]; then
			CONTENTTYPE='image/jpeg'
		else
			CONTENTTYPE='video/mpeg'
		fi
	;;
esac

log "CONTENTTYPE: $CONTENTTYPE"

QUALITY=${REMUX_PARAM_QUALITY:-$QUALITY}
case "$QUALITY" in
	DSL1000|dsl1000)   VBR="96K";   ABR="96K";  WIDTH=160; HEIGHT=90;;
	DSL2000|dsl2000)   VBR="128K";  ABR="96K";  WIDTH=160; HEIGHT=90;;
	DSL3000|dsl3000)   VBR="256K";  ABR="96K";  WIDTH=320; HEIGHT=180;;
	DSL6000|dsl6000)   VBR="378K";  ABR="96K";  WIDTH=320; HEIGHT=180;;
	DSL16000|dsl16000) VBR="512K";  ABR="128K"; WIDTH=480; HEIGHT=270;;
	WLAN11|wlan11)     VBR="768K";  ABR="128K"; WIDTH=640; HEIGHT=360;;
	WLAN54|wlan54)     VBR="2048K"; ABR="128K"; WIDTH=800; HEIGHT=450;;
	LAN10|lan10)       VBR="4096K"; ABR='128K';  WIDTH=1280; HEIGHT=720;;
	*)                 error "Unknown quality '$QUALITY'";;
esac

ABR=${REMUX_PARAM_ABR:-$ABR}
VBR=${REMUX_PARAM_VBR:-$VBR}
WIDTH=${REMUX_PARAM_WIDTH:-$WIDTH}
HEIGHT=${REMUX_PARAM_HEIGHT:-$HEIGHT}
VSIZE=${REMUX_PARAM_VSIZE:-$VSIZE}
FPS=${REMUX_PARAM_FPS:-$FPS}
AUDIO_STREAM=${REMUX_PARAM_ASTR:-$AUDIO_STREAM}
AUDIO_CHANNELS=${REMUX_PARAM_ACHAN:-$AUDIO_CHANNELS}
DEINTERLACE=${REMUX_PARAM_DLACE:-$DEINTERLACE}

if [ "$REMUX_PARAM_PROG" = "cat"  ]; then
	remux_cat
else
	#setDeinterlace
	setFilter
	if [ "$QUALITY" = "preview" ]; then
		setHeaders
		containerWebm
		remux_preview
	elif [ "$TYPE" = "download" ]; then
		setHeaders
		containerMatroska
		audioAac
		remux_x264
	elif [ ${CHROMECAST} -gt 0 ]; then
		containerMatroska
		audioAac
		remux_chromecast
	elif [ "$TYPE" = "webm" ]; then
		TYPE=stream
		setHeaders
		setContentLength
		containerWebm
		audioVorbis
		remux_vpx
	elif [ "$TYPE" = "mkv" ]; then
		TYPE=stream
		setHeaders
		setContentLength
		containerMatroska
		audioAac
		remux_x264
	elif [ "$TYPE" = "mp4"  ]; then
		TYPE=stream
		setHeaders
		containerMp4
		audioLame
		remux_mp4
	elif [ "$TYPE" = "flv"  ]; then
		TYPE=stream
		setHeaders
		containerFlv
		audioLame
		remux_x264
	elif [ "$TYPE" = "poster" ]; then
		captureFrame
	else 
		TYPE=stream
		setHeaders
		containerMpegTs
		audioLame
		remux_x264
	fi
	startStream
fi

set -o monitor
wait
log "remux done - exiting"
exit 0
