export type Node = {
  id: string;
  type: string;
  content: string;
  connections: string[];
};

export type Flow = {
  id: string;
  name: string;
  project_id: string;
  nodes: Node[];
  created_at: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export type FullProject = Project & { flows: Flow[] };