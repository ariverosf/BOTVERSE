<template>
  <div>
    <h2>Flujos:</h2>
    <ul>
      <li v-for="flow in project.flows" :key="flow.id">
        <div v-if="editingFlowId === flow.id">
          <input v-model="flowEditName" />
          <button @click="updateFlow(flow.id)">Guardar</button>
          <button @click="cancelEdit()">Cancelar</button>
        </div>
        <div v-else>
          {{ flow.name }}
          <button @click="startEdit(flow)">Editar</button>
          <button @click="deleteFlow(flow.id)">Eliminar</button>
        </div>
      </li>
    </ul>

    <h3>Crear nuevo flujo</h3>
    <form @submit.prevent="createFlow">
      <div>
        <label for="flowName">Nombre del flujo:</label>
        <input type="text" v-model="newFlow.name" id="flowName" required />
      </div>
      <div>
        <label for="flowDescription">Descripción:</label>
        <input type="text" v-model="newFlow.description" id="flowDescription" />
      </div>
      <button type="submit">Crear flujo</button>
    </form>
  </div>
</template>

<script>
import api from "../api";

export default {
  data() {
    return {
      project: { flows: [] },
      newFlow: {
        name: "",
        description: "",
        nodes: [],
      },
      editingFlowId: null,
      flowEditName: "",
    };
  },
  async created() {
    const id = this.$route.params.id;
    await this.fetchProjectWithFlows(id);
  },
  methods: {
    async fetchProjectWithFlows(id) {
      try {
        const response = await api.get(`/projects/${id}/full`);
        this.project = response.data;
      } catch (error) {
        console.error("Error cargando proyecto:", error);
      }
    },
    async createFlow() {
      try {
        const payload = {
          name: this.newFlow.name,
          project_id: this.$route.params.id,
          nodes: this.newFlow.nodes,
        };
        const response = await api.post("/flows/", payload);
        this.project.flows.push({
          id: response.data.id,
          name: this.newFlow.name,
          description: this.newFlow.description,
          nodes: this.newFlow.nodes,
        });
        this.newFlow.name = "";
        this.newFlow.description = "";
        this.newFlow.nodes = [];
      } catch (error) {
        console.error("Error creando flujo:", error);
      }
    },
    startEdit(flow) {
      this.editingFlowId = flow.id;
      this.flowEditName = flow.name;
    },
    cancelEdit() {
      this.editingFlowId = null;
      this.flowEditName = "";
    },
    async updateFlow(flowId) {
      try {
        await api.put(`/flows/${flowId}`, { name: this.flowEditName });
        const flow = this.project.flows.find((f) => f.id === flowId);
        if (flow) flow.name = this.flowEditName;
        this.cancelEdit();
      } catch (error) {
        console.error("Error actualizando flujo:", error);
      }
    },
    async deleteFlow(flowId) {
      try {
        await api.delete(`/flows/${flowId}`);
        this.project.flows = this.project.flows.filter((f) => f.id !== flowId);
      } catch (error) {
        console.error("Error eliminando flujo:", error);
      }
    },
  },
};
</script>
