import invariant from "./utils/invariant";

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

  static getRangeInfo(node: SelectionNode): SelectionNode["rangeInfo"] {
    if (node.rangeInfo) return node.rangeInfo;
    if (!node.children) return undefined;
    for (const child of node.children.reverse()) {
      const currInfo = SelectionNode.getRangeInfo(child);
      if (currInfo) return currInfo;
    }
  }
}

function saveSelection(element: HTMLElement) {
  const selection = document.getSelection();
  if (!selection) return null;
  const range = selection.getRangeAt(0);

  const canvasNode = new SelectionNode(element, range);
  // console.log(canvasNode);
  return canvasNode;
}

/**
 * When there is a need for a reconciliation:
 * if there is an element <div><span>return></span></div>
 * adding a whitespace will result in:
 * ...<span>return </span>...
 * but what the renderer will produce is:
 * ...<span>return</span><span>&nbsp;</span>
 *
 * similarly, if there's a new token like in case of "return" -> "return+"
 *
 * Few things:
 * !## tokenSelection tree will be only one node off the correct
 * !## if selection is not collapsed, it must be correct
 * !## restoreSelection should always have collapsed selection - restoring after dom update
 * 1. iterate at the same time over two trees: original element tree and SelectionNode tree
 * 2. get to the end of selectionTree -> this is where the end of the selection is
 * 3. check length of the node is less than the offset:
 *     - no => offset is correct
 *     - yes => use beginning of next node (have to go up one level from textNode to SPAN, then take next SPAN.text)
 */
function restoreSelection(node: Node, prevSelNode: SelectionNode): void {
  const endNodeIdx = prevSelNode.children!.length - 1;
  const endNodeLevel1 = prevSelNode.children![endNodeIdx];
  invariant(endNodeLevel1.containsEnd(), "Range end expected.");
  const rangeInfo = SelectionNode.getRangeInfo(endNodeLevel1);
  invariant(typeof rangeInfo?.rangeStart !== undefined, "Range start expected.");
}

export { saveSelection, restoreSelection };
