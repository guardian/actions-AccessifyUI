import { publish } from "./api";
import { getAccessibilityTree } from "./puppeteer";
import { getStorybookComponentUrl, getStorybooks } from "./storybook";

(async () => {
  const publishKey = "dotcom-rendering";
  const branch = "main";
  const storybookBaseUrl =
    "https://5dfcbf3012392c0020e7140b-gjqnopoekv.chromatic.com";
  const publishBaseUrl = "https://a11y.ashleigh.rocks";

  const stories = await getStorybooks(storybookBaseUrl);

  let accessibilityTrees = await Promise.all(
    stories.map(async (s) => ({
      component: s,
      tree: await getAccessibilityTree(
        getStorybookComponentUrl(storybookBaseUrl, s),
        "#root"
      ),
    }))
  );

  await publish(
    {
      branch: branch,
      results: accessibilityTrees,
    },
    publishBaseUrl,
    publishKey
  );
})();
