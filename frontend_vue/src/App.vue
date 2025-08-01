<template>
  <div id="app">
    <h1>BotVerse - Proyectos</h1>
    <ul>
      <li v-for="project in projects" :key="project.id">
        <router-link :to="`/project/${project.id}`">
          {{ project.name }} - {{ project.description }}
        </router-link>
      </li>
    </ul>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<script>
import api from "./api";

export default {
  data() {
    return {
      projects: [
        {
          id: "12345",
          name: "Probando",
          description: "Probando 123",
        },
      ],
    };
  },
  async mounted() {
    try {
      const response = await api.get("/projects/");
      console.log("Proyectos cargados:", response.data); // <-- Verificar que traen "id"
      this.projects = response.data;
    } catch (err) {
      console.error(err);
    }
  },
};
</script>
