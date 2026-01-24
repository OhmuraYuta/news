export default function Loading() {
  return (
    <div className="relative h-24 w-24 animate-spin rounded-full"
      style={{
        background: "conic-gradient(from 90deg, rgba(20, 37, 55, 0) 0deg, #3E6EA2 360deg)",
        maskImage: "radial-gradient(farthest-side, transparent calc(100% - 8px), #fff 0)",
        WebkitMaskImage: "radial-gradient(farthest-side, transparent calc(100% - 8px), #fff 0)"
      }}>
    </div>
  )
}