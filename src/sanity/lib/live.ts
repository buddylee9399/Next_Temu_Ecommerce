// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
// import { client } from './client'
import { defineLive } from "next-sanity";
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
})

const token = process.env.SANITY_API_READ_TOKEN;
if(!token) {
  throw new Error("SANITY_API_READ_TOKEN is not set");
}

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
})