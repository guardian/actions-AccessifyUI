import { publish } from "./api";
import { getAccessibilityTree } from "./puppeteer";
import { getStorybookComponentUrl, getStorybooks } from "./storybook";
import puppeteer from "puppeteer";

type Logging = {
  info: (message: string) => void;
  error: (message: string | Error) => void;
};

export const action = async (
  branch: string,
  storybookBaseUrl: string,
  publishBaseUrl: string,
  publishKey: string,
  logging: Logging
) => {
  logging.info(`Reading stories from: ${storybookBaseUrl}`);
  const stories = await getStorybooks(storybookBaseUrl);
  logging.info(` - found ${stories.length} stories`);

  const browser = await puppeteer.launch();

  logging.info("Reading accessibility trees");
  let accessibilityTrees = [];
  let i = 0;
  for (const story of stories) {
    if (i % 10 === 0) logging.info(` - Progress ${i} out of ${stories.length}`);
    i++;
    accessibilityTrees.push({
      component: story,
      tree: await getAccessibilityTree(
        browser,
        getStorybookComponentUrl(storybookBaseUrl, story),
        "#root"
      ),
    });
  }
  logging.info(` - Done reading accessibility trees`);

  await browser.close();

  logging.info(`Publishing build to: ${publishBaseUrl}`);
  await publish(
    {
      branch: branch,
      results: accessibilityTrees,
    },
    publishBaseUrl,
    publishKey
  );
  logging.info(` - Published!`);
};
