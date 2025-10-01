'use client';

import { useParams } from "next/navigation";
import SurveyPreview from "@/components/SurveyPreview";

export default function PreviewPage() {
    const { id } = useParams();
    if (!id || typeof id !== "string") return <p>ID invalide</p>;

    return <SurveyPreview id={id} />;
}
