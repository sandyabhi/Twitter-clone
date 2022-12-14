import axios from "axios";
import { useState } from "react";
import { FileDrop } from "react-file-drop";
import { PulseLoader } from "react-spinners";

export default function Cover({ src, editable, onChange }) {
  const [isFileNearby, setIsFileNearby] = useState(false);
  const [isFileOver, setIsFileOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState("");

  function updateImage(files, e) {
    if (!editable) {
      return;
    }
    e.preventDefault();

    setIsFileNearby(false);
    setIsFileOver(false);
    setIsUploading(true);

    postDetails(files[0]);

    handlePostSubmit(e);
  }

  const postDetails = (pics) => {
    // console.log(pics);

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "ddvaqiesi");
      fetch(`https://api.cloudinary.com/v1_1/ddvaqiesi/image/upload`, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log("url", data.url.toString());
          // return data.url.toString()
          setImage(data.url.toString());
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  async function handlePostSubmit(e) {
    e.preventDefault();
    // console.log(image);
    await axios.post("/api/upload", { image: image });
    console.log(image);
    // onChange(cover); 03.55
    onChange(image);

    setIsUploading(false);
  }

  let extraClasses = "";
  if (isFileNearby && !isFileOver) extraClasses += " bg-blue-500 opacity-30";
  if (isFileOver) extraClasses += " bg-blue-500 opacity-80";
  if (!editable) extraClasses = "";

  return (
    <FileDrop
      onDrop={updateImage}
      onDragOver={() => setIsFileOver(true)}
      onDragLeave={() => setIsFileOver(false)}
      onFrameDragEnter={() => setIsFileNearby(true)}
      onFrameDragLeave={() => setIsFileNearby(false)}
    >
      <div className={"bg-twitterBorder text-white relative"}>
        <div className={"absolute inset-0" + extraClasses}></div>
        {isUploading && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: "rgba(48,140,216,0.9)" }}
          >
            <PulseLoader size={14} color={"#fff"} />
          </div>
        )}

        <div className={"flex items-center overflow-hidden h-36"}>
          {src && <img src={src} className="w-full" alt="" />}
        </div>
      </div>
    </FileDrop>
  );
}
