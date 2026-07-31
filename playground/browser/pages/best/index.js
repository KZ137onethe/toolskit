import "./style.scss";
import { debounce } from "@toolskit/core";
import { throttle } from "@toolskit/core";

// 防抖事件
function debounceEvent() {
  const debounceBox = document.querySelector("#debounce-box");

  const [inputEl, cancelBtnEl, contentEl] = [
    debounceBox.querySelector("input.searchIpt"),
    debounceBox.querySelector("button.cancelBtn"),
    debounceBox.querySelector(".content"),
  ];

  const event = (e) => {
    const value = e.target.value;
    if (!value) {
      contentEl.innerHTML = "";
      return;
    }
    contentEl.innerHTML = "搜索中...";
    debounce((event) => {
      contentEl.innerHTML = `搜索结果为：${Math.floor(Math.random() * 9) + 1}`;
    }, 2000)();
  };

  inputEl.addEventListener("input", event);
  cancelBtnEl.addEventListener("click", () => {
    console.log("cancel");
    inputEvent.cancel();
  });
}

// 节流事件
function throttleEvent() {
  const throttleBox = document.querySelector("#throttle-box");
  const [pointSpanEl, contentEl] = [
    throttleBox.querySelector("span.point-record"),
    throttleBox.querySelector(".content"),
  ];

  const event = throttle((e) => {
    pointSpanEl.innerHTML = `x轴坐标为 ${e.offsetX}, y轴坐标为 ${e.offsetY}`;
  }, 500);

  contentEl.addEventListener("mousemove", event);
  contentEl.addEventListener("mouseleave", () => {
    pointSpanEl.innerHTML = `鼠标已离开网格区域`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  debounceEvent();
  throttleEvent();
});
