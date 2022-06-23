/**
 * author: kim.zhang
 * pulish date: 2021/10/17
 */

!(function autoLearning() {
  let parent = window;
  while (parent !== parent.parent) {
    parent = parent.parent;
  }
  const document = parent.document;

  const learningQueue = {
    queue: [],
    push(fn) {
      this.queue.push(fn);
    },
    unshift(fn) {
      this.queue.unshift(fn);
    },
    run() {
      const fn = this.queue.shift();
      fn();
    },
    next() {
      if (this.queue.length > 0) {
        this.run();
        return true;
      } else {
        return false;
      }
    },
  };

  const goNextStep = function () {
    const links = Array.from(document.querySelectorAll(".posCatalog_name"));
    const activeLink = document.querySelector(
      ".posCatalog_active .posCatalog_name"
    );
    let currentIndex = links.indexOf(activeLink);
    let nextLink = links[++currentIndex];
    while (nextLink.parentNode.querySelector(".icon_Completed")) {
      nextLink = links[++currentIndex];
    }

    if (!nextLink) alert("学习完啦，留个好评吧~");

    const tabs = Array.from(document.querySelectorAll(".prev_ul li"));
    if (tabs.length > 1) {
      const lastTab = tabs.pop();
      if (lastTab.title === "测试" && !lastTab.classList.contains("active")) {
        lastTab.click();
        setTimeout(() => {
          doTest(0);
        }, 1000);
        return;
      }
    }

    nextLink.click();
    playVideo();
  };

  const playVideo = function () {
    setTimeout(async () => {
      const iframes = document.querySelectorAll("iframe");

      iframes.forEach((iframe) => {
        const contentDocument = iframe.contentWindow.document;

        const videoIframes = contentDocument.querySelectorAll("iframe");

        if (!videoIframes || videoIframes.length === 0) {
          goNextStep();
        } else {
          videoIframes.forEach((vIframe) => {
            const videos =
              vIframe.contentWindow.document.querySelectorAll("video");
            if (!videos || videos.length === 0) {
              goNextStep();
            } else {
              videos.forEach((v) => {
                learningQueue.unshift(function () {
                  v.playbackRate = 2;
                  v.play();

                  v.addEventListener("pause", () => {
                    setTimeout(() => {
                      v.play();
                    }, 5000);
                  });

                  v.addEventListener("ended", () => {
                    setTimeout(() => {
                      const result = learningQueue.next();
                      if (!result) {
                        goNextStep();
                      }
                    }, 3000);
                  });
                  // 测试运行
                  // let _t = setInterval(() => {
                  //   if (v.currentTime >= 3) {
                  //     const result = learningQueue.next()
                  //     clearInterval(_t)
                  //     if (!result) {
                  //       goNextStep()
                  //     }
                  //   }
                  // }, 1000)
                });
              });

              learningQueue.run();
            }
          });
        }
      });
    }, 3000);
  };

  const perm = function (arr) {
    const results = [];
    const _perm = function (source, result) {
      if (source.length == 0) {
        results.push(result);
      } else {
        for (let i = 0; i < source.length; i++) {
          _perm(
            source.slice(0, i).concat(source.slice(i + 1)),
            result.concat(source[i])
          );
        }
      }
    };
    _perm(arr, []);
    return results;
  };

  function Zuhe() {
    var heads = arguments[0];
    for (var i = 1, len = arguments.length; i < len; i++) {
      heads = addNewType(heads, arguments[i]);
    }
    return heads;
  }

  //在原有组合结果的基础上添加一种新的规格
  function addNewType(heads, choices) {
    var result = [];
    for (var i = 0, len = heads.length; i < len; i++) {
      for (var j = 0, lenj = choices.length; j < lenj; j++) {
        result.push([heads[i], choices[j]]);
      }
    }
    return result;
  }

  // 生成答案的所有可能排列
  // let allP = perm(['A', 'B', 'C', 'D'])
  const doTest = function (index) {
    const iframes = document.querySelectorAll("iframe");

    iframes.forEach((iframe) => {
      const contentDocument = iframe.contentWindow.document;
      const testIframeParentDocument =
        contentDocument.querySelector("iframe").contentWindow.document;
      const testIframe =
        testIframeParentDocument.querySelector("iframe").contentWindow.document;

      const answerTable = testIframe.querySelector(".answerTable");
      if (answerTable) {
        goNextStep();
      } else {
        const timus = Array.from(testIframe.querySelectorAll(".TiMu"));

        let allP = [];
        if (timus.length > 1) {
          allP = Zuhe.apply(
            null,
            timus.map((timu) => {
              const selects = timu.querySelectorAll("select");
              return perm(["A", "B", "C", "D"].slice(0, selects.length));
            })
          );

          timus.forEach((timu, timuIndex) => {
            const selects = timu.querySelectorAll("select");
            selects.forEach((select, idx) => {
              select.value = allP[index][timuIndex][idx];
            });
          });
        } else {
          const selects = timus[0].querySelectorAll("select");
          allP = perm(["A", "B", "C", "D"].slice(0, selects.length));
          selects.forEach((select, idx) => {
            select.value = allP[index][idx];
          });
        }

        const submit = testIframe.querySelector(".Btn_blue_1");
        submit.click();

        setTimeout(() => {
          const confirm = testIframe.querySelector(".bluebtn");
          confirm.click();
          setTimeout(() => {
            if (
              testIframe.querySelector("#submitBack #tipContent").innerText ===
              "未达到及格线，请重做"
            ) {
              const confirm2 = testIframe.querySelector("#submitBackOk");
              setTimeout(() => {
                doTest(index + 1);
              }, 5000);
              confirm2.click();
            }
          }, 500);
        }, 500);
      }
    });
  };

  // setTimeout(() => { doTest(0) }, 5000)

  playVideo();
})();
