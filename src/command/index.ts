import Environment from "../runtime/environment";

import Assignment from "./assignment";
import Call from "./call";
import Comment from "./comment";
import End from "./end";

/**
 * Each class that implements `Command` has own behaviors.
 */
export interface Command {
  execute(env: Environment): void;
}

export { Assignment, Call, Comment, End };
