import { getCssSelector } from "./utils/getCssSelector";
import { downloadImageFile } from "./utils/downloadImageFile";
import { hideElementsExcept } from "./utils/hideElementsExcept";

const excludeFromScreenshot = "exclude-from-screenshot";

const addButton = () => {
  const tagName: string = "table";
  const elements = document.getElementsByTagName(
    tagName
  ) as HTMLCollectionOf<HTMLElement>;

  if (elements.length > 0) {
    [...elements].forEach((element) => {
      const screenshotButton = document.createElement("button");

      screenshotButton.innerHTML = "save";
      screenshotButton.className = `screenshot-button ${excludeFromScreenshot} `;
      screenshotButton.type = "button";
      element.insertAdjacentElement("afterend", screenshotButton);

      screenshotButton.addEventListener("click", async () => {
        // 指定した要素以外を非表示にする
        const hiddenElements = hideElementsExcept(element);

        console.log(getCssSelector(element));
        // スクリーンショットを撮る
        const screenshotUrl = await chrome.runtime.sendMessage({
          type: "captureElementScreenshot",
          query: getCssSelector(element),
        });

        // 画像をダウンロードする
        downloadImageFile("data:image/png;base64," + screenshotUrl, "test.png");

        // 画像を表示する
        // const screenshotImg = new Image();
        // screenshotImg.src = "data:image/png;base64," + screenshotUrl;
        // element.insertAdjacentElement("afterend", screenshotImg);
        // document.body.prepend(screenshotImg);

        // 全ての要素を表示する
        for (const el of hiddenElements) {
          el.style.display = "null";
        }
      });
    });
  }
};

addButton();
