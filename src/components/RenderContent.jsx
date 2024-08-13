import { useEffect, useState } from "react";
import { useFirebase } from "../Firebase";

const RenderContent = ({ title, value, url }) => {
  const [contentType, setContentType] = useState("");
  const { getFileMetadata } = useFirebase();

  useEffect(() => {
    const fetchMetadata = async () => {
      if (url) {
        const metadata = await getFileMetadata(url);
        setContentType(metadata?.contentType || "");
      }
    };
    fetchMetadata();
  }, [url]);

  const isPDF = contentType === "application/pdf";

  return (
    <div className="mb-4">
      <h4 className="text-md font-semibold">{title}:</h4>
      {value && <p className="text-gray-700">{value}</p>}
      {url && (
        <>
          {isPDF ? (
            <embed
              src={url}
              type="application/pdf"
              className=" max-w-full rounded-md shadow-sm"
              width="80%"
              height="400px"
            />
          ) : (
            <img
              src={url}
              alt={title}
              className="h-auto max-w-full rounded-md shadow-sm"
            />
          )}
        </>
      )}
    </div>
  );
};

export default RenderContent;
