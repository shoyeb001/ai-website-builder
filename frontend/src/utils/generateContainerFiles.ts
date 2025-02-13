import { FileNode } from "../types";


function generateContainerFiles(fileNodes: FileNode[]) {
    const result: any = {};

    fileNodes.forEach(node => {
        const pathParts = node.path.split('/');
        let current = result;

        // Handle nested paths
        for (let i = 0; i < pathParts.length - 1; i++) {
            const part = pathParts[i];
            if (!current[part]) {
                current[part] = { directory: {} };
            }
            current = current[part].directory!;
        }

        // Add the final node
        const fileName = pathParts[pathParts.length - 1];
        if (node.type === 'file') {
            current[fileName] = {
                file: {
                    contents: node.content || ''
                }
            };
        } else {
            current[fileName] = {
                directory: {}
            };
            if (node.children) {
                const childContent = generateContainerFiles(node.children);
                current[fileName].directory = childContent;
            }
        }
    });
    console.log(result);
    return result;
}

export default generateContainerFiles;