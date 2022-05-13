import { action } from "./action";

(async () => {
  await action(
    "featureBranch",
    "http://localhost:3031",
    "https://httpstat.us/200",
    "key",
    {
      info: console.log,
      error: console.error,
    }
  );
})();
