import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import Split from 'split.js';
import { FolderTree, Play, Code2, StepBack as Steps, RefreshCw } from 'lucide-react';
import { File, FileNode, Step } from '../types';
import { generateTemplate } from '../utils/templateGenerator';
import { createFileTree } from '../utils/fileSystem';
import { FileExplorer } from '../components/FileExplorer';
import axios from 'axios';
import { parseToSteps } from '../utils/steps';
import { createFolderTree } from '../utils/generateFiles';
// import { useWebContainer } from '../hooks/useWebContainer';
import generateContainerFiles from '../utils/generateContainerFiles';
import Preview from '../components/Preview';
import { useWebContainer } from '../hooks/useWebContainer';

function Workspace() {
  const [url, setUrl] = useState('');
  const location = useLocation();
  const prompt = location.state?.prompt || '';
  const [files, setFiles] = useState<File[]>([]);
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [steps, setSteps] = useState<Step[]>([
  ]);
  const webcontainer = useWebContainer();

  // useEffect(() => {
  //   executeWebContainer();
  // }, [fileTree, webContainer]);
  async function fetchChat() {
    try {
      const response = await axios.post('http://localhost:8000/chat', { message: prompt });
      console.log(response.data, "response")
      // console.log(parseToSteps(response.data.message), "parseToSteps");
      // console.log(createFolderTree(response.data.message), "createFileTree");
      setFiles(createFolderTree(response.data.message));
      const tree = createFolderTree(response.data.message);
      setFileTree(tree);
      console.log(tree, "tree --executing 1")
      setSteps(parseToSteps(response.data.message));
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchChat();
  }, [])

  const mountWebContainer = async (containerFiles: any) => {
    await webcontainer?.mount(containerFiles);
  }

  useEffect(() => {
    const containerFiles = generateContainerFiles(fileTree);
    console.log(containerFiles, "containerFiles");
    mountWebContainer(containerFiles);
  }, [fileTree])

  const splitRef = useRef<any>(null);



  useEffect(() => {
    // Initialize split panels
    splitRef.current = Split(['#steps', '#main-content', '#explorer'], {
      sizes: [25, 50, 25],
      minSize: [200, 400, 200],
      gutterSize: 8,
      direction: 'horizontal'
    });


    return () => {
      if (splitRef.current) {
        splitRef.current.destroy();
      }
    };
  }, [prompt]);

  const handleEditorChange = (value: string | undefined) => {
    if (!value || !selectedFile) return;

    const updatedFiles = files.map(file =>
      file.path === selectedFile.path
        ? { ...file, content: value }
        : file
    );
    setFiles(updatedFiles);
    setSelectedFile({ ...selectedFile, content: value });
    setFileTree(createFileTree(updatedFiles));
  };

  const handleFileSelect = (fileNode: FileNode) => {
    if (fileNode.type === 'file') {
      setSelectedFile(fileNode);
    }
  };

  const startDevServer = async () => {
    if (!webcontainer) return;
    try {
      console.log("starting dev server");
      const installProcess = await webcontainer.spawn('npm', ['install']);
      const installExitCode = await installProcess.exit;
      if (installExitCode !== 0) {
        throw new Error('Failed to install dependencies');
      }
      const devProcess = await webcontainer.spawn("npm", ["run", "dev"]);
      devProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            if (data.includes("Local:")) {
              console.log("Server is ready!");
            }
          },
        })
      );
      webcontainer.on("server-ready", (port, serverUrl) => {
        console.log("Server ready at:", serverUrl);
        setUrl(serverUrl);
      });
    } catch (error) {
      console.log("Failed to strat dev server:", error);
    }
  }

  return (
    <div className="h-screen flex bg-gray-50">
      <div id="steps" className="bg-white border-r overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center mb-6">
            <Steps className="w-5 h-5 mr-2 text-indigo-600" />
            <h2 className="text-lg font-semibold">Build Steps</h2>
          </div>
          <div className="space-y-4">
            {steps.map((step, index: number) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${step.status === 'completed'
                  ? 'bg-green-50 border-green-200'
                  : step.status === 'in-progress'
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
                  }`}
              >
                <h3 className="font-medium text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                <div className="mt-2">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${step.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : step.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {step.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="main-content" className="flex flex-col flex-1">
        <div className="bg-white border-b flex items-center justify-between p-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center px-4 py-2 rounded ${activeTab === 'code' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Code2 className="w-4 h-4 mr-2" />
              Code
            </button>
            <button
              onClick={() => { setActiveTab("preview"); startDevServer() }}
              className={`flex items-center px-4 py-2 rounded ${activeTab === 'preview' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <Play className="w-4 h-4 mr-2" />
              Preview
            </button>
          </div>
          <div className="flex items-center space-x-2">
            {/* <button
              onClick={downloadProject}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Export
            </button> */}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {activeTab === 'code' && selectedFile ? (
            <Editor
              height="100%"
              language={selectedFile.language}
              value={selectedFile.content}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                padding: { top: 20 }
              }}
            />
          ) : (
            // <Preview webcontainer={webcontainer} />
            <div className="flex-1 bg-gray-900">
              <iframe
                title="Website Preview"
                className="w-full h-full border-none"
                src={url}
              />
            </div>
          )}
        </div>
      </div>

      <div id="explorer" className="bg-white border-l">
        <div className="p-4">
          <div className="flex items-center mb-4">
            <FolderTree className="w-5 h-5 mr-2 text-indigo-600" />
            <h2 className="text-lg font-semibold">Files</h2>
          </div>
          <FileExplorer
            files={fileTree}
            onFileSelect={handleFileSelect}
            selectedPath={selectedFile?.path || null}
          />
        </div>
      </div>
    </div>
  );
}

export default Workspace;