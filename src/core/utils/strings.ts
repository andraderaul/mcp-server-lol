export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

type State = "completed" | "unstarted" | "inProgress";
export function capitalizeState(state: State): string {
  if (!state) return "Unknown";

  const stateMap: Record<State, string> = {
    completed: "✅ Completed",
    inProgress: "🔴 In Progress",
    unstarted: "⏳ Not Started",
  };

  return stateMap[state] || `📊 ${capitalize(state)}`;
}
