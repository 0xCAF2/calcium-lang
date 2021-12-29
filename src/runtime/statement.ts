import Keyword from "../keyword";

type Statement = [number, unknown[], Keyword.Command, ...unknown[]];

export default Statement;
