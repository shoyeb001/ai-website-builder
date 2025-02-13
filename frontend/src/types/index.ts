export interface File {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  content?: string;
  language?: string;

}

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  content?: string;
  language?: string;
}

export interface Step {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface WebsiteTemplate {
  html: string;
  css: string;
  js: string;
}