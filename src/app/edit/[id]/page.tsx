'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SurveyCreatorWidget from "@/components/SurveyCreator";

export default function SurveyEditorPage() {
    const params = useParams();
    const id = params?.id as string;

    const [surveyJson, setSurveyJson] = useState<any>(null);
    const [name, setName] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id || id === "new") {
            setLoading(false);
            return;
        }

        const fetchSurvey = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/getSurvey?surveyId=${id}`);
                if (!res.ok) throw new Error("Failed to load the survey");
                const data = await res.json();
                setSurveyJson(data.json);
                setName(data.name || "");
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSurvey();
    }, [id]);

    if (loading) return null;

    return (
        <div className="flex flex-col h-screen w-screen">
            <div className="p-6">
                <h1 className="text-xl font-bold mb-4">
                    {id === "new" ? "Create a Survey" : "Edit Survey"}
                </h1>

                {id !== "new" && (
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-4 border-b pb-2">
                        {name || "Untitled Survey"}
                    </h2>
                )}
            </div>

            <div className="flex-1 min-h-0">
                <SurveyCreatorWidget id={id !== "new" ? id : undefined} json={surveyJson}/>
            </div>
        </div>
    );
}
