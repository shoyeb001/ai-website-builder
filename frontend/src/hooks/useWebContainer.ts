import { WebContainer } from "@webcontainer/api";
import { useEffect, useState } from "react";

export function useWebContainer() {
    const [webcontainer, setWebContainer] = useState<WebContainer | null>(null);

    const initializeWebContainer = async () => {
        const webcontainerInstance = await WebContainer.boot();
        setWebContainer(webcontainerInstance);
    }
    useEffect(() => {
        initializeWebContainer();
    }, []);

    return webcontainer;
}