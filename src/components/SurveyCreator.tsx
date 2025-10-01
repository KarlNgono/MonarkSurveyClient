'use client'

import { useEffect, useState } from "react";
import { ICreatorOptions } from "survey-creator-core";
import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/ext-searchbox";

const defaultCreatorOptions: ICreatorOptions = {
  showTranslationTab: true,
};

interface SurveyCreatorWidgetProps {
  json?: Object;
  options?: ICreatorOptions;
  id?: string;
}

export default function SurveyCreatorWidget(props: SurveyCreatorWidgetProps) {
  const [creator, setCreator] = useState<SurveyCreator>();

  const apiBaseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api`;

  useEffect(() => {
    if (!creator) {
      const newCreator = new SurveyCreator(props.options || defaultCreatorOptions);

      newCreator.saveSurveyFunc = async (no: number, callback: (num: number, status: boolean) => void) => {
        try {
          const response = await fetch(`${apiBaseUrl}/api/changeJson`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: props.id,
              json: newCreator.JSON,
            }),
          });

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

          const result = await response.json();
          console.log("Survey saved:", result);
          callback(no, true);
        } catch (err) {
          console.error("Save error:", err);
          callback(no, false);
        }
      };

      setCreator(newCreator);
    }
  }, [creator, props.id, props.options, apiBaseUrl]);

  useEffect(() => {
    if (creator && props.json) {
      creator.JSON = props.json;
    }
  }, [creator, props.json]);

  return (
      <div style={{ height: "80vh", width: "100%" }}>
        {creator && <SurveyCreatorComponent creator={creator} />}
      </div>
  );
}
