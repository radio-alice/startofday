<script>
  import axios from 'axios'
  import { onMount } from 'svelte'
  import { stores } from '@sapper/app'
  import AddName from '../components/AddName.svelte'
  import Post from '../components/Post.svelte'
  const { page } = stores()
  const {query} = $page

  let currentUser, inSod, posts = []
  let inEmail = '',
    signUpSuccess = false,
    signUpFailure = false,
    hasPosted = false,
    localToken

  const storeToken = async () => {
    const token = query.token
    const getNewTokenURL = `/api/auth/magic-link?token=${token}`
    const { data } = await axios.get(getNewTokenURL)
    window.localStorage.setItem('SOD_JWT', data)
    window.location.href = '/'
  }

  const getNewPosts = async () => {
    const res = await axios.get('/api/posts?day=0')
    posts = res.data
  }
  const getUser = async (token) => {
    if (!token) return false
    const res = await axios.get('/api/users/me', {headers: {Authorization: `Bearer ${token}`}} )
    return res.data
  }

  onMount(async () => {
    if (query.token) await storeToken()
    localToken = window.localStorage.getItem('SOD_JWT')
    currentUser = await getUser(localToken)
    await getNewPosts()
    if (!currentUser) return
    posts.map(post => {if (post.author._id = currentUser._id) hasPosted = true})
  })

  async function handlePost() {
    if (!inSod) return
    if (!inEmail && !currentUser) return
    const data = {
      author: currentUser.email || inEmail,
      post: inSod
    }
    if (!currentUser) {
      try {
        await axios.post('/api/auth/', {
          email: inEmail
        })
        await axios.post('/api/posts', data)
        signUpSuccess = true
      } catch (error) {
        console.error(error)
        signUpFailure = true
      }
    } else {
      await axios.post('/api/posts', data,  {headers: {Authorization: `Bearer ${localToken}`}})
    }
    hasPosted = true
    await getNewPosts()
  }
</script>

<main>
  <div id="postWrapper">
    {#each posts as post (post.date)}
    <Post post={post} user={currentUser} token={localToken}/>
    {/each}
  </div>
</main>
{#if (!hasPosted)}
  <form on:submit|preventDefault="{handlePost}" id="formPost">
    <div id="formSod">
      <textarea name="sod" id="inSod" bind:value="{inSod}" rows="5" cols="36" wrap="hard"/>
      <label for="sod">what are you working on today?</label>
    </div>
    {#if (!currentUser)}
      <div id="formEmail">
        <label for="email" id="labelEmail">email</label>
        <input type="email" name="email" id="inEmail" bind:value="{inEmail}" />
      </div>
      {#if (signUpFailure)}
        <p>Something went wrong shit maybe try again</p>
        {:else if (signUpSuccess)}
        <p>Check you're email for a sign-up link!</p>
      {/if}
    {/if}
    <button type="submit">POST</button>
  </form>
{:else if (currentUser) && (!currentUser.name)}
  <AddName />
{/if}
