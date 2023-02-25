function hideElementsExcept(element: HTMLElement): HTMLElement[] {
  const array = [];
  const allElements = document.querySelectorAll(
    "body *"
  ) as NodeListOf<HTMLElement>;
  for (const el of allElements) {
    // すでに非表示の要素は対象外
    if (el.style.display !== "none") {
      // 指定した要素か、その子要素か、その親要素の場合は表示する
      if (el === element || el.contains(element) || element.contains(el)) {
        el.style.display = "";
      } else {
        el.style.display = "none";
        array.push(el);
      }
    }
  }
  return array;
}

export { hideElementsExcept };
