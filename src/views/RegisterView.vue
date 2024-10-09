<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const route = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const password_confirmation = ref("");
function register() {
  fetch("http://laravel-graphql.test/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
      mutation {
        register(input: {
          name: "${name.value}",
          email: "${email.value}",
          password: "${password.value}",
          password_confirmation: "${password_confirmation.value}"
        }) {
          token
        }
      }
    `,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      
      localStorage.setItem("token", data.data.register.token);
      route.push({ name: "me" });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
</script>
<template>
  <form @submit.prevent="register">
    <div>
      <label for="name">Name</label>
      <input type="text" name="name" id="name" v-model="name" />
    </div>
    <div>
      <label for="email">Email</label>
      <input type="text" name="email" id="email" v-model="email" />
    </div>
    <div>
      <label for="password">password</label>
      <input type="text" name="password" id="password" v-model="password" />
    </div>
    <div>
      <label for="password_confirmation">Password Confirmation</label>
      <input
        type="text"
        name="password_confirmation"
        id="password_confirmation"
        v-model="password_confirmation"
      />
    </div>
    <button type="submit">CREATE</button>
  </form>
</template>
