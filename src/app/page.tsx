import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold">Welcome to EventApp</h1>
      <Link href="/events" className="text-blue-600 underline mt-4 inline-block">
        Go to Events
      </Link>
    </div>
  );
}