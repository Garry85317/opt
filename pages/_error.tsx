import { useRouter } from 'next/router';

export default function ErrorPage() {
  const router = useRouter();
  router.push('/').catch((err) => console.error(err));
}
