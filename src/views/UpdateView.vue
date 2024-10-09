<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const postID = route.params.id;
const post = ref([]);
let loading = ref(true);
onMounted(() => {
  fetch("http://laravel-graphql.test/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
        query{
          post(id:${postID}){
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
      loading.value = false;
      post.value = data.data.post;
    });
});

function updatePost() {
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
            updatePost(id:${post.value.id},title:"${post.value.title}",body:"${post.value.body}"){
            title
            }
          }
      `,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      router.push ({ name: "posts" });
    });
}
</script>
<template>
  <div v-if="loading">Loading...</div>
  <div v-else>
    <div v-if="post" class="post">
      <form @submit.prevent="updatePost">
        <div>
          <label for="title">Title</label>
          <input type="text" name="title" id="title" v-model="post.title" />
        </div>
        <div>
          <label for="body">Body</label>
          <textarea
            name="body"
            id="body"
            cols="30"
            rows="10"
            v-model="post.body"
          ></textarea>
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
    <div v-else>Post not found</div>
  </div>
</template>
