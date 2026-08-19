import { CourseDetailPreview } from "@/components/courses/CourseDetailPreview";

interface Props {
  params: {
    id: string;
  };
}

export default function CursoDetailPage({ params }: Props) {
  return <CourseDetailPreview courseId={params.id} />;
}
