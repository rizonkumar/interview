import React from "react";
import { sampleData } from "./data/constant";
import FileExplorer from "./components/FileExplorer";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">VS Code-like File Explorer</h1>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border">
          <FileExplorer initialData={sampleData} />
        </div>
      </div>
    </div>
  );
}

export default App;
