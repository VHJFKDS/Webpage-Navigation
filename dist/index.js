class Site {
    constructor() {
      this.siteArr = [
        {
          title: "掘金",
          url: "https://juejin.im",
        },
        {
          title: "百度",
          url: "https://www.baidu.com",
        },
        {
          title: "bilibili",
          url: "https://www.bilibili.com",
        },
        {
          title: "qq邮箱",
          url: "https://email.qq.com",
        },
        {
          title: "weibo",
          url: "https://www.weibo.com",
        },
        {
          title: "语雀",
          url: "https://yuque.com",
        },
        {
          title: "腾讯课堂",
          url: "https://ke.qq.com",
        },
      ];
      this.loadSites();
      this.renderSites();
    }

    addSite(title, url) {
      if (!url.match(/^https?:\/\//)) {
        url = "https://" + url;
      }
      this.siteArr.push({
        title,
        url,
      });
      this.renderSites();
    }
    loadSites() {
      const sites = window.localStorage.sites;
      if (sites) {
        console.log(sites);
        const arr = JSON.parse(sites);
        if (Array.isArray(arr)) {
          this.siteArr = arr;
        }
      }
    }
    removeSite(index) {
      this.siteArr.splice(index, 1);
      this.renderSites();
    }
    saveSites() {
      window.localStorage.sites = JSON.stringify(this.siteArr);
    }
    clearCache() {
      window.localStorage.sites = "";
    }
    renderSites() {
      const content = this.siteArr
        .map(({ title, url}, index) => {
          return `
          <li class="site" data-siteindex="${index}">
            <div class="site-wrapper">
              <div class="site-content">
                <div class="site-head">
                  <img
                    src="${url}/favicon.ico"
                    alt=""
                    class="site-img"
                  />
                  <span class="site-title">${title}</span>
                </div>
                <p class="site-desc"></p>
              </div>
              <div class="site-remove-mobile-btn">删除</div>
              <div class="site-remove-pc-btn">
              <img class="icon-remove" src="../img/删除.svg"></img>
              </div>
            </div>
          </li>`;
        })
        .join("\n");
      $(".site-list .add-site").siblings().remove().end().before(content);
      bindSlideSiteEvent();
    }
  }

  function bindAddSiteEvent() {
    $(".add-site").on("click", function (e) {
      console.log(e.currentTarget);
      const title = window.prompt("请输入网站标题");
      if (!title) return;
      const url = window.prompt("请输入网站地址");
      if (!url) return;
    s.addSite(title, url);
    });
  }
  function isRemoveBtn(ele) {
    let $ele = $(ele);
    while (
      $ele[0] !== document &&
      !$ele.hasClass("site-remove-mobile-btn") &&
      !$ele.hasClass("site-remove-pc-btn")
    ) {
      $ele = $ele.parent();
      console.log($ele[0]);
    }
    return $ele[0] !== document;
  }
  function bindRemoveSiteEvent() {
    $(".site-list").on("click", removeEventhandler);
    function removeEventhandler(e) {
      e.stopPropagation();
  
      let target = e.target;
      if (!isRemoveBtn(target)) return;
      while (
        target.dataset &&
        target.dataset.siteindex === undefined &&
        target !== document
      ) {
        target = target.parentNode;
      }
      const index = target.dataset.siteindex;
      if (window.confirm(`确定删除网站${s.siteArr[index].title}？`)) {
        s.removeSite(index);
      }
    }
  }
  function bindOpenSiteEvent() {
    $(".site-list").on("click", openEventHandler);
    function openEventHandler(e) {
      let target = e.target;
      if (isRemoveBtn(target)) return;
      while (
        target.dataset &&
        target.dataset.siteindex === undefined &&
        target !== document
      ) {
        target = target.parentNode;
      }
      if (target === document) return;
      const index = target.dataset.siteindex;
      window.open(s.siteArr[index].url);
    }
  }
  
  function bindSlideSiteEvent() {
    let isSlided = false;
    let originX;
    let deltaXRec;
    const LIMIT = $(".site-wrapper").width() / 2;
    $(".site-wrapper")
      .on("touchstart", function (e) {
        const left = parseInt($(this).css("left"));
        isSlided = Math.abs(left) === LIMIT;
        deltaXRec = 0;
        originX = e.touches[0].clientX;
        $(this).removeClass("animate");
      })
      .on("touchmove", function (e) {
        const curX = e.touches[0].clientX;
        const deltaX = curX - originX;
        if (isSlided) {
          if (deltaX < LIMIT && deltaX > 0) {
            $(this).css("left", `${-LIMIT + deltaX}px`);
          }
        } else {
          if (deltaX > -LIMIT && deltaX < 0) {
            $(this).css("left", `${deltaX}px`);
          }
        }
        deltaXRec = deltaX;
      })
      .on("touchend", function (e) {
        $(this).addClass("animate");
        // 幅度不够
        if (Math.abs(deltaXRec) < LIMIT * 0.9) {
          $(this).css("left", isSlided ? `${-LIMIT}px` : `0px`);
        } else {
          $(this).css("left", isSlided ? `0px` : `${-LIMIT}px`);
        }
      });
  }
  function bindWindowLeaveEvent() {
    window.onbeforeunload = function () {
      s.saveSites();
    };
  }
  s = new Site();
  bindAddSiteEvent();
  bindOpenSiteEvent();
  bindRemoveSiteEvent();
  bindWindowLeaveEvent();