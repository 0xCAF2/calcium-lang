/**
 * the result of execution on `Runtime`
 */
enum Status {
  AtBreakpoint = "AtBreakpoint",
  ExceptionUnhandled = "ExceptionUnhandled",
  Paused = "Paused",
  Running = "Running",
  Terminated = "Terminated",
}

export default Status;
