"use client";

import { useState, useRef } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import {
  FaUpload,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function FileUpload({
  onUpload,
  accept = "image/*, .pdf, .doc, .docx, .txt",
  multiple = false,
  label = "Upload Files",
  description = "Drag and drop or click to select files",
}) {
  const { settings } = useSettings();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Get max upload size from settings
  const maxSizeMB = settings?.maxUploadSize || 5;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (selectedFiles) => {
    setError("");

    // Check total size
    const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > maxSizeBytes) {
      setError(
        `Total files size (${formatFileSize(
          totalSize
        )}) exceeds maximum of ${maxSizeMB}MB`
      );
      return;
    }

    // Check each file size
    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > maxSizeBytes
    );
    if (oversizedFiles.length > 0) {
      setError(
        `${oversizedFiles.length} file(s) exceed maximum size of ${maxSizeMB}MB`
      );
      return;
    }

    // Check for duplicates
    const newFiles = selectedFiles.filter(
      (newFile) =>
        !files.some(
          (existingFile) =>
            existingFile.name === newFile.name &&
            existingFile.size === newFile.size
        )
    );

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setFiles([]);
    setError("");
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select files to upload");
      return;
    }

    setUploading(true);
    setError("");

    try {
      if (onUpload) {
        await onUpload(files);
      }

      setFiles([]);
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getTotalSize = () => {
    return files.reduce((sum, file) => sum + file.size, 0);
  };

  const getUsagePercentage = () => {
    return Math.min(100, (getTotalSize() / maxSizeBytes) * 100);
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) return "🖼️";
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("document") || fileType.includes("word")) return "📝";
    if (fileType.includes("text")) return "📃";
    return "📎";
  };

  return (
    <div className="space-y-4">
      {/* Max size indicator */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Maximum upload size:{" "}
          <span className="font-semibold">{maxSizeMB}MB</span>
        </div>
        <div className="text-xs text-gray-500">
          {files.length} file{files.length !== 1 ? "s" : ""} selected
        </div>
      </div>

      {/* File drop zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
          dragOver
            ? "border-purple-500 bg-purple-50"
            : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center">
          <FaUpload className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">{label}</p>
          <p className="text-sm text-gray-500 mb-4">{description}</p>
          <button
            type="button"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Browse Files
          </button>
          <p className="text-xs text-gray-500 mt-3">
            Supported formats: Images, PDF, Word, Text
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept={accept}
          multiple={multiple}
        />
      </div>

      {/* Size usage bar */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Storage used:</span>
            <span className="font-medium">
              {formatFileSize(getTotalSize())} / {maxSizeMB}MB
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                getUsagePercentage() >= 90
                  ? "bg-red-500"
                  : getUsagePercentage() >= 75
                  ? "bg-yellow-500"
                  : "bg-purple-600"
              }`}
              style={{ width: `${getUsagePercentage()}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span
              className={
                getUsagePercentage() >= 90 ? "text-red-600 font-medium" : ""
              }
            >
              {getUsagePercentage().toFixed(1)}%
            </span>
            <span>100%</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Selected files list */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-700">Selected files:</h4>
            <button
              type="button"
              onClick={clearAllFiles}
              className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
            >
              <FaTimes size={12} /> Clear All
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file, index) => {
              const fileSizePercent = (file.size / maxSizeBytes) * 100;
              const isLargeFile = fileSizePercent > 50;

              return (
                <div
                  key={`${file.name}-${file.size}-${index}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-xl">{getFileIcon(file.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              isLargeFile ? "bg-red-500" : "bg-green-500"
                            }`}
                          />
                          {fileSizePercent.toFixed(1)}% of limit
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove file"
                  >
                    <FaTimes />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Upload button */}
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            className="w-full py-3 px-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Uploading...
              </>
            ) : (
              <>
                <FaUpload />
                Upload {files.length} file{files.length !== 1 ? "s" : ""}
              </>
            )}
          </button>
        </div>
      )}

      {/* Usage tips */}
      <div className="text-xs text-gray-500 space-y-1">
        <p className="flex items-center gap-1">
          <FaCheck className="text-green-500" size={10} />
          Maximum file size: {maxSizeMB}MB per file
        </p>
        <p className="flex items-center gap-1">
          <FaCheck className="text-green-500" size={10} />
          Total upload limit: {maxSizeMB}MB per session
        </p>
        <p className="flex items-center gap-1">
          <FaCheck className="text-green-500" size={10} />
          Files are automatically validated before upload
        </p>
      </div>
    </div>
  );
}
