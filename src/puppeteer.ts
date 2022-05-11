import puppeteer, { SerializedAXNode } from "puppeteer";

const removeNones = (
  nodes: SerializedAXNode[] | undefined
): SerializedAXNode[] => {
  if (nodes === undefined) {
    return [];
  }

  var newNodes: SerializedAXNode[] = [];

  for (const node of nodes) {
    if (node.role === "none") {
      newNodes = newNodes.concat(removeNones(node.children));
    } else {
      node.children = removeNones(node.children);
      newNodes.push(node);
    }
  }

  return newNodes;
};

export const getAccessibilityTree = async (
  url: string,
  selector: string
): Promise<SerializedAXNode[]> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  const hrefElement = await page.$(selector);

  if (hrefElement === null) {
    return [];
  }

  const snapshot = await page.accessibility.snapshot({
    interestingOnly: false,
  });

  await browser.close();

  return removeNones(snapshot.children);
};
