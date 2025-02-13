import React, { useEffect, useState } from 'react'

const Preview = ({ webcontainer }: { webcontainer: any }) => {
    const [url, setUrl] = useState<string | null>(null);
    const runCode = async () => {
        const installProcess = await webcontainer?.spawn('npm', ['install']);
        installProcess.output.pipeTo(new WritableStream({
            write(data) {
                console.log(data);
            }
        }));
        await webcontainer?.spawn('npm', ['run', 'dev']);
        webcontainer?.on('server-ready', (port: any, url: string) => {
            console.log(`Server is running on port ${port}`);
            console.log(url)
        });
        setUrl(url);
    }
    useEffect(() => {
        runCode();
    }, [webcontainer])
    return (
        <iframe
            title="preview"
            srcDoc={url || "https://www.google.com"}
            className="w-full h-full border-none bg-white"
        />
    )
}

export default Preview