import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function RootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
    const role = payload.user_metadata?.role ?? 'adotante';
    redirect(role === 'admin' ? '/solicitacoes' : '/solicitacoes');
  } catch {
    redirect('/login');
  }
}
