<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const user = ref([]);
let loading = ref(true);
onMounted(() => {
  fetch("http://laravel-graphql.test/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      query: `
        query{
          me{
          name  
          email
          }
        }
      `,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      user.value = data.data.me;

      loading.value = false;
      localStorage.removeItem("hasMeReloaded");
      localStorage.removeItem("hasReloaded");
    });
  const hasReloaded = localStorage.getItem("hasMeReloaded");
  if (!hasReloaded) {
    localStorage.setItem("hasMeReloaded", "true");
    window.location.reload();
  }
});

function logout() {
  fetch("http://laravel-graphql.test/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      query: `
        mutation{
          logout{
          message
          }
        }
      `,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.data.logout.message) {
        localStorage.removeItem("token");
        router.push({ name: "login" });
      }
      window.location.reload();
    });
}
</script>
<template>
  <div v-if="loading">Loading...</div>
  <div v-else>
    <div v-if="user" class="post">
      <h1>{{ user?.name }}</h1>
      <p>{{ user?.email }}</p>

      <button @click="logout">Logout</button>
    </div>
    <div v-else>User not found</div>
  </div>
</template>
