import { useState, useCallback, useRef } from 'react';
import { saveAs } from 'file-saver';
import { Link } from 'react-router-dom';
import JSZip from 'jszip';
import { handleExcelFile, handleCSVFile, handleTextFile, ProcessingOptions } from './fileProcessing';

type SplitMode = 'lines' | 'characters';
type Encoding = 'utf-8' | 'ascii';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [splitMode, setSplitMode] = useState<SplitMode>('lines');
  const [encoding, setEncoding] = useState<Encoding>('ascii');
  const [splitValue, setSplitValue] = useState<number>(2);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [splitCount, setSplitCount] = useState<number>(0);
  const [showInstructions, setShowInstructions] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const updateProgress = (percent: number, text: string) => {
    setProgress(percent);
    setProgressText(text);
  };

  const showError = (message: string) => {
    alert(message);
    updateProgress(0, '');
    setIsProcessing(false);
  };

  const clearFileSelection = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBinaryFile = async (content: ArrayBuffer, numParts: number): Promise<Blob[]> => {
    try {
      const parts: Blob[] = [];
      const chunkSize = Math.ceil(content.byteLength / numParts);
      
      for (let i = 0; i < numParts; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, content.byteLength);
        parts.push(new Blob([content.slice(start, end)]));
      }

      return parts;
    } catch (error) {
      throw new Error(`Error processing binary file: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Update handleSplitFile to handle different file types and create a ZIP file
  const handleSplitFile = async () => {
    if (!file) return;
    setIsProcessing(true);
    updateProgress(10, 'Reading file...');

    try {
      const buffer = await file.arrayBuffer();
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
      const baseFileName = fileName.slice(0, -(fileExtension.length + 1));
      
      updateProgress(30, 'Processing file...');
      
      const options: ProcessingOptions = {
        encoding: encoding,
        splitMode: splitMode,
        splitValue: splitValue
      };
      
      let parts: Blob[] = [];

      // Handle different file types
      if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        parts = await handleExcelFile(buffer, options, fileExtension);
      } else if (fileExtension === 'csv') {
        parts = await handleCSVFile(buffer, options);
      } else if (/^(txt|log|text|dat|json|xml|html|htm|css|js|md)$/i.test(fileExtension)) {
        parts = await handleTextFile(buffer, options);
      } else {
        parts = await handleBinaryFile(buffer, splitValue);
      }

      // Create ZIP file containing all split files
      updateProgress(60, 'Creating ZIP file...');
      const zip = new JSZip();

      // Add each part to the ZIP file
      parts.forEach((part, index) => {
        updateProgress(
          60 + Math.floor((index + 1) / parts.length * 20),
          `Adding part ${index + 1} of ${parts.length}...`
        );
        zip.file(`${baseFileName}_part${index + 1}.${fileExtension}`, part);
      });

      // Generate and download the ZIP file
      updateProgress(80, 'Generating ZIP file...');
      // Define compression type as const to satisfy ESLint
      const DEFLATE_COMPRESSION = "DEFLATE";
      
      const zipOptions: JSZip.JSZipGeneratorOptions<"blob"> = { 
        type: "blob",
        compression: DEFLATE_COMPRESSION,
        compressionOptions: {
          level: 6
        }
      };

      const zipContent = await zip.generateAsync(zipOptions);
      
      updateProgress(90, 'Downloading file...');
      saveAs(zipContent, `${baseFileName}_split_files.zip`);
      
      updateProgress(100, 'Completed!');
      setSplitCount(prev => prev + 1);
      
      setTimeout(() => {
        updateProgress(0, '');
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      showError(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-6 flex flex-col">
      <div className="max-w-5xl mx-auto flex-grow w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-12 h-12 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h1 className="text-4xl font-bold text-gray-800">Divisor Universal de Arquivos</h1>
          </div>
          {splitCount > 0 && (
            <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full inline-block mb-4">
              <span className="font-semibold">{splitCount}</span> divisões realizadas
            </div>
          )}
          <p className="text-gray-600 max-w-2xl mx-auto">
            Uma ferramenta online que ajuda você a dividir qualquer tipo de arquivo em partes iguais.
            Diferente de outras ferramentas online, esta faz todo o processamento no seu navegador
            (lado do cliente, local, privado e seguro) usando tecnologias HTML5, então não há preocupações
            com privacidade.
          </p>
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="mt-4 text-indigo-600 hover:text-indigo-800 flex items-center justify-center mx-auto"
          >
            <svg
              className={`w-5 h-5 transform transition-transform ${showInstructions ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {showInstructions ? 'Ocultar Instruções' : 'Mostrar Instruções'}
          </button>
          {showInstructions && (
            <div className="mt-4 text-left bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
              <h3 className="font-semibold text-lg mb-3">Tipos de Divisão:</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Para arquivos Excel (.xlsx/.xls) e CSV: A divisão será feita por linhas, mantendo o cabeçalho em cada parte.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Para outros arquivos de texto (TXT, LOG etc): Escolha entre dividir por linhas ou caracteres.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Para outros tipos de arquivo: A divisão será feita em partes iguais automaticamente.</span>
                </li>
              </ul>
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Nota:</strong> Se você escolher "Dividir por linhas", os arquivos serão divididos pelo número de linhas contidas neles.
                  Por exemplo, um arquivo com 20 linhas dividido em 4 partes gerará 4 arquivos com 5 linhas cada (o tamanho de cada linha é irrelevante para a divisão).
                  Se você precisar dividir baseado no tamanho do arquivo, escolha "Dividir por caracteres".
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center ${isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="fileInput"
              ref={fileInputRef}
              accept="*.*"
            />
            <p className="text-gray-600 mb-4">
              Arraste e solte seu arquivo aqui ou
            </p>
            <label
              htmlFor="fileInput"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
            >
              Selecione um Arquivo
            </label>
            {file && (
              <p className="mt-4 text-sm text-gray-600">
                Arquivo selecionado: {file.name}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Opções de Divisão</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de partes para dividir
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md p-2"
                value={splitValue}
                onChange={(e) => setSplitValue(Math.max(2, parseInt(e.target.value) || 2))}
                min="2"
                placeholder="Número de partes"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Divisão (para arquivos de texto)
                </label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-indigo-600"
                      checked={splitMode === 'lines'}
                      onChange={() => setSplitMode('lines')}
                    />
                    <span className="ml-2">Por linhas</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-indigo-600"
                      checked={splitMode === 'characters'}
                      onChange={() => setSplitMode('characters')}
                    />
                    <span className="ml-2">Por caracteres</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Codificação
                </label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-indigo-600"
                      checked={encoding === 'utf-8'}
                      onChange={() => setEncoding('utf-8')}
                    />
                    <span className="ml-2">UTF-8</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-indigo-600"
                      checked={encoding === 'ascii'}
                      onChange={() => setEncoding('ascii')}
                    />
                    <span className="ml-2">ASCII</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          {isProcessing && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {progressText && (
                <p className="text-sm text-gray-600 mt-2 text-center">{progressText}</p>
              )}
            </div>
          )}
          <button
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${file ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            onClick={handleSplitFile}
            disabled={!file || isProcessing}
          >
            {isProcessing ? 'Processando...' : 'Dividir Arquivo'}
          </button>
          {file && (
            <button
              className="w-full mt-2 py-2 rounded-lg font-medium text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 transition-all duration-300"
              onClick={clearFileSelection}
              disabled={isProcessing}
            >
              Limpar Seleção
            </button>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white py-3 px-4">
        <div className="container mx-auto flex flex-wrap justify-center items-center gap-4 text-sm">
          <div>Copyright 2025 © - FelixBR - Todos os direitos reservados</div>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-gray-300">Privacidade e Termos</Link>
            <span>-</span>
            <a href="mailto:contact@example.com" className="hover:text-gray-300">Contato</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
