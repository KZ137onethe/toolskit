import "./style.scss";
import { debounce } from "@toolskit/core/debounce"
import { throttle } from "@toolskit/core/throttle"

const [boxEl1, boxEl2] = [document.querySelector(".box-1"), document.querySelector(".box-2")];

// 防抖
(() => {
  const [searchInput, cancelBtn] = [
    boxEl1.querySelector("input.searchIpt"),
    boxEl1.querySelector("button.cancelBtn"),
  ];

  const searchEvent = debounce(
    (event) => {
      console.log("搜索完毕！", Math.floor(Math.random() * 9) + 1);
      console.log("event: ", event);
    },
    2000,
    {
      leading: false,
      trailing: true,
    },
  );

  searchInput.addEventListener("input", searchEvent);
  cancelBtn.addEventListener("click", () => {
    console.log("cancel");
    searchEvent.cancel();
  });
})();

// 节流
(() => {
  const content = boxEl2.querySelector("div.content");
  const pointSpan = boxEl2.querySelector("span.point-record");

  content.addEventListener(
    "mousemove",
    throttle((e) => {
      pointSpan.innerHTML = `x轴坐标为 ${e.offsetX}, y轴坐标为 ${e.offsetY}`;
    }, 200),
  );

  content.addEventListener("mouseleave", () => {
    pointSpan.textContent = "鼠标已离开网格区域";
  });
})();
