const Scroller = function (opts = {}) {
  const oResetButton = opts.resetButton;
  const oDomContainer =
    opts.container || document.documentElement || document.body;
  const nClientHeight = oDomContainer.clientHeight;
  let nTargetPosition = 0;
  let isBtnDisplayed = false;
  let isScrolling = false;
  let timer = null;

  window.onscroll = function (e) {
    if (oResetButton) {
      const nScrollTop = oDomContainer.scrollTop;

      if (!isBtnDisplayed && nScrollTop > nClientHeight) {
        isBtnDisplayed = true;
        if (oResetButton) oResetButton.style.display = "block";
      } else if (isBtnDisplayed) {
        if (nScrollTop < nClientHeight) {
          isBtnDisplayed = false;
          if (oResetButton) oResetButton.style.display = "none";
        }
      }
    }

    if (!isScrolling) {
      clearInterval(timer);
    }

    isScrolling = false;
  };

  const scrollTo = function (t) {
    nTargetPosition = t;
    timer = setInterval(function () {
      const nScrollTop = oDomContainer.scrollTop;

      let nNewScrollTop = nScrollTop - (nScrollTop - nTargetPosition) / 12;

      nNewScrollTop =
        Math.abs(nScrollTop - nNewScrollTop) < 1
          ? nTargetPosition
          : nNewScrollTop;

      oDomContainer.scrollTop = nNewScrollTop;

      isScrolling = true;

      if (nScrollTop === nTargetPosition || !isScrolling) {
        clearInterval(timer);
      }
    }, 30);
  };

  return {
    scrollTo,
  };
};
