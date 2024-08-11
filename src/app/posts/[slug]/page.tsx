import { PostsCollection } from "@/config/collections"

export default function PostsPage({ params }: { params: { slug: string[] } }) {
  const data = PostsCollection.getSource(params.slug)

  console.log({ data })
  if (!data) {
    return <>Is this the correct page</>
  }
  return (
    <>
      <h2>{data.getTitle()}</h2>
    </>
  )
}
