(function () {
	var manifest = {
		"bg": "img/bg.jpg",
		"item": "img/result.png",
		"img1": "img/img1.png",
		"button": "img/button.png",
		"title": "img/title.png",
		"title1": "img/title1.png",
		"rank": "img/rank.png",
		"tx1": "img/tx1.png",
		"tx2": "img/tx2.png",
		"tx3": "img/tx3.png",
		"music": "img/music.png",
		"line1": "img/line1.png",
		"line2": "img/line2.png"
	};
	var nScaleRatio;

	var init = function () {
		var Ca = document.getElementById("canvas"),
			nWinW = window.innerWidth,
			nWinH = window.innerHeight,
			nCaW, nCaH, nCaLft = 0, nCaTop = 0;

		Ca.style.backgroundColor = "#000";
		if (nWinW / nWinH > 750 / 1234) {
			nCaW = 750 * nWinH / 1234;
			nCaH = nWinH;
			nCaLft = (nWinW - nCaW) / 2;
			nScaleRatio = (nCaW / 750).toFixed(2);
		} else if (nWinW / nWinH < 750 / 1234) {
			nCaW = nWinW;
			nCaH = 1234 * nWinW / 750;
			nCaTop = (nWinH - nCaH) / 2;
			nScaleRatio = (nCaH / 1234).toFixed(2);
		};
		Ca.width = nCaW;
		Ca.height = nCaH;

		Ca.style.left = nCaLft + "px";
		Ca.style.top = nCaTop + "px";

		var oPictureLink = new KCanvas();
		oPictureLink.ca = Ca;
		oPictureLink.ctx = Ca.getContext("2d");
		oPictureLink.width = nCaW;
		oPictureLink.height = nCaH;
		oPictureLink.left = nCaLft;
		oPictureLink.top = nCaTop;
		oPictureLink.scaleRatio = nScaleRatio;
		console.log(oPictureLink);

		var kEvent = new KEvent();
		kEvent.init(Ca);

		Linkup.init(oPictureLink, kEvent);
		Linkup.renderIndex();
	}

	Linkup.load(manifest, init);
	
	window.ondeviceorientation = function (e) {

	}
	HTMLAudioElement.prototype.stop = function () {
		this.pause();
		this.currentTime = 0.0;
	}
}(window));