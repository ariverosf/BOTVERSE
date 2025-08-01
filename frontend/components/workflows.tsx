import useQuery from "@/hooks/use-query";
import WorkflowItem from "@/components/workflow-item";
import { FullProject } from "@/lib/api";

type WorkflowsProps = {
  loading: boolean;
  hasError: boolean;
  data: FullProject[] | null;
  selected: FullProject | null;
  onSelect: (workflow: FullProject) => void;
};

export default function Workflows({ loading, hasError, data, selected, onSelect }: WorkflowsProps) {
  const hasData = !!data?.length;
  const isEmpty = !loading && data?.length === 0;

  return (
    <div className="space-y-2">
      {loading && !hasError && <p>Cargando flujos de trabajo...</p>}

      {!loading && hasData &&
        data!.map((workflow) => (
          <WorkflowItem
            key={workflow.id}
            title={workflow.name}
            description={workflow.description ?? ""}
            isSelected={workflow.id === selected?.id}
            onClick={() => onSelect(workflow)}
          />
        ))}

      {!loading && !hasError && isEmpty && (
        <p>No hay flujos de trabajo creados hasta el momento.</p>
      )}

      {isEmpty && hasError && (
        <p>Ocurrió un error obteniendo los flujos de trabajo.</p>
      )}
    </div>
  );
}
