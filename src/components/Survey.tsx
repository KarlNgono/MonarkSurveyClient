'use client'

import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {Model} from "survey-core";
import {Survey} from "survey-react-ui";
import "survey-core/survey-core.css";

interface SurveyItem {
    id: string;
    name: string;
    json: any;
}

export default function SurveyPreviewPage() {
    const {id} = useParams();
    const [survey, setSurvey] = useState<SurveyItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const apiBaseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api`;
    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const res = await fetch(`${apiBaseUrl}/getSurvey?surveyId=${id}`);
                if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
                const data = await res.json();
                setSurvey(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSurvey();
    }, [id, apiBaseUrl]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 text-lg">Loading survey...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 text-lg font-semibold">Error: {error}</p>
            </div>
        );
    }

    if (!survey) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 text-lg">Survey not found</p>
            </div>
        );
    }

    return (
        <main className="max-w-4xl mx-auto p-6">
            <div className="bg-white p-6 shadow-md rounded-md">
                <Survey model={new Model(survey.json)}/>
            </div>
        </main>
    );
}
