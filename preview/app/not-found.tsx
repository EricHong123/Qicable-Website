import Link from "next/link";
export default function NotFound() {
  return (
    <main
      style={{
        fontFamily: "Arial,sans-serif",
        padding: 60,
        maxWidth: 760,
        margin: "auto",
      }}
    >
      <h1>Page not found</h1>
      <p>The address does not match an available page.</p>
      <Link href="/">Qicable home →</Link>
    </main>
  );
}
