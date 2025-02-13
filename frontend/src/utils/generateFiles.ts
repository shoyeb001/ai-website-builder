interface FileNode {
    name: string;
    type: 'file' | 'folder';
    path: string;
    children?: FileNode[];
    content?: string;
    language?: string;
}
export function createFolderTree(xmlResponse: string) {
    // Parse XML response to get JSON
    const jsonStart = xmlResponse.indexOf('{');
    const jsonEnd = xmlResponse.lastIndexOf('}');
    const jsonString = xmlResponse.slice(jsonStart, jsonEnd + 1);
    const data = JSON.parse(jsonString);

    // Create root node
    const root: FileNode = {
        name: data.boltArtifact.id,
        type: 'folder',
        path: '/',
        children: []
    };

    // Process each action
    data.boltArtifact.boltActions.forEach((action: any) => {
        if (action.type === 'file') {
            const pathParts = action.filePath.split('/');
            let currentNode = root;

            // Create folder structure
            for (let i = 0; i < pathParts.length - 1; i++) {
                const part = pathParts[i];
                if (part) {
                    let folder = currentNode.children?.find(
                        child => child.name === part && child.type === 'folder'
                    );
                    if (!folder) {
                        folder = {
                            name: part,
                            type: 'folder',
                            path: pathParts.slice(0, i + 1).join('/'),
                            children: []
                        };
                        currentNode.children?.push(folder);
                    }
                    currentNode = folder;
                }
            }

            // Add file
            const fileName = pathParts[pathParts.length - 1];
            console.log(action, "action")
            currentNode.children?.push({
                name: fileName,
                type: 'file',
                path: action.filePath,
                content: action.content || action.fileContent,
                language: getLanguageFromFileName(fileName)
            });
        }
    });
    console.log(root, "root")
    return root.children || [];
}

function getLanguageFromFileName(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
        'js': 'javascript',
        'ts': 'typescript',
        'json': 'json',
        'html': 'html',
        'css': 'css',
        'tsx': 'typescript',
        'jsx': 'javascript'
    };
    return languageMap[ext || ''] || '';
}