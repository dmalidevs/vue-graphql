<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const route = useRouter();

const title = ref("");
const body = ref("");
// const user_id = 1;
function createPost() {
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
          createPost(title:"${title.value}",body:"${body.value}"){
            id
            title
            body
          }
        }
      `,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      route.push ({ name: "posts" });
    });
}
</script>
<template>
  <form @submit.prevent="createPost">
    <div>
      <label for="title">Title</label>
      <input type="text" name="title" id="title" v-model="title" />
    </div>
    <div>
      <label for="body">Body</label>
      <textarea
        name="body"
        id="body"
        cols="30"
        rows="10"
        v-model="body"
      ></textarea>
    </div>
    <button type="submit">CREATE</button>
  </form>
</template>
