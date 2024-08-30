import React, { useState, createContext, ReactNode } from 'react';
import { CurrentConversationItem, PostPayload, SettingsType } from '../utils/chatbotInterfaces';

//Context Interface
interface SharedInfoType {
    AIResponse: any;
    SetAIResponse: React.Dispatch<React.SetStateAction<{}>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    payload: PostPayload;
    setPayload: React.Dispatch<React.SetStateAction<PostPayload>>;
    currentConversation: CurrentConversationItem[];
    setCurrentConversation: React.Dispatch<React.SetStateAction<CurrentConversationItem[]>>; 
    speakerTurn: string;
    setSpeakerTurn: React.Dispatch<React.SetStateAction<string>>;     
    
}

// Create the shared info context, this is what is used to access the actual data across all the components
export const sharedInfoContext = createContext<SharedInfoType>({
    AIResponse: {} ,
    SetAIResponse: () => {}, 
    isLoading: false,
    setIsLoading: () => {}, 
    payload: { 'prompt': '', temperature: 0.7, topP: 0.9, topK: 50 },
    setPayload: () => {},  
    currentConversation: [],
    setCurrentConversation: () => {},  // Add a function to update the current conversation array
    speakerTurn: '',
    setSpeakerTurn: () => {},   
    
});

// Provider Interface
interface SharedInfoProviderProps {
    children: ReactNode;
}

// This is what is wrapped around the whole project that allows the components to use all of this variables 
export const SharedInfoProvider = ({ children }: SharedInfoProviderProps) => {
    const [AIResponse, SetAIResponse] = useState<{}>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [payload, setPayload] = useState<PostPayload>({ 'prompt': '', temperature: 0.7, topP: 0.9, topK: 50 })
    const [currentConversation, setCurrentConversation] = useState<CurrentConversationItem[]>([]);
    const [speakerTurn, setSpeakerTurn] = useState<string>('');

    return (
        <sharedInfoContext.Provider value={{ 
            AIResponse,
            SetAIResponse,
            isLoading,
            setIsLoading,
            payload,
            setPayload,
            currentConversation, 
            setCurrentConversation,
            speakerTurn, 
            setSpeakerTurn
        }}>
            {children}
        </sharedInfoContext.Provider>
    );

}