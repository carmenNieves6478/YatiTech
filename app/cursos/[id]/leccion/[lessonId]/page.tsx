import { LessonPlayer } from "@/components/lesson/LessonPlayer";

interface Props {
  params: {
    id: string;
    lessonId: string;
  };
}

export default function LeccionPage({ params }: Props) {
  return <LessonPlayer courseId={params.id} lessonId={params.lessonId} />;
}
