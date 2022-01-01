import createBool from "./bool";
import createInt from "./int";
import createStr from "./str";
import { InternalType } from "../expression";
import None from "./none";
import RawType from "../expression/rawType";

/**
 * a utility function to create an internal type from the raw object
 * @param value
 * @returns
 */
export default function createInternalType(value: RawType): InternalType {
  switch (typeof value) {
    case "number":
      return createInt(value);
    case "string":
      return createStr(value);
    case "boolean":
      return createBool(value);
    default:
      if (value === null) {
        return None;
      }
      throw new Error("type not implemented.");
  }
}
