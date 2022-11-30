export default function Avatar({ src, big }) {
  return (
    <>
      {big ? (
        <div className="rounded-full w-24 overflow-hidden">
          <img className="object-cover h-24" src={src} alt="avatar"></img>
        </div>
      ) : (
        <div className="rounded-full w-12 overflow-hidden">
          <img className="object-cover h-12" src={src} alt="avatar"></img>
        </div>
      )}
    </>
  );
}
