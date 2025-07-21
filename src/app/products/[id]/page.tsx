export default function ProductDetails({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Product Details for {params.id}</h1>
    </div>
  )
} 