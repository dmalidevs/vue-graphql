<script setup>
import { onMounted, ref } from "vue";
import { useRoute,useRouter } from "vue-router";
const route = useRoute();
const postID = route.params.id;
const router = useRouter();
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
      console.log(data);
      
      loading.value = false;
      post.value = data.data.post;
    });
});

function deletePost() {
  fetch("http://laravel-graphql.test/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
          mutation{
            deletePost(id:${postID}){
            id  
            title
            }
          }
      `,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      router.push({ name: "posts" });
    });
}
</script>
<template>
  <div v-if="loading">Loading...</div>
  <div v-else>
    <div v-if="post" class="post">
      <h1>{{ post?.title }}</h1>
      <p>{{ post?.body }}</p>
      <!-- <p>{{ post?.user_id }}</p> -->
      <RouterLink :to="`/post/${post?.id}/edit`">Update</RouterLink>
      <button @click="deletePost">Delete</button>
    </div>
    <div v-else>Post not found</div>
  </div>
</template>
