<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const route = useRouter();

const email = ref("");
const password = ref("");
function login() {
  fetch("http://laravel-graphql.test/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
      mutation{
        login(input:{
        email:"${email.value}",
        password:"${password.value}",
        }){
          token
        }
      }
    `,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      localStorage.setItem("token", data.data?.login.token);
      route.push({ name: "me" });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
onMounted(() => {
  const hasReloaded = localStorage.getItem("hasReloaded");
  if (!hasReloaded) {
    localStorage.setItem("hasReloaded", "true");
    window.location.reload();
  }
})
</script>
<template>
  <form @submit.prevent="login">
    <div>
      <label for="email">Email</label>
      <input type="text" name="email" id="email" v-model="email" />
    </div>
    <div>
      <label for="password">password</label>
      <input type="text" name="password" id="password" v-model="password" />
    </div>
    <button type="submit">Login</button>
  </form>
</template>
