import React from "react";

export interface CurrentConversationItem {
    role: string;
    content: {
        html_text?: string;
        text: string,
        type: string,

    }[];
    data_sources?: string[];
    show_context?: boolean;
}

export interface ChatHistoryComponent {
    flag?: boolean;
    setFlag?: React.Dispatch<React.SetStateAction<boolean>>;
    speakerTurn?: string;
    AIResponse: any;
    userInput: string;
    isLoading?: boolean;
}

export interface PostPayload {
    prompt: string,
    temperature?: number,
    topK?: number,
    topP?: number,
    sysetm_prompt?: string,
}

export interface SettingsType {
    temperature: number;
    topP: number;
    topK: number;

}