<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const posts = ref([]);
const loading = ref(true);
const page = route.query.page || 1;
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
          posts(page:${page}){
            paginatorInfo{
              currentPage
              lastPage
              total
              hasMorePages
            }
            data{
            id
            title
            }
          }
        }
      `,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      loading.value = false;
      posts.value = data.data.posts;
    });
});
</script>
<template>
  <div class="about">
    <div v-if="loading">Loading...</div>
    <div v-else>
      <ul>
        <li v-for="post in posts.data" :key="post.id">
          <RouterLink :to="`/post/${post.id}`">{{ post.title }}</RouterLink>
        </li>
      </ul>
      <div v-if="posts">
        <div>{{ posts.paginatorInfo?.total }} total results</div>
        <div>
          page {{ posts.paginatorInfo.currentPage }} of
          {{ posts.paginatorInfo.lastPage }}
        </div>
        <div>
          <RouterLink
            :to="`/posts/?page=${posts.paginatorInfo.currentPage - 1}`"
            v-if="posts.paginatorInfo.currentPage > 1"
            >Previous</RouterLink
          >
          <RouterLink
            :to="`/posts/?page=${posts.paginatorInfo.currentPage + 1}`"
            v-if="posts.paginatorInfo.hasMorePages"
            >Next</RouterLink
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
