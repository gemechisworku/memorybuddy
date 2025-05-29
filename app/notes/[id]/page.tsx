// app/notes/[id]/page.tsx
import ClientNotePage from './ClientNotePage';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function NotePage({ params }: PageProps) {
  const { id } = await params; // Resolve the Promise in the server component
  return <ClientNotePage id={id} />; // Pass id to client component
}