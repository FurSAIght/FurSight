#!/bin/bash
libcamera-vid -t 0 --width 1920 --height 1080 --autofocus-mode continuous --autofocus-speed fast --hdr --shutter 5000 --exposure sport --intra 5 --inline --listen -o - | cvlc -vvv stream:///dev/stdin --sout '#rtp{sdp=rtsp://:8554/camera}' :demux=h264
 