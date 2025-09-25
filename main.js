const prevPage = document.querySelector(".page-counter button");
const nextPage = document.querySelectorAll(".page-counter button")[1];

const pages = document.querySelectorAll(".page");
const pageNum = pages.length;

let currPage = 0;

pageListSetup();
function pageListSetup() {
  const spans = document.querySelectorAll(".page-counter div span");
  const pageNumber = pages.length;

  console.log(pages);
}

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

//Show more button
showMoreInit();
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
