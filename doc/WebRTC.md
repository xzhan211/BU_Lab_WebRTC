#Implement P2P Video Communication with WebRTC

## SUMMARY
> ### What is WebRTC?
> ### Development Environment
> ### Schematic diagram about high level idea
> #### 1. Web Server
> #### 2. STUN Server
> #### 3. Socket.IO 
> #### 4. WebRTC
> ### Basic theory of WebRTC used in our project

## What is WebRTC?
WebRTC is an open source project to enable realtime communication (Peer to Peer UDP) of audio, video and data in Web and native apps. Users can access these Web applications directly with the mainstream browsers such as Chrome, Firefox.

Good [**tutorial**](https://codelabs.developers.google.com/codelabs/webrtc-web/#0) and [**base example**](https://github.com/xzhan211/webrtc-video-broadcast) are here.

Our Lab project source code is [**here**](https://github.com/xzhan211/Lab_WebRTC).
Demo is [**here**](https://coolala.xyz).


There are four most important part about WebRTC:

+ [**getUserMedia()**](https://webrtc.github.io/samples/src/content/getusermedia/gum/): capture audio and video from local PC. Good source [**here**](https://addpipe.com/blog/getusermedia-video-constraints/)  **\*\*\***
+ [**MediaRecorder**](https://webrtc.github.io/samples/src/content/getusermedia/record/): record audio and video. 
+ [**RTCPeerConnection**](https://webrtc.github.io/samples/src/content/peerconnection/pc1/): stream audio and video between users. **\*\*\***
+ [**RTCDataChannel**](https://webrtc.github.io/samples/src/content/datachannel/basic/): stream data between users.

Note: "**\*\*\***" means heavily used in our project.

## Development Environment
**Type:** Front End

**Language:** JavaScript, HTML, CSS

**Web Server:** Linux (centOS), Node.js

**Public Server:** Google STUN Server

**Other:** Socket.IO




## Schematic diagram about high level idea

![](pictures/high-level.png)

### Key Conception
+ **Broadcastor:** Robot side, take the 360 live video stream. As a broadcastor, it will pass the video stream to multi-viewers. The broadcastor only sends video, doesn't receive any video. 
+ **Viewer:** User side application, it can only receive video from broadcastor side. Multi-Viewers are supported.
+ **Web Server:** In this project, neither broadcastor nor viewer side need to run any server program. The web server is just set on some third party VPN ([**current VPN**](https://coolala.xyz) is my private one, I will set a new one for Lab laterly), both broadcastor and viewer can just access the web server to grab broadcastor/viewer side code(.js/.html/.css).
+ **STUN Server:** WebRTC is designed to work peer-to-peer, so users can connect by the most direct route possible. Before peer-to-peer work, users should use STUN server to get their own IP address. In this project, Google STUN server is used. In another word, STUN servers are used by both clients to determine their IP address as visible by the global Internet. If both the peers are behind the same NAT , STUN settings are not needed since they are anyways reachable form each other . STUN effectively comes into play when the peers are on different networks. 
+ **Socket.IO:** It is a JavaScript library for realtime web applications. It enables realtime, bi-directional communication between web clients and servers. It has two parts: a client-side library that runs in the browser, and a server-side library for Node.js. Both components have a nearly identical API. Like Node.js, it is event-driven. **Socket.IO is using for Singling in our project**.
+ **Signaling:** It is the process of coordinating communication. In order for a WebRTC application to set up a 'call', broadcastor and viewer need to exchange information such IP address, media metadata (codecs settings, bandwitdth...), key data for secure connections etc. **Singling is implemented by Socket.IO in our project**.
+ **TURN Server:** TURN servers to function as relay servers in case peer-to-peer communication fails. **TURN server is not used in our project**.
+ **Peer to Peer data:** Using UDP protocal.
![](pictures/p2p.png)
+ **Singling Data:** Using STUN protocal.
![](pictures/stun.png)










