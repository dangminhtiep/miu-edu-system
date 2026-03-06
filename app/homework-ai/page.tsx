import { HomeworkAiWorkspace } from "@/app/homework-ai/HomeworkAiWorkspace";
import { getHomeworkAiOverview } from "@/lib/homework-ai/service";

export const dynamic = "force-dynamic";

export default async function HomeworkAiPage() {
  const overview = await getHomeworkAiOverview();

  return (
    <HomeworkAiWorkspace
      assignments={overview.assignments}
      submissions={overview.submissions}
      complaints={overview.complaints}
      metrics={overview.metrics}
      activeProvider={overview.activeProvider}
    />
  );
}
