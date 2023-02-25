function getCssSelector(element: HTMLElement) {
  var names = [];

  while (element.parentNode) {
    if (element.id) {
      names.unshift("#" + element.id);
      break;
    } else {
      if (element == element.ownerDocument.documentElement)
        names.unshift(element.tagName);
      else {
        for (
          var c = 1, e = element;
          e.previousElementSibling;
          e = e.previousElementSibling as HTMLElement, c++
        );
        names.unshift(element.tagName + ":nth-child(" + c + ")");
      }

      element = element.parentNode as HTMLElement;
    }
  }
  return names.join(" > ");
}

export { getCssSelector };
