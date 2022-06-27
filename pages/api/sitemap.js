import groq from 'groq'
import { client } from '../../utils/sanityClient'
import {slugToAbsUrl} from '../../utils/urls'

export default async function handler(req, res) {
  const {allRoutesSlugs, baseUrl} = await client.fetch(groq`{
    "allRoutesSlugs": *[
      _type == "route" &&
      !(_id in path("drafts.**")) &&
      includeInSitemap != false &&
      disallowRobots != true
    ].slug.current,
    "baseUrl": *[_type == "site-config"][0].url,
  }`)

  const sitemap = `
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allRoutesSlugs
      .map(
        (slug) => `
    <url>
      <loc>${slugToAbsUrl(slug, baseUrl)}</loc>
    </url>
    `
      )
      .join('\n')}
  </urlset>`

  res.status(200).send(sitemap)
}