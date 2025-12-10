"use client"
import ActionMenu from "@/components/action-menu";
import FlowList from "@/components/flow-list";
import RightPanel from "@/components/right-panel";
import FlowCanvas from "@/components/canvas/flow-canvas";
import { useWorkflowStore } from "@/store/workflowStore";
import { ReactFlowProvider } from "@xyflow/react";
import { useEffect, useMemo } from "react";

export default function WorkflowsPage() {
  const { actionMenuVisible, selectedNode, getSelectedNode, getProjectList } = useWorkflowStore();
  const node = getSelectedNode();
  
  useEffect(() => {
    getProjectList()
  }, [getProjectList]);
  
  return (
    <div className="flex w-full h-full relative">
      <ReactFlowProvider>
        <FlowList />
      { actionMenuVisible && <ActionMenu /> }
        <FlowCanvas />
      </ReactFlowProvider>
      { node && node.type === "ActionNode" && <RightPanel /> }
    </div>
  );
}