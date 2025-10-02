'use client'

import { useEffect, useState } from "react";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import * as XLSX from "xlsx";
import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/ext-searchbox";
import { surveyLocalization } from "survey-core";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { slk } from "survey-core";

slk("NzZhNGMxZTEtYzBmMC00OTIzLWI2YjktM2I0NzZiNTZhNWU1OzE9MjAyNi0wOS0zMA==");

interface CreatorOptions {
    [key: string]: any;
    showTranslationTab?: boolean;
    showDesignerTab?: boolean;
    showPreviewTab?: boolean;
    autoSaveEnabled?: boolean;
}

const defaultCreatorOptions: CreatorOptions = {
    showTranslationTab: true,
    showPreviewTab: false
};

surveyLocalization.locales["Francais"] = {};

interface SurveyCreatorWidgetProps {
    json?: any;
    options?: CreatorOptions;
    id?: string;
}

export default function SurveyCreatorWidget(props: SurveyCreatorWidgetProps) {
    const [creator, setCreator] = useState<SurveyCreator>();
    const [fileName, setFileName] = useState("");
    const [surveyId, setSurveyId] = useState(props.id);

    const apiBaseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api`;

    useEffect(() => {
        if (!creator) {
            const newCreator = new SurveyCreator(props.options || defaultCreatorOptions);

            newCreator.saveSurveyFunc = async (
                no: number,
                callback: (no: number, status: boolean) => void
            ) => {
                try {
                    const title = newCreator.JSON?.title || "Untitled";

                    let response;
                    if (!surveyId) {
                        // Création d’un nouveau survey
                        response = await fetch(`${apiBaseUrl}/create`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ title, json: newCreator.JSON })
                        });
                        const data = await response.json();
                        setSurveyId(data.id);
                    } else {
                        // Mise à jour d’un survey existant
                        response = await fetch(`${apiBaseUrl}/changeJson`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: surveyId, title, json: newCreator.JSON })
                        });
                        await response.json();
                    }

                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    toast.success("Questionnaire enregistré avec succès !");
                    callback(no, true);
                } catch (err) {
                    console.error("Save error:", err);
                    toast.error("Échec de l'enregistrement.");
                    callback(no, false);
                }
            };

            setCreator(newCreator);
        }
    }, [creator, surveyId, props.options, apiBaseUrl]);

    useEffect(() => {
        if (creator && props.json) {
            creator.JSON = props.json;
        }
    }, [creator, props.json]);

    const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !creator) return;

        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const data = evt.target?.result;
                if (!data) {
                    toast.error("Impossible de lire le fichier.");
                    return;
                }

                const workbook = XLSX.read(data, { type: "binary" });
                if (workbook.SheetNames.length === 0) {
                    toast.error("Le fichier ne contient aucune feuille.");
                    return;
                }

                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                if (!json || json.length === 0) {
                    toast.error("Le fichier est vide ou invalide.");
                    return;
                }

                let surveyJson;
                try {
                    surveyJson = convertExcelToSurvey(json);
                } catch (err) {
                    toast.error("Format Excel non reconnu.");
                    return;
                }

                if (!surveyJson || typeof surveyJson !== "object" || !surveyJson.pages) {
                    toast.error("Le fichier ne correspond pas au format attendu.");
                    return;
                }

                creator.JSON = surveyJson;

                creator.saveSurveyFunc?.(0, (no: any, status: any) => {
                    if (status) toast.success("Survey importé et sauvegardé !");
                    else toast.error("Impossible de sauvegarder le questionnaire.");
                });
            } catch (error) {
                toast.error("Le fichier est corrompu ou non valide.");
            }
        };

        reader.readAsBinaryString(file);
    };

    const convertExcelToSurvey = (excelData: unknown[]) => {
        if (!excelData || excelData.length < 2)
            return { title: "Untitled", showProgressBar: "top", pages: [] };

        const headers = excelData[0] as string[];
        const pagesMap: Record<string, any> = {};

        let surveyTitle = "Untitled";
        let showProgressBar: "top" | "bottom" | "none" = "top";

        for (let i = 1; i < excelData.length; i++) {
            const row = excelData[i] as any[];

            const getValue = (colName: string) => {
                const idx = headers.findIndex(h => h.toLowerCase() === colName.toLowerCase());
                return idx >= 0 ? row[idx] : undefined;
            };

            const pageName = getValue("PageName") || `page${i}`;
            const pageTitle = getValue("PageTitle") || `Page ${i}`;
            const pageDescription = getValue("PageDescription") || "";

            if (!pagesMap[pageName]) {
                pagesMap[pageName] = { name: pageName, title: pageTitle, description: pageDescription, elements: [] };
            }

            if (getValue("SurveyTitle")) surveyTitle = getValue("SurveyTitle");
            const spb = getValue("ShowProgressBar");
            if (spb) showProgressBar = spb;

            const question: any = { name: getValue("QuestionName") || `q${i}` };

            question.title = getValue("QuestionTitle") || "";
            question.description = getValue("QuestionDescription") || "";
            question.type = getValue("Type") || "text";

            const choicesRaw = getValue("Choices");
            if (choicesRaw && ["radiogroup", "checkbox", "dropdown", "tagbox", "imagepicker"].includes(question.type)) {
                question.choices = (choicesRaw as string).split(/[,;]+/).map(c => c.trim());
            }

            question.isRequired = getValue("IsRequired") === true || getValue("IsRequired") === "true";
            question.readOnly = getValue("ReadOnly") === true || getValue("ReadOnly") === "true";
            question.defaultValue = getValue("DefaultValue") || undefined;
            question.showOtherItem = getValue("ShowOtherItem") === true || getValue("ShowOtherItem") === "true";
            question.colCount = Number(getValue("ColCount")) || undefined;
            question.cellType = getValue("CellType") || undefined;

            pagesMap[pageName].elements.push(question);
        }

        return { title: surveyTitle, showProgressBar, pages: Object.values(pagesMap) };
    };

    return (
        <div style={{ height: "80vh", width: "100%" }}>
            <div className="mb-4 flex items-center gap-3">
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    id="fileInput"
                    onChange={handleExcelImport}
                    className="hidden"
                />
                <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => document.getElementById("fileInput")?.click()}
                >
                    <Upload className="w-4 h-4" />
                    Import Survey
                </Button>

                {fileName && <p className="text-sm text-gray-600">📂 {fileName}</p>}
            </div>

            {creator && <SurveyCreatorComponent creator={creator} />}
        </div>
    );
}
