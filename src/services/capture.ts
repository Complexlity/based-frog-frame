import { $fetch, FetchError } from 'ofetch'


// const BASE_URL = 'https://capture.kodadot.art'
// const BASE_URL = "http://localhost:3000/api";
const BASE_URL = "https://vercelgl-beta.vercel.app/api";

export const doScreenshot = async (url: string) => {

  try {
    console.log("Fetching image...")
    const res = await fetch(`${BASE_URL}/screenshot`, {
      method: 'POST',
      body: JSON.stringify({
        url,
      })
    })



    if (!res.ok) {
      console.log("res is not okay")
      return null
    }

    const image = await res.text()
    console.log({image})
    return image

  } catch (error) {
    console.log({error})
    if (error instanceof FetchError) {
      console.error(error.response)
    }
  }

  return null
}
