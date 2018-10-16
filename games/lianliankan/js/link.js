var Linkup = (function () {
    var oLinkup, oKEvent, // 全局的图层对象和事件对象
        nWinW, nWinH, nScaleRatio, // 窗口尺寸和比例
        manifest; //图片素材

    var oLevelName; //第几关，关卡名称
    var jRankData;
    var arrAudio = [];

    var oAudio = oAudio = document.createElement("audio");
    oAudio.src = "audio/bgm.mp3";
    oAudio.loop = "loop";
    document.body.appendChild(oAudio);

    var oASelect1 = document.getElementById("audioSelect1");
    var oASelect2 = document.getElementById("audioSelect2");
    var oAClear1 = document.getElementById("audioCombo1");
    var oAClear2 = document.getElementById("audioCombo2");

    if (window.localStorage.getItem("rank")) {
        jRankData = JSON.parse(window.localStorage.getItem("rank"));
    } else {
        jRankData = { "name": ["无名氏"], "time": ["99:99"] };
    };


    var Gamestart = (function () {
        var matrix, arrPic = [], focusPic = [],
            itemLayer, borderLayer, lineLayer, typeGroup = {};

        var levelId = 0, currentLevel = level[levelId];

        var oLayerCountdown, intervalCount,
            remainingtime = 0;

        var sRecordName = "", sRecordTime = "00:00";

        
        //添加图片
        var addPic = function () {
            var i = 0, newLayer, // 当前关卡难度信息
                row = 0, col = 0, cols = currentLevel.col, cont = currentLevel.count, //图片总数
                nPicSize = (nWinW - 10) / (currentLevel.col + 1), //图片尺寸
                nPicStartX = nPicSize/2 +5, nPicStartY = 112, //起始的X，Y
                nRandom, arrImg = getArrImg(), countData = {}, //  图片随机排列数组
                maxRepeat = currentLevel.repeat//  一张图重复的数量

            matrix = [];
            typeGroup = {};
            var j = 0, rows = cont / cols;
            while (j < rows) {
                matrix[j] = [];
                j++;
            }
            while (i < cont) {
                newLayer = new ImageLayer();
                nPicId = arrImg[Math.floor(Math.random() * arrImg.length)];
                if (countData[nPicId]) {
                    countData[nPicId]++;
                } else {
                    countData[nPicId] = 1;
                }
                newLayer.id = i;
                newLayer.pId = nPicId;
                newLayer.col = col;
                newLayer.row = row;
                newLayer.ctx = oLinkup.ctx;
                newLayer.focus = false;
                newLayer.img = manifest.item;
                newLayer.width = nPicSize;
                newLayer.height = nPicSize;
                newLayer.x = nPicStartX + nPicSize * col;
                newLayer.y = nPicStartY + row * nPicSize;
                newLayer.sx = 0;
                newLayer.sy = 0 + nPicId * 120;
                newLayer.sw = 120;
                newLayer.sh = 120;

                if (typeGroup[nPicId]) {
                    typeGroup[nPicId][i] = newLayer;
                } else {
                    typeGroup[nPicId] = {};
                    typeGroup[nPicId][i] = newLayer;
                }

                if (countData[nPicId] >= maxRepeat) {
                    arrImg.splice(arrImg.indexOf(nPicId), 1);
                }
                newLayer.add("addBorder", addBorder);
                oKEvent.addEvent(newLayer, "touchstart", function () {
                    var self = this;
                    if (borderLayer.length < 2) {
                        borderLayer.status = "live";
                        if (!self.focus) {
                            self.focus = true;
                            self.addBorder();
                            if (borderLayer.length === 2) {
                                removeMath();
                                removeBorder();
                            } else {
                                if (oASelect1.paused) {
                                    oASelect1.play();
                                } else {
                                    oASelect2.play();
                                }
                            }
                        }
                    }
                });
                matrix[row][col] = newLayer;
                itemLayer.addChild(newLayer);

                col++;
                if (col >= cols) {
                    col = 0;
                    row++;
                }
                i++;
            }
            console.log(oLinkup);
            checkLink.init(nPicSize, nPicSize, nPicStartY, nPicStartX, rows, cols);
        }
        var addSearch = function () {
            var oLayerSearch = new ImageLayer();
            oLayerSearch.x = nWinW - 162;
            oLayerSearch.y = nWinH - 45;
            oLayerSearch.width = 31;
            oLayerSearch.height = 31;
            oLayerSearch.sw = 62;
            oLayerSearch.sh = 62;
            var newImg = new Image();
            newImg.src = "img/search.png";
            oLayerSearch.img = newImg;
            oLinkup.addChild(oLayerSearch);

            var nTimes = 3;
            var oTextLayer = new TextLayer();
            oTextLayer.x = nWinW - 110;
            oTextLayer.y = nWinH - 38;
            oTextLayer.family = "造房工坊力黑";
            oTextLayer.size = "18px";
            oTextLayer.align = "center";
            oTextLayer.color = "#FFF";
            oTextLayer.content = "X 3";
            oLinkup.addChild(oTextLayer);

            oKEvent.addEvent(oLayerSearch, "touchstart", function () {
                if (nTimes > 0) {
                    nTimes--;
                    oTextLayer.content = "X " + nTimes;
                    getLink();
                }
            });
        }
        var addBtnRearrange = function () {
            var oLayerRearrange = new ImageLayer();
            oLayerRearrange.x = nWinW - 82;
            oLayerRearrange.y = nWinH - 45;
            oLayerRearrange.width = 31;
            oLayerRearrange.height = 31;
            oLayerRearrange.sw = 62;
            oLayerRearrange.sh = 62;
            var newImg = new Image();
            newImg.src = "img/rearrange.png";
            oLayerRearrange.img = newImg;
            oLinkup.addChild(oLayerRearrange);

            var nTimes = 3;
            var oTextLayer = new TextLayer();
            oTextLayer.x = nWinW - 30;
            oTextLayer.y = nWinH - 38;
            oTextLayer.family = "造房工坊力黑";
            oTextLayer.size = "18px";
            oTextLayer.align = "center";
            oTextLayer.color = "#FFF";
            oTextLayer.content = "X 3";
            oLinkup.addChild(oTextLayer);

            oKEvent.addEvent(oLayerRearrange, "touchstart", function () {
                if (nTimes > 0) {
                    nTimes--;
                    oTextLayer.content = "X " + nTimes;
                    rearrange();
                }
            });
        }
        var addBtnMusic = function () {
            var oLayerBtnMusic = new ImageLayer();
            oLayerBtnMusic.x = nWinW - 100 * nScaleRatio;
            oLayerBtnMusic.y = 55 * nScaleRatio;
            oLayerBtnMusic.width = 62 * nScaleRatio;
            oLayerBtnMusic.height = 62 * nScaleRatio;
            oLayerBtnMusic.img = manifest.music;
            oLayerBtnMusic.sw = 62;
            oLayerBtnMusic.sh = 62;

            oLinkup.addChild(oLayerBtnMusic);
            oKEvent.addEvent(oLayerBtnMusic, "touchstart", function () {
                addMusic();
            });
        }

        var addMusic = function () {
            if (oAudio.paused) {
                oAudio.play();
            } else {
                oAudio.pause();
            }
        }

        //添加选中边框
        var addBorder = function () {
            var self = this;
            var newLayer = new Layer();
            newLayer.ctx = oLinkup.ctx;
            newLayer.x = self.x;
            newLayer.y = self.y;
            newLayer.width = self.width;
            newLayer.height = self.height;
            newLayer.lineWidth = "2";
            newLayer.color = "#F00";
            newLayer.stroke = "true";

            borderLayer.addChild(newLayer);
            focusPic.push(self);
        }
        var removeMath = function () {
            if (focusPic[0].pId === focusPic[1].pId) {
                var result = checkLink.match(matrix, focusPic);
                if (result) {
                    if (oAClear1.paused) {
                        oAClear1.play();
                    } else {
                        oAClear2.play();
                    }
                    if (result.start) {
                        addPath(result);
                    }
                    delay(function () {
                        for (var i in focusPic) {
                            addBubble(focusPic[i]);
                            focusPic[i].status = "dead";
                            matrix[focusPic[i].row][focusPic[i].col] = null;
                            delete typeGroup[focusPic[i].pId][focusPic[i].id];
                            oKEvent.delEvent(focusPic[i], "touchstart");
                            currentLevel.cleared++;
                        }
                        if (currentLevel.cleared >= currentLevel.count) {
                            levelUp();
                        } else {
                            checkMatrix();
                        }
                    }, 200);
                }
            }
        }
        var removeBorder = function () {
            for (var i in focusPic) {
                focusPic[i].focus = false;
            }
            delay(function () {
                borderLayer.clearChild();
                lineLayer.clearChild();
                focusPic = [];
            }, 200);
        }
        //图片连接的路径
        var addPath = function (path) {
            var newPath = new LineLayer();
            newPath.color = "#F00";
            newPath.x = path.start.x;
            newPath.y = path.start.y;
            newPath.lineWidth = 2;
            newPath.points = path.stop;
            lineLayer.addChild(newPath)
        }
        //消除效果
        var addBubble = function (o) {
            var bubbleLayer = new ImageLayer();
            bubbleLayer.x = o.x;
            bubbleLayer.y = o.y;
            bubbleLayer.sw = 70;
            bubbleLayer.sh = 70;
            bubbleLayer.width = o.width;
            bubbleLayer.height = o.height;
            bubbleLayer.img = manifest.tx1;
            bubbleLayer.add("burst", burst);
            itemLayer.addChild(bubbleLayer);
            bubbleLayer.burst();
        }

        var addCountdown = function () {
            oLayerCountdown = new TextLayer();
            oLayerCountdown.x = 50;
            oLayerCountdown.y = nWinH - 35;
            oLayerCountdown.family = "造房工坊力黑";
            oLayerCountdown.size = "18px";
            oLayerCountdown.align = "center";
            oLayerCountdown.color = "#FFF";
            oLayerCountdown.shadowBlur = 25;
            oLayerCountdown.shadowColor = "#F00";

            oLinkup.addChild(oLayerCountdown);
        }
        var startCountdown = function () {
            //remainingtime += currentLevel.time;
            var min = Math.floor(remainingtime / 60), sec = remainingtime % 60;
            oLayerCountdown.content = sRecordTime;
            //console.log(min, sec, remainingtime);
            intervalCount = setInterval(function () {
                //remainingtime--;
                sec++;
                if (sec > 59) {
                    min++;
                    sec = 0;
                }
                sRecordTime = fnToDoubleDigit(min) + ":" + fnToDoubleDigit(sec)
                oLayerCountdown.content = sRecordTime;
                //if (remainingtime < 0) {
                //    gameover();
                //}
            }, 1000);
        }
        var burst = function () {
            var self = this;
            self.img = manifest.tx2;
            delay(function () {
                self.img = manifest.tx3;
                delay(function () {
                    self.status = "dead";
                }, 100);
            }, 100);
        }
        //获取随机图片数组
        var getArrImg = function () {
            var arrImg = [], nRd,
                i = 0, currentLevel = level[levelId],
                max = currentLevel.type;
            while (i < max) {
                nRd = Math.round(Math.random() * max) + 1;
                if (arrImg.indexOf(nRd) < 0) {
                    arrImg.push(nRd);
                    i++;
                }
            }
            return arrImg;
        }


        var rearrange = function () {
            var i, j, iLen, jLen, arrId = 0,
            rearrangeArr1 = [], rearrangeArr2 = [], coordArr = [], tempPicture;
            for (i = 0, iLen = matrix.length; i < iLen; i++) {
                for (j = 0, jLen = matrix[i].length; j < jLen; j++) {
                    if (matrix[i][j]) {
                        tempPicture = matrix[i][j];
                        oKEvent.delEvent(tempPicture, "touchstart");
                        rearrangeArr1.push(tempPicture);
                        rearrangeArr2.push({ x: tempPicture.x, y: tempPicture.y, row: tempPicture.row, col: tempPicture.col });
                    }
                }
            }
            rearrangeArr2.sort(rand);
            rearrangeArr1.forEach(function (elm, id) {
                var pic1 = elm, pic2 = rearrangeArr2[id];
                pic1.x = pic2.x;
                pic1.y = pic2.y;
                pic1.col = pic2.col;
                pic1.row = pic2.row;

                oKEvent.addEvent(pic1, "touchstart", function () {
                    var self = this;
                    if (borderLayer.length < 2) {
                        borderLayer.status = "live";
                        if (!self.focus) {
                            self.focus = true;
                            self.addBorder();
                            if (borderLayer.length === 2) {
                                removeMath();
                                removeBorder();
                            } else {
                                if (oASelect1.paused) {
                                    oASelect1.play();
                                } else {
                                    oASelect2.play();
                                }
                            }
                        }
                    }
                });
            });
            checkMatrix();
        }
        var getLink = function () {
            var i, j, k, jlen, klen,jPath;
            var hasLink = false;

            for (i in typeGroup) {
                for (j in typeGroup[i]) {
                    for (k in typeGroup[i]) {
                        if (j != k) {
                            jPath = checkLink.match(matrix, [typeGroup[i][j], typeGroup[i][k]]);
                            if (jPath) {
                                typeGroup[i][j].addBorder();
                                typeGroup[i][k].addBorder();
                                jPath.start && addPath(jPath);
                                delay(function () {
                                    removeBorder();
                                }, 1000);
                                return true;
                            };
                        }
                    }
                }
            }
        }
        var checkMatrix = function () {
            var i, j, k, jlen, klen;
            var hasLink = false;

            for (i in typeGroup) {
                for (j in typeGroup[i]) {
                    for (k in typeGroup[i]) {
                        if (j != k) {
                            if (checkLink.match(matrix, [typeGroup[i][j], typeGroup[i][k]])) {
                                hasLink = true;
                            };
                        }
                    }
                }
            }
            if (hasLink) {
            } else {
                rearrange();
                console.log("没有可用连接");
            }
        }

        /******** 添加图层 ********/

        //var ooLinkup, nWinW, nWinH;

        //var addBackground = function () {
        //}

        /********          ********/

        /******** 游戏整体状态 ********/

        //渲染画布
        var startRender = function () {
            clearCanvas();
            oLinkup.render();
            window.requestAnimationFrame(startRender);
        }
        var clearCanvas = function () {
            oLinkup.ctx.clearRect(0, 0, nWinW, nWinH);
        }

        //游戏开始
        var gamestart = function (c, e) {
            nWinW = c.width;
            nWinH = c.height;

            oLinkup = c;
            oKEvent = e;

            addBackground();

            itemLayer = new KCanvas();
            oLinkup.addChild(itemLayer);

            borderLayer = new KCanvas();
            oLinkup.addChild(borderLayer);

            lineLayer = new KCanvas();
            oLinkup.addChild(lineLayer);

            console.log(currentLevel);

            addTitle(currentLevel.name);
            addPic();
            addCountdown();
            addSearch();
            addBtnRearrange();
            addBtnMusic();
            addMusic();

            startCountdown(); // 开始倒计时

            startRender();
        }

        // 游戏结束
        var gameover = function () {
            alert("Game Over！");
            clearInterval(intervalCount);
            oLinkup.clearChild();
            renderRank();
        }

        //进入下一关
        var levelUp = function () {
            if (levelId < level.length - 1) {
                levelId++;
                itemLayer.clearChild();
                currentLevel = level[levelId];
                changeTitle(currentLevel.name);
                addPic();

                //clearInterval(intervalCount);
                //startCountdown();
            } else {
                oLinkup.clearChild();
                clearCanvas();
                delay(function () {
                    sRecordName = window.prompt("游戏结束，输入姓名：");
                    try{
                        jRankData.time.forEach(function (n, i) {
                            if (sRecordTime < n) {
                                jRankData.time.splice(i, 0, sRecordTime);
                                jRankData.name.splice(i, 0, sRecordName);
                                throw true;
                            }
                        });
                    }catch(e){
                        
                    }
                    
                    window.localStorage.setItem("rank", JSON.stringify(jRankData));
                    renderRank();
                }, 40);
            }
        }

        return gamestart;
    }());


    var addBackground = function () {
        var oLayerBackground = new ImageLayer();
        oLayerBackground.x = 0;
        oLayerBackground.y = 0;
        oLayerBackground.width = nWinW;
        oLayerBackground.height = nWinH;
        oLayerBackground.sx = 0;
        oLayerBackground.sy = 0;
        oLayerBackground.sw = 750;
        oLayerBackground.sh = 1334;
        oLayerBackground.img = manifest.bg;

        oLinkup.addChild(oLayerBackground);
    }

    var addTitle = function (text) {
        oLevelName = new TextLayer();
        oLevelName.x = nWinW / 2;
        oLevelName.y = 54 * nScaleRatio;
        oLevelName.color = "#FFF";
        oLevelName.family = "造房工坊力黑";
        oLevelName.content = text;
        oLevelName.align = "center";
        oLevelName.size = 62 * nScaleRatio + "px";

        var oLayerTitle = new ImageLayer();
        oLayerTitle.x = 0;
        oLayerTitle.y = 0;
        oLayerTitle.width = nWinW;
        oLayerTitle.height = 140 * nScaleRatio;
        oLayerTitle.sw = 750;
        oLayerTitle.sh = 140;
        oLayerTitle.img = manifest.title;

        var oLayerLine = new LineLayer();
        oLayerLine.x = 0;
        oLayerLine.y = 152 * nScaleRatio;
        oLayerLine.lineWidth = 2;
        oLayerLine.color = "rgba(255,255,255,0.17)";
        oLayerLine.alpha = 0.17;
        oLayerLine.points.push({ x: nWinW, y: 152 * nScaleRatio });

        oLinkup.addChild(oLayerTitle);
        oLinkup.addChild(oLevelName);
        oLinkup.addChild(oLayerLine);
    }

    var changeTitle = function (text) {
        oLevelName.content = text;
    }

    var addImage1 = function () {
        var oLayerImg1 = new ImageLayer();
        oLayerImg1.x = 0;
        oLayerImg1.y = 140 * nScaleRatio;
        oLayerImg1.width = nWinW;
        oLayerImg1.height = 486 * nScaleRatio;
        oLayerImg1.sw = 750;
        oLayerImg1.sh = 486;
        oLayerImg1.img = manifest.img1;

        oLinkup.addChild(oLayerImg1);
    }

    // button
    var addButton1 = function () {
        var oLayerBtn1 = new ImageLayer();
        oLayerBtn1.x = 0;
        oLayerBtn1.y = 780 * nScaleRatio;
        oLayerBtn1.width = nWinW;
        oLayerBtn1.height = 78 * nScaleRatio;
        oLayerBtn1.img = manifest.button;
        oLayerBtn1.sw = 750;
        oLayerBtn1.sh = 78;

        var oLayerBtn2 = new ImageLayer();
        oLayerBtn2.x = 0;
        oLayerBtn2.y = 925 * nScaleRatio;
        oLayerBtn2.width = nWinW;
        oLayerBtn2.height = 78 * nScaleRatio;
        oLayerBtn2.img = manifest.button;
        oLayerBtn2.sy = 78;
        oLayerBtn2.sw = 750;
        oLayerBtn2.sh = 78;

        var oLayerBtn3 = new ImageLayer();
        oLayerBtn3.x = 0;
        oLayerBtn3.y = 1070 * nScaleRatio;
        oLayerBtn3.width = nWinW;
        oLayerBtn3.height = 78 * nScaleRatio;
        oLayerBtn3.img = manifest.button;
        oLayerBtn3.sy = 156;
        oLayerBtn3.sw = 750;
        oLayerBtn3.sh = 78;


        oLinkup.addChild(oLayerBtn1);
        oLinkup.addChild(oLayerBtn2);
        oLinkup.addChild(oLayerBtn3);

        oKEvent.addEvent(oLayerBtn1, "touchstart", function () {
            var self = this;
            oLinkup.clearChild();
            oKEvent.clearEvent();
            Gamestart(oLinkup, oKEvent);
        });
        oKEvent.addEvent(oLayerBtn2, "touchstart", function () {
            var self = this;
        });
        oKEvent.addEvent(oLayerBtn3, "touchstart", function () {
            var self = this;
        });
    }

    var addTitle1 = function () {
        var oLayerTitle = new ImageLayer();
        oLayerTitle.x = 0;
        oLayerTitle.y = 0;
        oLayerTitle.width = nWinW;
        oLayerTitle.height = 153 * nScaleRatio;
        oLayerTitle.img = manifest.title1;
        oLayerTitle.sw = 750;
        oLayerTitle.sh = 153;

        var oLayerLine = new LineLayer();
        oLayerLine.x = 0;
        oLayerLine.y = 152 * nScaleRatio;
        oLayerLine.lineWidth = 2;
        oLayerLine.color = "rgba(255,255,255,0.17)";
        oLayerLine.alpha = 0.17;
        oLayerLine.points.push({ x: nWinW, y: 152 * nScaleRatio });

        oLinkup.addChild(oLayerTitle);
        oLinkup.addChild(oLayerLine);
    }

    var addRank = function () {
        var oLayerRank, oLayerRankName, oLayerLine;
        var rankLayer = new KCanvas();
        oLinkup.addChild(rankLayer);
        var i = 0;
        //var jRankData = JSON.parse(window.localStorage.getItem("rank"));
        var nRankTop;

        while (i < 7) {
            oLayerRank = new ImageLayer();
            oLayerRank.width = 84 * nScaleRatio;
            oLayerRank.height = 102 * nScaleRatio;
            oLayerRank.x = 87 * nScaleRatio;
            oLayerRank.y = 212 * nScaleRatio + i * 40 * nScaleRatio + i * oLayerRank.height;
            oLayerRank.sx = 0;
            oLayerRank.sy = i * 102;
            oLayerRank.sw = 84;
            oLayerRank.sh = 102;
            oLayerRank.img = manifest.rank;

            nRankTop = oLayerRank.y + 45 * nScaleRatio;

            oLayerRankName = new TextLayer();
            oLayerRankName.x = 366 * nScaleRatio;
            oLayerRankName.y = nRankTop;
            oLayerRankName.align = "center";
            oLayerRankName.family = "造房工坊力黑";
            oLayerRankName.color = "#FFF";

            oLayerRankScore = new TextLayer();
            oLayerRankScore.x = 606 * nScaleRatio;
            oLayerRankScore.y = nRankTop;
            oLayerRankScore.align = "center";
            oLayerRankScore.family = "造房工坊力黑";
            oLayerRankScore.color = "#FFF";

            if (jRankData.name[i]) {
                oLayerRankName.content = jRankData.name[i];
                oLayerRankScore.content = jRankData.time[i];
            } else {
                oLayerRankName.content = "无名氏";
                oLayerRankScore.content = "99:99";
            }
            
            oLayerRankLine = new ImageLayer();
            oLayerRankLine.x = 0;
            oLayerRankLine.y = nRankTop + 70 * nScaleRatio;
            oLayerRankLine.width = nWinW;
            oLayerRankLine.height = 12 * nScaleRatio;
            oLayerRankLine.sw = 750;
            oLayerRankLine.sh = 12;

            if (i < 3) {
                oLayerRankName.size = "20px";
                oLayerRankScore.size = "20px";
                if (i == 0) {
                    oLayerRankName.shadowBlur = 15;
                    oLayerRankName.shadowColor = "#F00";
                    oLayerRankScore.shadowBlur = 15;
                    oLayerRankScore.shadowColor = "#F00";
                }
                oLayerRankLine.img = manifest.line1;
            } else {
                oLayerRankName.size = "16px";
                oLayerRankScore.size = "16px";
                oLayerRankLine.img = manifest.line2;
            }

            i++;
            rankLayer.addChild(oLayerRank);
            rankLayer.addChild(oLayerRankName);
            rankLayer.addChild(oLayerRankScore);
            rankLayer.addChild(oLayerRankLine);
        }

        //console.log(oLinkup);
    }

    var render = function () {
        oLinkup.render();
    }

    var load = function (mani, fn) {
        var status = "loading";
        var oImg, arrImgs = [],
            isReady = true;

        manifest = mani;

        for (var i in manifest) {
            oImg = new Image();
            oImg.src = manifest[i];
            manifest[i] = oImg;
            arrImgs.push(oImg)
        }

        onReady(arrImgs, fn);
    };

    var onReady = function (arr, fn) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].complete) {
                arr.splice(i, 1);
                i--;
            }
        }
        if (!arr.length && fn) {
            fn();
        } else {
            setTimeout(function () {
                onReady(arr, fn);
            }, 40);
        }
    };

    var init = function (o, e) {
        oLinkup = o;
        oKEvent = e;
        nWinW = oLinkup.width;
        nWinH = oLinkup.height;
        nScaleRatio = oLinkup.scaleRatio;
    }

    var renderIndex = function () {
        addBackground();
        addImage1();
        addButton1();
        render();
    };

    var renderRank = function () {
        addBackground();
        addTitle1();
        addRank();
        render();
    }

    document.addEventListener("touchstart", function (e) {
        e.preventDefault();
    });
    document.addEventListener("touchmove", function (e) {
        e.preventDefault();
    });
    document.addEventListener("touchend", function (e) {
        e.preventDefault();
    });

    return {
        load: load,
        init: init,
        renderIndex: renderIndex,
        renderRank: renderRank
    };
}());

