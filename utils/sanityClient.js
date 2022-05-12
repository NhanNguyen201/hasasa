import sanityClient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = sanityClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: "production",
    apiVersion: '2022-05-10',
    useCdn: true
})

export const writeClient = sanityClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: "production",
    apiVersion: '2022-05-10',
    token: process.env.SANITY_TOKEN,
    useCdn: false
  })
  
const builder = imageUrlBuilder(client)

export const urlFor = source => builder.image(source)