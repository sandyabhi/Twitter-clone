export default function Avatar({ src }) {
  return (
    <div className="rounded-full overflow-hidden w-12">
      <img src={src} alt="avatar"></img>
    </div>
  );
}
