class SelectionNode {
  public name: string;
  public children: SelectionNode[] | undefined;
  public value: string | undefined;
  public rangeInfo:
    | {
        rangeStart?: boolean;
        rangeStartOffset?: number;
        rangeEnd?: boolean;
        rangeEndOffset?: number;
      }
    | undefined;

  constructor(node: Node, domRange: Range) {
    if (domRange.startContainer === node) {
      this.rangeInfo = {
        ...this.rangeInfo,
        rangeStart: true,
        rangeStartOffset: domRange.startOffset,
      };
    }
    if (domRange.endContainer === node) {
      this.rangeInfo = {
        ...this.rangeInfo,
        rangeEnd: true,
        rangeEndOffset: domRange.endOffset,
      };
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      switch (element.tagName) {
        case "DIV":
          this.name = "DIV";
          break;
        case "BR":
          this.name = "BR";
          break;
        case "SPAN":
          this.name = "SPAN";
          break;
        default:
          throw Error(`Unsupported element ${element.tagName}`);
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      const element = node as Text;
      this.name = "TEXT";
      this.value = element.textContent!;
    } else {
      throw Error(`Unsupported node type ${node.nodeType}`);
    }

    if (node.childNodes) {
      this.children = [];
      if (!this.rangeInfo?.rangeEnd) {
        for (const ch of node.childNodes) {
          const chn = new SelectionNode(ch, domRange);
          this.children.push(chn);
          if (chn.containsEnd()) break;
        }
      }
    }
  }

  containsEnd() {
    if (this.rangeInfo?.rangeEnd) return true;
    if (this.children) {
      for (const child of this.children) {
        if (child.containsEnd()) return true;
      }
    }
    return false;
  }
}

function saveSelection(element: HTMLElement) {
  const selection = document.getSelection();
  if (!selection) return null;
  const range = selection.getRangeAt(0);

  const canvasNode = new SelectionNode(element, range);
  console.log(canvasNode);
}

function restoreSelection() {}

export { saveSelection };
