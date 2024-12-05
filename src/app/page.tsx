import Image from "next/image";
import WebcamCapture from "./webcam-capture";

export default function Home() {
  return (
    <div className="">
      <WebcamCapture></WebcamCapture>
      <h1>Access Camera</h1>
    </div>
  );
}
