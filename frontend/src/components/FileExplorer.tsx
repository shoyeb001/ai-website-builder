import React, { useState } from 'react';
import { ChevronRight, ChevronDown, FolderIcon, FileIcon } from 'lucide-react';
import { FileNode } from '../types';

interface FileExplorerProps {
  files: FileNode[];
  onFileSelect: (file: FileNode) => void;
  selectedPath: string | null;
}

interface FileTreeItemProps {
  node: FileNode;
  level: number;
  onFileSelect: (file: FileNode) => void;
  selectedPath: string | null;
}

function FileTreeItem({ node, level, onFileSelect, selectedPath }: FileTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const indent = level * 12; // 12px indent per level

  if (node.type === 'file') {
    return (
      <button
        onClick={() => onFileSelect(node)}
        className={`w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center ${
          selectedPath === node.path ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'
        }`}
        style={{ paddingLeft: `${indent + 8}px` }}
      >
        <FileIcon className="w-4 h-4 mr-2 flex-shrink-0" />
        <span className="truncate">{node.name}</span>
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center text-gray-700"
        style={{ paddingLeft: `${indent}px` }}
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 mr-1 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 mr-1 flex-shrink-0" />
        )}
        <FolderIcon className="w-4 h-4 mr-2 flex-shrink-0 text-indigo-600" />
        <span className="font-medium truncate">{node.name}</span>
      </button>
      {isExpanded && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FileTreeItem
              key={child.path}
              node={child}
              level={level + 1}
              onFileSelect={onFileSelect}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({ files, onFileSelect, selectedPath }: FileExplorerProps) {
  return (
    <div className="overflow-y-auto overflow-x-hidden">
      {files.map((node) => (
        <FileTreeItem
          key={node.path}
          node={node}
          level={0}
          onFileSelect={onFileSelect}
          selectedPath={selectedPath}
        />
      ))}
    </div>
  );
}