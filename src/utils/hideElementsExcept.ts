function hideElementsExcept(element: HTMLElement): HTMLElement[] {
  const array = [];
  const allElements = document.querySelectorAll(
    "body *"
  ) as NodeListOf<HTMLElement>;
  for (const el of allElements) {
    if (el === element || el.contains(element) || element.contains(el)) {
      el.style.display = "";
    } else {
      el.style.display = "none";
      array.push(el);
    }
  }
  return array;
}

export { hideElementsExcept };
