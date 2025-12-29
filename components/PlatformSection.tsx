import CommonFileUpload from './CommonFileUpload';
import PlatformCard from './PlatformCard';
import { useState } from 'react';
import { parseFile, zipResults } from '../utils/dji';

interface PlatformSectionProps {
  onSelect?: (platform: string) => void;
}

const PlatformSection: React.FC<PlatformSectionProps> = ({ onSelect }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const platforms: { title: string; subtitle: string; id: string; extensions: string; status?: string }[] = [
    {
      title: "Px4 Flight Stack",
      subtitle: ".ulg logs",
      id: "PX4",
      extensions: ".ulg"
    },
    {
      title: "DJI Platforms",
      subtitle: ".DAT (Limited)",
      id: "DJI",
      extensions: ".dat"
    },
    {
      title: "FPV Systems",
      subtitle: "Betaflight/iNAV",
      id: "FPV",
      extensions: ".bbl,.txt"
    },
    {
      title: "Ardupilot Flight Stack",
      subtitle: ".bin logs",
      id: "ARDU",
      extensions: ".bin"
    }
  ];

  const handlePlatformSelect = (id: string) => {
    setSelectedPlatform(id);
    // onSelect?.(id); // Optional: Trigger parent handler if needed, currently disabled to show upload
  };

  const handleUpload = async (file: File, onProgress: (p: number) => void, onLog: (m: string) => void) => {
    if (selectedPlatform === 'DJI') {
      return new Promise<void>(async (resolve, reject) => {
        onLog(`[INFO] Starting DJI Log Decryption...`);

        try {
          const arrayBuffer = await file.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);

          onLog(`[EXEC] Parsing and decrypting file...`);
          // Simulate progress for parsing since it's synchronous-ish
          onProgress(20);

          const results = await parseFile(uint8Array);
          onProgress(60);

          if (!results || results.length === 0) {
            throw new Error("No files found or decryption failed.");
          }

          onLog(`[SUCCESS] Decrypted ${results.length} files.`);
          onLog(`[EXEC] Creating ZIP archive...`);

          const zip = zipResults(results);
          onProgress(90);

          // Create download link
          const blob = new Blob([zip as any], { type: 'application/zip' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.name.replace(/\.DAT$/i, '') + '.zip';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          onProgress(100);
          onLog(`[SUCCESS] Download started.`);
          resolve();
        } catch (error: any) {
          onLog(`[ERROR] ${error.message}`);
          reject(error);
        }
      });
    }

    if (selectedPlatform === 'PX4') {
      return new Promise<void>((resolve, reject) => {
        const formData = new FormData();
        formData.append('filearg', file);
        formData.append('description', 'Uploaded via AiDA Forensic');
        formData.append('email', ''); // Required by backend
        formData.append('source', 'webui');
        formData.append('type', 'personal');
        formData.append('allowForAnalysis', 'false');
        formData.append('obfuscated', 'false');
        formData.append('redirect', 'false');

        const xhr = new XMLHttpRequest();
        // Upload endpoint for PX4 flight review is typically just /upload or the root / if handled by UploadHandler
        // Based on the provided file, UploadHandler seems to be mapped to /upload in serve.py (implied) or similar.
        // However, standard PX4 Flight Review upload is often at /upload
        xhr.open('POST', '/upload/');

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            onProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              if (response.url) {
                onLog(`[SERVER] Upload successful. Redirecting to analysis...`);
                // Open the analysis URL in a new tab
                window.open(`http://167.71.237.172:5006${response.url}`, '_blank');
              } else {
                onLog(`[SERVER] Upload successful: ${xhr.responseText}`);
              }
              resolve();
            } catch (e) {
              onLog(`[SERVER] Upload successful (raw): ${xhr.responseText}`);
              resolve();
            }
          } else {
            reject(new Error(`Server responded with ${xhr.status}: ${xhr.statusText}`));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Network error occurred. Ensure backend is running at http://167.71.237.172:5006'));
        };

        onLog(`[NET] Sending file to PX4 backend...`);
        xhr.send(formData);
      });
    }

    if (selectedPlatform === 'ARDU') {
      return new Promise<void>((resolve) => {
        onLog(`[INFO] Selected file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        onLog(`[INFO] Ardupilot Parameter Viewer detected.`);
        onLog(`[INFO] Attempting to send file to analyzer at https://parameter-viewer-forensics-test-network.aidrone.in/...`);

        const win = window.open('https://parameter-viewer-forensics-test-network.aidrone.in/', 'ardupilot_analyzer');

        // Try to send the file periodically for a few seconds in case the window is loading
        let attempts = 0;
        const interval = setInterval(() => {
          if (win) {
            // Send the file object via postMessage
            win.postMessage({ type: 'LOAD_LOG', file: file }, 'https://parameter-viewer-forensics-test-network.aidrone.in/');
            attempts++;
            if (attempts > 5) {
              clearInterval(interval);
              onLog(`[INFO] Message sent. If the file didn't load, please check the Ardupilot Viewer.`);
              resolve();
            }
          } else {
            clearInterval(interval);
            resolve();
          }
        }, 1000);
      });
    }

    if (selectedPlatform === 'FPV') {
      return new Promise<void>((resolve) => {
        onLog(`[INFO] Selected file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        onLog(`[INFO] Betaflight Blackbox Explorer detected.`);
        onLog(`[INFO] Attempting to send file to analyzer at https://betablackbox.aidrone.in/...`);

        const win = window.open('https://betablackbox.aidrone.in/', 'betaflight_analyzer');

        // Try to send the file periodically for a few seconds in case the window is loading
        let attempts = 0;
        const interval = setInterval(() => {
          if (win) {
            // Send the file object via postMessage
            win.postMessage({ type: 'LOAD_LOG', file: file }, 'https://betablackbox.aidrone.in/');
            attempts++;
            if (attempts > 5) {
              clearInterval(interval);
              onLog(`[INFO] Message sent. If the file didn't load, please check the Betaflight console.`);
              resolve();
            }
          } else {
            clearInterval(interval);
            resolve();
          }
        }, 1000);
      });
    }

    // Fallback simulation for other platforms if needed
    onLog(`[WARN] No upload handler defined for ${selectedPlatform}, running simulation.`);
    await new Promise(r => setTimeout(r, 1000));
  };

  const selectedPlatformData = platforms.find(p => p.id === selectedPlatform);

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="w-full">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
            Select Platform
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {platforms.map((platform) => (
            <div key={platform.id} className={`transition-opacity duration-300 ${selectedPlatform && selectedPlatform !== platform.id ? 'opacity-50 hover:opacity-100' : 'opacity-100'}`}>
              <PlatformCard
                title={platform.title}
                subtitle={platform.subtitle}
                status={platform.status}
                onClick={() => handlePlatformSelect(platform.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Common File Upload Section */}
      {selectedPlatform && selectedPlatformData && (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-px bg-border flex-grow"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-muted">Upload {selectedPlatformData.title} Log</span>
            <div className="h-px bg-border flex-grow"></div>
          </div>
          <CommonFileUpload
            acceptedFormats={selectedPlatformData.extensions}
            title={`Drop ${selectedPlatformData.subtitle} Here`}
            onFileSelect={(file) => console.log('File selected:', file)}
            onUpload={handleUpload}
          />
        </div>
      )}
    </div>
  );
};

export default PlatformSection;