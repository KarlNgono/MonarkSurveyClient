'use client';

import { useEffect, useState } from "react";
import { Survey } from "survey-react-ui";
import { Model } from "survey-core";
import "survey-core/survey-core.css";

interface SurveyItem {
    id: string;
    name: string;
    json: any;
}

export default function SurveyPreview({ id }: { id: string }) {
    const [survey, setSurvey] = useState<SurveyItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSurvey() {
            try {
                const res = await fetch(`http://localhost:5000/api/getSurvey?surveyId=${id}`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setSurvey(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchSurvey();
    }, [id]);

    if (loading) return null;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (!survey) return <p>No survey found</p>;

    return (
        <div className="h-screen w-screen">
            <Survey
                model={new Model(survey.json)}
                style={{ height: "100%", width: "100%" }}
            />
        </div>
    );
}
