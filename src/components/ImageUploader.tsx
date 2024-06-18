"use client";

import React, { useEffect, useState } from "react";

const ImageUploader: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        console.log("Uploading file:", file.name);
        const response = await fetch("/api/compress", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to compress image: ${errorText}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "compressed_image.jpg";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setMessage("Compression successful!");
      } catch (error) {
        console.error("Error:", error);
        setMessage("Compression failed");
      }
    }
  };

  useEffect(() => {
    async function foo() {
      await fetch("/api/compress", {
        method: "GET",
      });
    }
    foo();
  }, []);

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {message && <p>{message}</p>}
    </div>
  );
};

export default ImageUploader;
