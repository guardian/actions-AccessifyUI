import { SerializedAXNode } from "puppeteer";

type Result = {
  component: string;
  tree: SerializedAXNode[];
};

type Results = {
  branch: string;
  results: Result[];
};

export const publish = async (
  results: Results,
  publishBaseUrl: string,
  publishKey: string
) => {
  await fetch(`${publishBaseUrl}/api/publish`, {
    method: "post",
    body: JSON.stringify(results),
    headers: {
      "Content-Type": "application/json",
      Auth: `Bearer ${publishKey}`,
    },
  });
};
