import { FileNode, File } from '../types';

export function createFileTree(files: File[]): FileNode[] {
  const root: { [key: string]: FileNode } = {};

  // Sort files to ensure consistent order
  const sortedFiles = [...files].sort((a, b) => a.path.localeCompare(b.path));

  sortedFiles.forEach(file => {
    const parts = file.path.split('/');
    let currentPath = '';
    let current = root;

    // Create folder nodes
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      
      if (!current[currentPath]) {
        current[currentPath] = {
          name: part,
          type: 'folder',
          path: currentPath,
          children: []
        };
      }
      
      if (i === parts.length - 2) {
        // Add file to the last folder
        const fileName = parts[parts.length - 1];
        const filePath = `${currentPath}/${fileName}`;
        const fileNode: FileNode = {
          name: fileName,
          type: 'file',
          path: filePath,
          content: file.content,
          language: file.language
        };
        
        if (!current[currentPath].children) {
          current[currentPath].children = [];
        }
        current[currentPath].children!.push(fileNode);
      } else {
        // Move to next folder level
        if (!current[currentPath].children) {
          current[currentPath].children = [];
        }
        const nextPath = currentPath ? `${currentPath}/${parts[i + 1]}` : parts[i + 1];
        if (!current[nextPath]) {
          current[nextPath] = {
            name: parts[i + 1],
            type: 'folder',
            path: nextPath,
            children: []
          };
        }
      }
    }

    // Handle root-level files
    if (parts.length === 1) {
      root[file.path] = {
        name: file.name,
        type: 'file',
        path: file.path,
        content: file.content,
        language: file.language
      };
    }
  });

  // Convert the object tree to array and sort
  function convertToArray(node: { [key: string]: FileNode }): FileNode[] {
    return Object.values(node)
      .sort((a, b) => {
        // Folders come before files
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        // Alphabetical sort within same type
        return a.name.localeCompare(b.name);
      })
      .map(node => ({
        ...node,
        children: node.children ? convertToArray(
          node.children.reduce((acc, child) => {
            acc[child.path] = child;
            return acc;
          }, {} as { [key: string]: FileNode })
        ) : undefined
      }));
  }

  return convertToArray(root);
}

export function flattenFileTree(node: FileNode): File[] {
  if (node.type === 'file') {
    return [{
      name: node.name,
      content: node.content || '',
      language: node.language || 'plaintext',
      path: node.path
    }];
  }

  return (node.children || []).flatMap(child => flattenFileTree(child));
}