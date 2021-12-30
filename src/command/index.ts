import Environment from "../runtime/environment";

import Call from "./call";
import Comment from "./comment";

export interface Command {
  execute(env: Environment): void;
}

export { Call, Comment };
