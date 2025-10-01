'use client';

import { useEffect, useState } from "react";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import "survey-creator-core/survey-creator-core.css";

interface SurveyItem {
    id: string;
    name: string;
    json: any;
}

export default function SurveyEditor({ id }: { id: string }) {
    const [creator, setCreator] = useState<SurveyCreator | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const apiBaseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api`;

    useEffect(() => {
        async function fetchSurvey() {
            try {
                const res = await fetch(`${apiBaseUrl}/getSurvey?surveyId=${id}`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data: SurveyItem = await res.json();

                const creatorInstance = new SurveyCreator({
                    showLogicTab: true,
                    showTranslationTab: true,
                });
                creatorInstance.JSON = data.json;

                setCreator(creatorInstance);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchSurvey();
    }, [id, apiBaseUrl]);

    async function saveSurvey() {
        if (!creator) return;

        try {
            const res = await fetch(`${apiBaseUrl}/changeJson`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    json: creator.JSON,
                }),
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            alert("Survey saved successfully");
        } catch (err: any) {
            alert("Error: " + err.message);
        }
    }

    if (loading) return null;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (!creator) return <p>No survey found</p>;

    return (
        <div className="flex flex-col h-screen w-screen">
            <div className="flex-1 min-h-0">
                <SurveyCreatorComponent creator={creator} style={{ height: "100%", width: "100%" }} />
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-end">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={saveSurvey}
                >
                    Save
                </button>
            </div>
        </div>
    );
}
