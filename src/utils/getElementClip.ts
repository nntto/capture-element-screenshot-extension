interface DocumentResponse {
  root: {
    nodeId: number;
  };
}

interface ElementResponse {
  nodeId: number;
}

interface BoxModel {
  model: {
    width: number;
    height: number;
    border: number[];
  };
}

interface LayoutMetrics {
  visualViewport: {
    scale: number;
  };
}

interface EvalResult {
  result: {
    value: number;
  };
}

interface ElementClip {
  x: number;
  y: number;
  width: number;
  height: number;
}

const getElementClip = async (
  tabId: number | undefined,
  query: string
): Promise<ElementClip> => {
  const doc = (await chrome.debugger.sendCommand(
    { tabId },
    "DOM.getDocument",
    {}
  )) as unknown as DocumentResponse;

  const elem = (await chrome.debugger.sendCommand(
    { tabId },
    "DOM.querySelector",
    { nodeId: doc.root.nodeId, selector: query }
  )) as unknown as ElementResponse;

  console.log(query, elem);

  // 要素のx,y,width,heightを取得
  const boxModel = (await chrome.debugger.sendCommand(
    { tabId },
    "DOM.getBoxModel",
    { nodeId: elem.nodeId }
  )) as unknown as BoxModel;

  console.log("boxModel", boxModel);

  const x = boxModel.model.border[0];
  const y = boxModel.model.border[1];
  const width = boxModel.model.width;
  const height = boxModel.model.height;

  // scrollを考慮
  const {
    result: { value: scrollY },
  } = (await chrome.debugger.sendCommand({ tabId }, "Runtime.evaluate", {
    expression: "window.scrollY",
  })) as unknown as EvalResult;

  const {
    result: { value: scrollX },
  } = (await chrome.debugger.sendCommand({ tabId }, "Runtime.evaluate", {
    expression: "window.scrollX",
  })) as unknown as EvalResult;

  // ページ拡大率を考慮
  const metrics = (await chrome.debugger.sendCommand(
    { tabId },
    "Page.getLayoutMetrics"
  )) as unknown as LayoutMetrics;

  const scale = metrics.visualViewport.scale;

  console.log(scale);

  // 絶対座標
  const absoluteX = x * scale + scrollX;
  const absoluteY = y * scale + scrollY;
  const absoluteHeight = height * scale;
  const absoluteWidth = width * scale;

  console.log("absoluteX:", absoluteX);
  console.log("absoluteY:", absoluteY);
  console.log("absoluteHeight:", absoluteHeight);
  console.log("absoluteWidth:", absoluteWidth);
  console.log("x:", x);
  console.log("y:", y);
  console.log("width:", width);
  console.log("height:", height);

  return {
    x: absoluteX,
    y: absoluteY,
    width: absoluteWidth,
    height: absoluteHeight,
  };
};

export { getElementClip, ElementClip };
