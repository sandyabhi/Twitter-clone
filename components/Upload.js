import axios from "axios";
import { useState } from "react";
import { FileDrop } from "react-file-drop";
import { PulseLoader } from "react-spinners";

export default function Upload({ children, onUploadFinish }) {
  const [isFileNearby, setIsFileNearby] = useState(false);
  const [isFileOver, setIsFileOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState("");

  function uploadImage(files, e) {
    //   // if (!editable) {
    //   //   return;
    //   // }
    e.preventDefault();

    setIsFileNearby(false);
    setIsFileOver(false);
    setIsUploading(true);

    // console.log("------------------");
    postDetails(files[0]);

    // handlePostSubmit(e);
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
          console.log("url", data.url.toString());
          setImage(data.url.toString());
          // console.log(image);
          onUploadFinish(image);
          setIsUploading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  //   async function handlePostSubmit(e) {
  //     e.preventDefault();
  //     console.log(image);
  //     await axios.post("/api/upload", { image: image });
  //     // console.log(cover);
  //     // onChange(cover); 03.55 4.29

  //     setIsUploading(false);
  //   }

  let extraClasses = "";
  if (isFileNearby && !isFileOver) extraClasses += " bg-blue-500 opacity-30";
  if (isFileOver) extraClasses += " bg-blue-500 opacity-80";
  // if (!editable) extraClasses = "";

  return (
    <FileDrop
      onDrop={uploadImage}
      onDragOver={() => setIsFileOver(true)}
      onDragLeave={() => setIsFileOver(false)}
      onFrameDragEnter={() => setIsFileNearby(true)}
      onFrameDragLeave={() => setIsFileNearby(false)}
      onFrameDrop={() => {
        setIsFileNearby(false);
        setIsFileOver(false);
      }}
    >
      <div className="relative">
        {(isFileNearby || isFileOver) && (
          <div className="bg-twitterBlue absolute inset-8 flex items-center justify-center ">
            drop your image here
          </div>
        )}
        {children({ isUploading })}
      </div>
    </FileDrop>
  );
}
