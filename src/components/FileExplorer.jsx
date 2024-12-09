import React, { useState } from "react";
import { Folder, File } from "lucide-react";
import TreeNode from "./TreeNode";

function FileExplorer({ initialData }) {
  const [data, setData] = useState(initialData);

  const handleAdd = (parentPath, isFolder) => {
    const newName = prompt(
      `Enter name for new ${isFolder ? "folder" : "file"}:`
    );
    if (!newName) return;

    const newData = { ...data };

    if (parentPath === "root") {
      newData[newName] = isFolder
        ? { type: "folder", children: [] }
        : { type: "file", name: newName };
    } else {
      const parent = newData[parentPath];
      if (parent && parent.type === "folder") {
        parent.children = parent.children || [];
        parent.children.push(
          isFolder
            ? { name: newName, type: "folder", children: [] }
            : { name: newName, type: "file" }
        );
      }
    }

    setData(newData);
  };

  const handleRename = (oldName, newName) => {
    if (!newName) return; // Skip if no new name provided

    const newData = { ...data }; // Create a deep copy of the data

    // Recursive function to rename items while preserving order
    const renameItem = (obj) => {
      // Create a new object to maintain order
      const updatedObj = {};

      Object.keys(obj).forEach((key) => {
        const item = obj[key];
        let currentKey = key;
        let currentItem = item;

        // Rename at root level
        if (key === oldName) {
          currentKey = newName;
          currentItem = { ...item, name: newName };
        }

        // Handle nested folders and their children
        if (currentItem.type === "folder" && currentItem.children) {
          // Check and rename children while preserving their order
          currentItem.children = currentItem.children.map((child) =>
            child.name === oldName ? { ...child, name: newName } : child
          );
        }

        // Add to the new object with the potentially updated key and item
        updatedObj[currentKey] = currentItem;
      });

      return updatedObj;
    };

    // Additional function to rename nested children
    const renameNestedChildren = (obj) => {
      Object.keys(obj).forEach((key) => {
        const item = obj[key];

        // Recursively handle nested folders
        if (item.type === "folder" && item.children) {
          item.children = item.children.map((child) => {
            if (child.name === oldName) {
              return { ...child, name: newName };
            }
            return child;
          });

          // Continue recursion for nested folders
          renameNestedChildren(item.children);
        }
      });
    };

    const updatedData = renameItem(newData);
    renameNestedChildren(updatedData);
    setData(updatedData);
  };

  const handleDelete = (name) => {
    console.log("delete", name); // unique
    const newData = { ...data };
    delete newData[name];
    setData(newData);
  };

  return (
    <div className="w-64 bg-white border-r h-full overflow-y-auto">
      <div className="p-2 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-sm">EXPLORER</h2>
          <div className="flex gap-1">
            <button
              onClick={() => handleAdd("root", true)}
              className="p-1 hover:bg-gray-100 rounded"
              title="New Folder"
            >
              <Folder className="w-4 h-4 text-yellow-500" />
            </button>

            <button
              onClick={() => handleAdd("root", false)}
              className="p-1 hover:bg-gray-100 rounded"
              title="New File"
            >
              <File className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="py-2">
        {Object.entries(data).map(([name, node]) => (
          <TreeNode
            key={name}
            name={name}
            node={node}
            onAdd={handleAdd}
            onRename={handleRename}
            onDelete={handleDelete}
            level={0}
          />
        ))}
      </div>
    </div>
  );
}

export default FileExplorer;
