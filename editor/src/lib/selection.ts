export interface BasicSelection {
  start: number;
  end: number;
}

export interface FancierSelection {
  startNode: Element;
  startNodeOffset: number;
  endNode: Element;
  endNodeOffset: number;
}

export function fancierSaveSelectionInternal(containerEl: HTMLDivElement): FancierSelection {
  const range = document.getSelection()?.getRangeAt(0);
}

/**
 * @param containerEl element at the start of reconciliation range. This should be the node where the changes started
 * (important note for future caching).
 */
export function saveSelectionInternal(
  containerEl: HTMLDivElement,
  whitespaceCount: number,
): BasicSelection {
  const range = window.getSelection()?.getRangeAt(0);
  const prevRange = new Range();
  prevRange.selectNodeContents(containerEl);
  // const preSelectionRange = range?.cloneRange();
  // console.log("before: ", preSelectionRange);
  // preSelectionRange?.selectNodeContents(containerEl);
  // console.log("after: ", preSelectionRange);
  // const start = preSelectionRange!.toString().length;
  const start = prevRange!.toString().length;

  return { start: start, end: start + range!.toString().length + whitespaceCount };
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
      // todo: on node level, should we have this comparison based on the max depth (max selection length)? or does the selection start change when we do setStartAfter() ?
      if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
        range.setStart(textNode, savedSel.start - charIndex);
        foundStart = true;
      }
      if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
        range.setEnd(textNode, savedSel.end - charIndex);
        stop = true;
      }
      charIndex = nextCharIndex;
    } else if (node.nodeName === "BR") {
      range.setStartAfter(node);
      range.setEndAfter(node);
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
