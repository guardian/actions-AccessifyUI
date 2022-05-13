import * as core from "@actions/core";
import * as github from "@actions/github";
import { action } from "./action";

async () => {
  const branch = github.context.ref;
  const storybookBaseUrl = core.getInput("storybookBaseUrl");
  const publishBaseUrl = core.getInput("publishBaseUrl");
  const publishKey = core.getInput("publishKey");
  const logging = {
    info: core.info,
    error: core.error,
  };

  action(branch, storybookBaseUrl, publishBaseUrl, publishKey, logging);
};
