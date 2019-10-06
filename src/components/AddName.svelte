<script>
  import axios from 'axios'
  let name
  async function handleSubmit(params) {
    const token = window.localStorage.getItem('SOD_JWT')
    await axios
      .put(
        '/api/users/addName',
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then(console.log)
    window.location.href = '/'
  }
</script>

<form on:submit|preventDefault="{handleSubmit}" id="formPost">
  <div id="formEmail">
    <label for="name" id="labelEmail">your name</label>
    <input type="text" name="name" id="inEmail" bind:value="{name}" />
  </div>
  <button type="submit">add</button>
</form>
