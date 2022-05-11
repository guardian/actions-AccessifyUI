import fetch from "node-fetch";

type StorybookData = {
  stories: [string, any];
};

export const getStorybooks = async (
  storybookDomain: string
): Promise<string[]> => {
  var results = await fetch(`${storybookDomain}/stories.json`);
  var resultsJson: StorybookData = (await results.json()) as StorybookData;

  return Object.keys(resultsJson.stories);
};

export const getStorybookComponentUrl = (
  baseStorybookUrl: string,
  component: string
): string => {
  return `${baseStorybookUrl}/iframe.html?id=${component}&viewMode=story`;
};
