import { PostsSource } from "@/config/collections"

export default async function PostsPage({
  params,
}: {
  params: { slug: string[] }
}) {
  const data = await PostsSource.get(params.slug)

  if (!data) {
    return <>Is this the correct page</>
  }

  const { Content } = data

  return (
    <>
      <h2>{data.title}</h2>
      <div>{Content ? <Content /> : <>No Content</>}</div>
    </>
  )
}
