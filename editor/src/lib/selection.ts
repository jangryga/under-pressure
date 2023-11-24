export interface BasicSelection {
  start: number;
  end: number;
}

export function saveSelectionInternal(containerEl: HTMLDivElement): BasicSelection {
  const range = window.getSelection()?.getRangeAt(0);
  const preSelectionRange = range?.cloneRange();
  preSelectionRange?.selectNodeContents(containerEl);
  preSelectionRange!.setEnd(range!.startContainer, range!.startOffset);
  const start = preSelectionRange!.toString().length;

  return { start: start, end: start + range!.toString().length };
}

export function restoreSelection(containerEl: HTMLDivElement, savedSel: BasicSelection) {
  let charIndex = 0;
  let range = document.createRange();
  range.setStart(containerEl, 0);
  range.collapse(true);
  let nodeStack: Node[] = [containerEl];
  let node: Node | undefined;
  let foundStart = false;
  let stop = false;

  while (!stop && (node = nodeStack.pop())) {
    if (node.nodeType === Node.TEXT_NODE) {
      const textNode = node as Text;
      const nextCharIndex = charIndex + textNode.length;
      if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
        range.setStart(textNode, savedSel.start - charIndex);
        foundStart = true;
      }
      if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
        range.setEnd(textNode, savedSel.end - charIndex);
        stop = true;
      }
      charIndex = nextCharIndex;
    } else {
      let i = node.childNodes.length;
      while (i--) {
        nodeStack.push(node.childNodes[i]);
      }
    }
  }

  const sel = window.getSelection();
  sel!.removeAllRanges();
  sel!.addRange(range);
}
