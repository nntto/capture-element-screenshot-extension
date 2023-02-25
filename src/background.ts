import { getElementClip, ElementClip } from "./utils/getElementClip";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  (async () => {
    console.log(request);
    if (request.type === "captureElementScreenshot") {
      const { query }: { query: string } = request;

      console.log("captureElementScreenshot");
      // タブ情報取得
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const tabId = tab.id;

      // デバッガ起動，待機
      await chrome.debugger.attach({ tabId: tabId }, "1.3");

      // await adjustViewportForElement(tabId, 800, 1000);

      // スクリーンショットパラメータ作成
      const clip = await getElementClip(tabId, query);

      // 画像保存
      const screenshotUrl = await screenshot(tabId, clip);
      console.log(screenshotUrl);

      // デバッガでタッチ
      await chrome.debugger.detach({ tabId: tabId });
      console.log("detach ok");

      sendResponse(screenshotUrl);
    }
  })();
  return true;
});

const screenshot = async (tabId: number | undefined, clip: ElementClip) => {
  console.log(clip);
  const params = {
    format: "png",
    quality: 100,
    clip: {
      ...clip,
      scale: 1,
    },
    captureBeyondViewport: true,
  };

  // スクリーンショット撮影
  const { data } = (await chrome.debugger.sendCommand(
    { tabId: tabId },
    "Page.captureScreenshot",
    params
  )) as unknown as { data: string };

  return data;
};
async function adjustViewportForElement(
  tabId: number | undefined,
  desiredViewportWidth: number,
  desiredViewportHeight: number
) {
  // ビューポートの幅を変更するためのパラメータを作成
  const deviceMetrics = {
    width: desiredViewportWidth,
    height: desiredViewportHeight,
    deviceScaleFactor: 0,
    mobile: false,
    fitWindow: false,
  };

  // ビューポートの幅を変更する
  await chrome.debugger.sendCommand(
    { tabId: tabId },
    "Emulation.setDeviceMetricsOverride",
    deviceMetrics
  );

  // ページの可視領域を変更するためのパラメータを作成
  const visibleSize = {
    width: desiredViewportWidth,
    height: desiredViewportHeight,
  };

  // ページの可視領域を変更する
  await chrome.debugger.sendCommand(
    { tabId: tabId },
    "Emulation.setVisibleSize",
    visibleSize
  );
}
