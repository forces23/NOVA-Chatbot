import React from "react";

export interface CurrentConversationItem {
    role: string;
    content: {
        html_text?: string;
        text: string,
        type: string,

    }[];
    data_sources?: string[];
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

export interface BotMessageInterface {
    message: CurrentConversationItem;
    index: number;
    completedMessages: number[];
    setCompletedMessages: React.Dispatch<React.SetStateAction<number[]>>;
    chatContainerRef: React.RefObject<HTMLDivElement | null>;

}

export interface ChatSessionProps {
    chatContainerRef: React.RefObject<HTMLDivElement | null>;
}

export interface VoiceToTextProps {
    onTextChange: (text: string) => void;
}