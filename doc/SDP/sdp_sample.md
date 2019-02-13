## SDP sample

[**protocol**](https://tools.ietf.org/html/rfc4566)

[**格式解析参考1(中文)**](https://blog.csdn.net/china_jeffery/article/details/79991986) 
[**格式解析参考2(中文)**](https://blog.csdn.net/chinabinlang/article/details/79151589) 

#### sample:
	v=0 
	o=- 8026801243923488496 2 IN IP4 127.0.0.1 
	s=- 
	t=0 0 
	a=group:BUNDLE 0 
	a=msid-semantic: WMS GcyVWiKAV6ljX4V4xo2JxOnRU0GkYYppO6nq 
	m=video 9 UDP/TLS/RTP/SAVPF 96 97 98 99 100 101 102 122 127 121 125 107 108 109 124 120 123 119 114 
	c=IN IP4 0.0.0.0 
	a=rtcp:9 IN IP4 0.0.0.0 
	a=ice-ufrag:sYs1 
	a=ice-pwd:KnYRoh7nslPYDd+LjnI/PCth 
	a=ice-options:trickle 
	a=fingerprint:sha-256 B9:36:24:9E:B1:64:51:39:41:E1:67:68:0E:85:47:C0:F6:09:DF:9B:27:1D:45:0B:44:9A:EF:6D:65:6B:F2:EE 
	a=setup:actpass 
	a=mid:0 a=extmap:2 urn:ietf:params:rtp-hdrext:toffset 
	a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time 
	a=extmap:4 urn:3gpp:video-orientation 
	a=extmap:5 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01 
	a=extmap:6 http://www.webrtc.org/experiments/rtp-hdrext/playout-delay 
	a=extmap:7 http://www.webrtc.org/experiments/rtp-hdrext/video-content-type 
	a=extmap:8 http://www.webrtc.org/experiments/rtp-hdrext/video-timing 
	a=extmap:10 http://tools.ietf.org/html/draft-ietf-avtext-framemarking-07 
	a=extmap:9 urn:ietf:params:rtp-hdrext:sdes:mid 
	a=sendrecv 
	a=msid:GcyVWiKAV6ljX4V4xo2JxOnRU0GkYYppO6nq c38bd917-6b9e-49cf-bb1f-79d204adb532 
	a=rtcp-mux a=rtcp-rsize 
	a=rtpmap:96 VP8/90000 
	a=rtcp-fb:96 goog-remb 
	a=rtcp-fb:96 transport-cc 
	a=rtcp-fb:96 ccm fir a=rtcp-fb:96 nack 
	a=rtcp-fb:96 nack pli 
	a=rtpmap:97 rtx/90000 
	a=fmtp:97 apt=96 
	a=rtpmap:98 VP9/90000 
	a=rtcp-fb:98 goog-remb 
	a=rtcp-fb:98 transport-cc 
	a=rtcp-fb:98 ccm fir 
	a=rtcp-fb:98 nack 
	a=rtcp-fb:98 nack pli 
	a=fmtp:98 profile-id=0 
	a=rtpmap:99 rtx/90000 
	a=fmtp:99 apt=98 
	a=rtpmap:100 H264/90000 
	a=rtcp-fb:100 goog-remb 
	a=rtcp-fb:100 transport-cc 
	a=rtcp-fb:100 ccm fir 
	a=rtcp-fb:100 nack 
	a=rtcp-fb:100 nack pli 
	a=fmtp:100 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42001f 
	a=rtpmap:101 rtx/90000 
	a=fmtp:101 apt=100 
	a=rtpmap:102 H264/90000 
	a=rtcp-fb:102 goog-remb 
	a=rtcp-fb:102 transport-cc 
	a=rtcp-fb:102 ccm fir 
	a=rtcp-fb:102 nack 
	a=rtcp-fb:102 nack pli 
	a=fmtp:102 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42001f 
	a=rtpmap:122 rtx/90000 
	a=fmtp:122 apt=102 
	a=rtpmap:127 H264/90000 
	a=rtcp-fb:127 goog-remb 
	a=rtcp-fb:127 transport-cc 
	a=rtcp-fb:127 ccm fir 
	a=rtcp-fb:127 nack 
	a=rtcp-fb:127 nack pli 
	a=fmtp:127 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f 
	a=rtpmap:121 rtx/90000 
	a=fmtp:121 apt=127 
	a=rtpmap:125 H264/90000 
	a=rtcp-fb:125 goog-remb 
	a=rtcp-fb:125 transport-cc 
	a=rtcp-fb:125 ccm fir 
	a=rtcp-fb:125 nack 
	a=rtcp-fb:125 nack pli 
	a=fmtp:125 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42e01f 
	a=rtpmap:107 rtx/90000 
	a=fmtp:107 apt=125 
	a=rtpmap:108 H264/90000 
	a=rtcp-fb:108 goog-remb 
	a=rtcp-fb:108 transport-cc 
	a=rtcp-fb:108 ccm fir 
	a=rtcp-fb:108 nack 
	a=rtcp-fb:108 nack pli 
	a=fmtp:108 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=4d0032 
	a=rtpmap:109 rtx/90000 
	a=fmtp:109 apt=108 
	a=rtpmap:124 H264/90000 
	a=rtcp-fb:124 goog-remb 
	a=rtcp-fb:124 transport-cc 
	a=rtcp-fb:124 ccm fir 
	a=rtcp-fb:124 nack 
	a=rtcp-fb:124 nack pli 
	a=fmtp:124 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=640032 
	a=rtpmap:120 rtx/90000 
	a=fmtp:120 apt=124 
	a=rtpmap:123 red/90000 
	a=rtpmap:119 rtx/90000 
	a=fmtp:119 apt=123 
	a=rtpmap:114 ulpfec/90000 
	a=ssrc-group:FID 2655633204 3112241513 
	a=ssrc:2655633204 cname:aH1og1i6jQX2yZpU 
	a=ssrc:2655633204 msid:GcyVWiKAV6ljX4V4xo2JxOnRU0GkYYppO6nq c38bd917-6b9e-49cf-bb1f-79d204adb532 
	a=ssrc:2655633204 mslabel:GcyVWiKAV6ljX4V4xo2JxOnRU0GkYYppO6nq 
	a=ssrc:2655633204 label:c38bd917-6b9e-49cf-bb1f-79d204adb532 
	a=ssrc:3112241513 cname:aH1og1i6jQX2yZpU 
	a=ssrc:3112241513 msid:GcyVWiKAV6ljX4V4xo2JxOnRU0GkYYppO6nq c38bd917-6b9e-49cf-bb1f-79d204adb532 
	a=ssrc:3112241513 mslabel:GcyVWiKAV6ljX4V4xo2JxOnRU0GkYYppO6nq 
	a=ssrc:3112241513 label:c38bd917-6b9e-49cf-bb1f-79d204adb532 