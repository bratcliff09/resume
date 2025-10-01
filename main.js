const prevPage = document.querySelector(".page-counter button");
const nextPage = document.querySelectorAll(".page-counter button")[1];

const pages = document.querySelectorAll(".page");
const pageNum = pages.length;

let currPage = 0;

showMoreInit(); //Call this before pageListSetup()

prevPage.onclick = () => changePage(-1);
nextPage.onclick = () => changePage(1);
function changePage(dir) {
  currPage += 1 * dir;
  if (currPage < 0) {
    currPage = 0;
    return;
  } else if (currPage > pageNum - 1) {
    currPage = pageNum - 1;
    return;
  }

  const currPageTag = document.querySelectorAll(".page-counter div span")[0];
  currPageTag.innerText = currPage + 1;

  pages[currPage].scrollIntoView();
  window.history.pushState(null, "", "#" + pages[currPage].id);
}

/**
 *
 * @param {*} pageNumber Number instead of index. 1 instead of 0
 */
function changePageManual(pageIndex) {
  currPage = pageIndex;
  const currPageTag = document.querySelectorAll(".page-counter div span")[0];
  currPageTag.innerText = pageIndex + 1;
  window.history.pushState(null, "", "#" + pages[currPage].id);
}

//Show more button
function showMoreInit() {
  const mediaLists = document.querySelectorAll(".media");
  mediaLists.forEach((element) => {
    //TODO: only do this if element has 3 or more photos
    element.classList.add("closed");
    const button = element.querySelector("button");
    button.onclick = (evnt) => showMoreOnClick(evnt);
  });
}

function showMoreOnClick(evnt) {
  const root = evnt.target.parentElement.parentElement;
  const isClosed = root.classList.contains("closed");
  if (isClosed) {
    evnt.target.innerText = "Show Less";
  } else {
    evnt.target.innerText = "Show More";
  }
  root.classList.toggle("closed");
}

let prevY = window.scrollY;
let throttleActive = false;
function onScroll() {
  let dir = window.scrollY < prevY ? 1 : -1;

  const windowTop = window.scrollY;
  const windowBottom = windowTop + window.innerHeight;
  const neededPageTop = windowTop + (windowBottom - windowTop) * 0.25;

  if (dir === -1) {
    const currPageBottom =
      pages[currPage].offsetHeight + pages[currPage].offsetTop;
    if (currPageBottom <= neededPageTop) {
      if (currPage === pages.length) {
        prevY = window.scrollY;
        return;
      }
      changePageManual(currPage + 1);
    }
  } else {
    if (pages[currPage].offsetTop > neededPageTop) {
      if (currPage === 0) {
        prevY = window.scrollY;
        return;
      }
      changePageManual(currPage - 1);
    }
  }

  prevY = window.scrollY;

  //TODO: Throttle this
  //TODO: Needs to be tweaked for IOS
}
document.onscroll = (evnt) => onScroll(evnt);
