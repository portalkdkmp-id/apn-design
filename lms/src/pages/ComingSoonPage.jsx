import { MainLayout } from '../layouts/MainLayout'
import { Card, CardContent } from '../components/ui/Card'

// Placeholder sementara untuk halaman yang belum dibangun (detail akan
// menyusul di iterasi berikutnya), supaya menu di sidebar tidak menuju 404.
export function ComingSoonPage({ title, description }) {
  return (
    <MainLayout title={title}>
      <Card>
        <CardContent className="p-10 text-center">
          <p className="text-lg font-medium">{title}</p>
          <p className="mt-2 text-sm text-black/50 dark:text-white/50">
            {description ?? 'Halaman ini sedang dalam pengembangan.'}
          </p>
        </CardContent>
      </Card>
    </MainLayout>
  )
}

export default ComingSoonPage
