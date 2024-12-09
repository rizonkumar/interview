// src/components/FileExplorer/TreeNode.jsx
import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  File,
  Trash,
  Edit2,
  Plus,
} from "lucide-react";

function TreeNode({ name, node, onAdd, onRename, onDelete, level = 0 }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);

  console.log("Is edit", isEditing);

  const toggleExpand = () => {
    if (node?.type === "folder") {
      console.log("Toggling expand", isExpanded);
      setIsExpanded(!isExpanded);
    }
  };

  const handleRenameAction = (parentPath, oldName) => {
    const newName = prompt(`Enter new name for ${oldName}:`);
    if (newName) {
      handleRename(parentPath, oldName, newName);
    }
  };

  const handleRenameSubmit = () => {
    if (editName && editName !== name) {
      onRename(name, editName);
    }
    setIsEditing(false);
  };

  const renderChildren = () => {
    if (node?.type !== "folder" || !isExpanded) return null;

    return (
      <div className="pl-4">
        {node?.children &&
          node?.children.map((child, index) => (
            <TreeNode
              key={index}
              name={child.name}
              node={child}
              onAdd={onAdd}
              onRename={onRename}
              onDelete={onDelete}
              level={level + 1}
            />
          ))}
      </div>
    );
  };

  return (
    <div>
      <div
        className={`
          flex items-center 
          hover:bg-gray-100 
          cursor-pointer 
          text-sm 
          py-1 
          ${isEditing ? "bg-blue-50" : ""}
        `}
        style={{ paddingLeft: `${level * 16}px` }}
      >
        {node?.type === "folder" && (
          <button
            onClick={toggleExpand}
            className="mr-1 hover:bg-gray-200 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
        )}

        <div className="flex items-center flex-grow">
          {node?.type === "folder" ? (
            <Folder className="w-4 h-4 mr-2 text-yellow-500" />
          ) : (
            <File className="w-4 h-4 mr-2 text-blue-600" />
          )}

          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyPress={(e) => e.key === "Enter" && handleRenameSubmit()}
              className="border rounded px-1 flex-grow"
              autoFocus
            />
          ) : (
            <span onClick={toggleExpand}>{name}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-1 ml-2">
          {node?.type === "folder" && (
            <button
              onClick={() => onAdd(name, true)}
              className="hover:bg-gray-200 rounded p-1"
              title="New Folder"
            >
              <Plus className="w-4 h-4 text-gray-500" />
            </button>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="hover:bg-gray-200 rounded p-1"
            title="Rename"
          >
            <Edit2 className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => onDelete(name)}
            className="hover:bg-gray-200 rounded p-1"
            title="Delete"
          >
            <Trash className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      {renderChildren()}
    </div>
  );
}

export default TreeNode;
