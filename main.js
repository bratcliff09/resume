import Tech from "./tech_list.js";

const prevPage = document.querySelector(".page-counter button");
const nextPage = document.querySelectorAll(".page-counter button")[1];

await fetch("./list.json")
  .then((response) => response.json())
  .then((data) => {
    data.arr.forEach((page) => createPage(page));
  })
  .catch((error) => console.log(error));

function createPage(pageData) {
  const { title, id, subtitle, description, role, tech, link, media } =
    pageData;

  let str = `
      <div class="info">
        <ul class="links">
        </ul>
      </div>
      <div class="media">
        <ul class="media-list">
        </ul>
        <div>
          <button>Show More</button>
        </div>
      </div>
    `;
  let page_elem = document.createElement("div");
  page_elem.id = id;
  page_elem.classList.add("page");
  page_elem.innerHTML = str;

  const title_elem = document.createElement("h3");
  title_elem.innerText = subtitle ? `${title} - ${subtitle}` : title;

  const descr_elem = document.createElement("p");
  descr_elem.innerText = description;

  const role_elem = document.createElement("p");
  role_elem.innerText = "Role: ";
  for (let i = 0; i < role.length; i++) {
    role_elem.innerText += role[i];
    if (i < role.length - 1) role_elem.innerText += " | ";
  }

  const tech_elem = document.createElement("p");
  tech_elem.innerText = "Technologies: ";
  for (let i = 0; i < tech.length; i++) {
    tech_elem.innerText += Tech[tech[i]];
    if (i < tech.length - 1) tech_elem.innerText += ", ";
  }

  const links_ul = page_elem.querySelector(".links");
  links_ul.classList.add("links");
  for (let i = 0; i < link.length; i++) {
    const link_li = document.createElement("li");
    const a = document.createElement("a");
    a.href = link[i].link;
    const icon = document.createElement("i");

    if (link[i].type == "product") {
      link_li.innerHTML = `
      <a href="${link[i].link}">
        <i class="bx bx-globe-alt"></i>${link[i].text}</a>
      `;
    } else if (link[i].type == "repo") {
      link_li.innerHTML = `
      <a href="${link[i].link}">
        <i class="bxl bx-github"></i>GitHub Repo</a>
      `;
    }

    a.appendChild(icon);
    link_li.appendChild(a);
    links_ul.appendChild(link_li);
  }

  let media_list_str = "";
  for (let i = 0; i < media.length; i++) {
    media_list_str += `<li><img src="${media[i]}" alt="" /></li>`;
  }

  const info_div = page_elem.querySelector(".info");
  info_div.insertBefore(title_elem, links_ul);
  info_div.insertBefore(descr_elem, links_ul);
  info_div.insertBefore(role_elem, links_ul);
  info_div.insertBefore(tech_elem, links_ul);

  const media_ul = page_elem.querySelector(".media-list");
  media_ul.innerHTML = media_list_str;

  document.querySelector("main").append(page_elem);
}

const pages = document.querySelectorAll(".page");
const pageNum = pages.length;
document.querySelectorAll(".page-counter span")[2].innerHTML = pageNum;
let currPage = 0;

showMoreInit(); //Call this before pageListSetup()
scrollToID();

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

// Closes the Show More Button for each page
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
function onScroll() {
  let dir = window.scrollY > prevY ? 1 : -1;

  prevY = window.scrollY;
  if (currPage + dir >= pages.length || currPage + dir < 0) return;
  const currTop = window.scrollY;

  if (dir === -1) {
    const { offsetHeight, offsetTop } = pages[currPage - 1];
    if (currTop <= offsetHeight + offsetTop) changePageManual(currPage - 1);
  } else {
    const buffer = -40;
    const nextPageY = pages[currPage + 1].offsetTop + buffer;
    if (currTop >= nextPageY) changePageManual(currPage + 1);
  }

  //TODO: Needs to be tweaked for IOS
}
document.onscroll = (evnt) => onScroll(evnt);

// On page load, if the ID header is present in the URL, scroll to the associated page
// Only a problem for "drum game" page when every "Show More" is open
function scrollToID() {
  const url = window.location.href;
  if (url.indexOf("#") != -1) {
    //Scroll To
    const id = url.substring(url.indexOf("#") + 1, url.length);
    const page = document.querySelector("#" + id);
    const scrollY = page.offsetTop;
    scrollTo({ top: scrollY });

    //Change Page Number
    for (let i = 0; i < pages.length; i++) {
      const idLocal = pages[i].id;
      if (idLocal === id) {
        changePageManual(i);
        break;
      }
    }
  }
}
