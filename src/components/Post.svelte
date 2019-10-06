<script>
  import axios from 'axios'
  export let post,
    user = {},
    token
  let inLink = ''

  async function handleAddLink() {
    if (!inLink) return
    const url = '/api/posts/addLink'
    const data = { postId: post._id, url: inLink }
    const headers = { headers: { Authorization: `Bearer ${token}` } }
    await axios.put(url, data, headers)
    await getNewPosts()
    inLink = ''
  }
</script>

<div class="post">
  <div class="postHead">
    <em>
      {(post.author.name) ? post.author.name : 'somebody'}'s SOD for {new
      Date(post.date).toLocaleDateString()}:
    </em>
  </div>
  <p class="postSod">{post.post}</p>
  {#if post.links}
  <details>
    <summary>
      Links to work:
    </summary>
    <ul>
      {#each post.links as link}
      <li>↝ <a href="{link}">{link}</a></li>
      {/each}
    </ul>
  </details>
  {/if} {#if user._id === post.author._id}
  <form on:submit|preventDefault="{handleAddLink}" class="formLink">
    <input
      type="url"
      name="link"
      class="inLink"
      bind:value="{inLink}"
      placeholder="add a link to your work"
    />
    <button type="submit" class="plusButton">+</button>
  </form>
  {/if}
</div>
