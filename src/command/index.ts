import Environment from "../runtime/environment";

import Call from "./call";
import Comment from "./comment";
import End from "./end";

export interface Command {
  execute(env: Environment): void;
}

export { Call, Comment, End };
